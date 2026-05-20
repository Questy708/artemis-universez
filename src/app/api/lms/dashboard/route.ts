import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await db.lMSUser.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userRole = role || user.role;

    // Common stats
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      userEnrollments,
    ] = await Promise.all([
      db.lMSUser.count(),
      db.course.count({ where: { status: 'active' } }),
      db.enrollment.count(),
      db.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              modules: { include: { lessons: true } },
              assignments: { include: { submissions: { where: { userId } } } },
            },
          },
        },
      }),
    ]);

    // Student-specific data
    let upcomingAssignments: unknown[] = [];
    let recentSubmissions: unknown[] = [];
    let studentProgress: unknown[] = [];

    if (userRole === 'student') {
      const enrolledCourseIds = userEnrollments.map((e) => e.courseId);

      upcomingAssignments = await db.assignment.findMany({
        where: {
          courseId: { in: enrolledCourseIds },
          status: 'open',
          dueDate: { gte: new Date() },
        },
        include: { course: { select: { title: true, code: true } } },
        orderBy: { dueDate: 'asc' },
        take: 5,
      });

      recentSubmissions = await db.assignmentSubmission.findMany({
        where: { userId },
        include: {
          assignment: { include: { course: { select: { title: true, code: true } } } },
        },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      });

      studentProgress = userEnrollments.map((e) => ({
        courseId: e.courseId,
        courseTitle: e.course.title,
        courseCode: e.course.code,
        progress: e.progress,
        totalLessons: e.course.modules.reduce((acc, m) => acc + m.lessons.length, 0),
        status: e.status,
      }));
    }

    // Tutor-specific data
    let pendingReviewCount = 0;
    let aiReviewedSubmissions: unknown[] = [];
    let tutoredCourses: unknown[] = [];

    if (userRole === 'tutor') {
      const tutorEnrollments = await db.enrollment.findMany({
        where: { userId, role: 'tutor' },
        include: { course: true },
      });

      tutoredCourses = tutorEnrollments.map((e) => ({
        courseId: e.courseId,
        courseTitle: e.course.title,
        courseCode: e.course.code,
      }));

      const tutoredCourseIds = tutorEnrollments.map((e) => e.courseId);

      const allSubmissions = await db.assignmentSubmission.findMany({
        where: {
          assignment: { courseId: { in: tutoredCourseIds } },
        },
        include: {
          user: { select: { name: true, email: true } },
          assignment: { include: { course: { select: { title: true } } } },
        },
        orderBy: { submittedAt: 'desc' },
      });

      pendingReviewCount = allSubmissions.filter((s) => s.status === 'submitted').length;
      aiReviewedSubmissions = allSubmissions.filter((s) => s.status === 'ai_reviewed');
    }

    // Admin-specific data
    let allUsersList: unknown[] = [];
    let allCoursesList: unknown[] = [];

    if (userRole === 'admin') {
      allUsersList = await db.lMSUser.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      allCoursesList = await db.course.findMany({
        include: {
          _count: { select: { enrollments: true, assignments: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      stats: { totalUsers, totalCourses, totalEnrollments },
      studentData: {
        enrollments: userEnrollments,
        upcomingAssignments,
        recentSubmissions,
        studentProgress,
      },
      tutorData: {
        pendingReviewCount,
        aiReviewedSubmissions,
        tutoredCourses,
      },
      adminData: {
        allUsers: allUsersList,
        allCourses: allCoursesList,
      },
    });
  } catch (error) {
    console.error('LMS Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
