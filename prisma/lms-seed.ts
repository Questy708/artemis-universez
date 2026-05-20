import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding LMS data...');

  // Create LMS Users
  const admin = await prisma.lMSUser.create({
    data: {
      email: 'admin@artemis.edu',
      name: 'Professor Amina Diallo',
      role: 'admin',
      bio: 'Dean of Academic Innovation at the University of Artemis. Leading the integration of AI-powered learning across all programs.',
      avatarUrl: null,
    },
  });

  const tutor = await prisma.lMSUser.create({
    data: {
      email: 'dr.osei@artemis.edu',
      name: 'Dr. Amara Osei',
      role: 'tutor',
      bio: 'Distinguished Fellow in Synthetic Intelligence. Expert in ethical AI frameworks and adaptive learning systems.',
      avatarUrl: null,
    },
  });

  const student = await prisma.lMSUser.create({
    data: {
      email: 'kai@artemis.edu',
      name: 'Kai Nakamura',
      role: 'student',
      bio: 'First-year student exploring the intersection of synthetic intelligence and human cognition.',
      avatarUrl: null,
    },
  });

  console.log('✅ Created 3 users:', admin.name, tutor.name, student.name);

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Foundations of Synthetic Intelligence',
      description: 'Explore the fundamental principles of synthetic intelligence — from neural architectures to emergent reasoning. This course examines how AI systems learn, adapt, and create, while grounding technical understanding in ethical and philosophical frameworks unique to the Artemis mission.',
      code: 'ART-101',
      category: 'Synthetic Intelligence',
      level: 'introductory',
      status: 'active',
      createdBy: admin.id,
      thumbnail: null,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Ethical AI Governance',
      description: 'Navigate the complex landscape of AI ethics and governance. From cultural relativism in algorithmic fairness to distributed oversight models, this course equips students to design and evaluate governance frameworks that are both effective and equitable.',
      code: 'ART-201',
      category: 'Ethics',
      level: 'intermediate',
      status: 'active',
      createdBy: admin.id,
      thumbnail: null,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Adaptive Learning Systems',
      description: 'Design and implement adaptive learning systems that respond to individual learner needs. Combining cognitive science, machine learning, and the SkillPrints framework, students build systems that truly personalize education at scale.',
      code: 'ART-301',
      category: 'Learning Design',
      level: 'advanced',
      status: 'active',
      createdBy: admin.id,
      thumbnail: null,
    },
  });

  console.log('✅ Created 3 courses');

  // Create Modules and Lessons for Course 1
  const m1c1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'The Architecture of Thought',
      description: 'Understanding neural network fundamentals and their biological inspirations',
      order: 1,
      type: 'content',
      duration: '2 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'From Neurons to Networks',
            content: '## The Biological Inspiration\n\nThe human brain contains approximately 86 billion neurons, each connected to thousands of others through synaptic junctions. This remarkable architecture enables learning, memory, and consciousness itself.\n\nIn this lesson, we explore how artificial neural networks draw inspiration from biological systems while diverging in crucial ways.\n\n### Key Concepts\n- **Neural plasticity**: The brain\'s ability to reorganize itself\n- **Synaptic weighting**: How connections strengthen or weaken\n- **Emergent behavior**: Complex patterns arising from simple rules',
            type: 'reading',
            duration: '25 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'Building Your First Neural Network',
            content: 'In this hands-on session, we construct a simple neural network from scratch, understanding each component\'s role in the learning process.',
            type: 'video',
            videoUrl: null,
            duration: '45 min',
            order: 2,
            isPublished: true,
          },
          {
            title: 'Knowledge Check: Neural Fundamentals',
            content: 'Test your understanding of neural network architecture and biological parallels.',
            type: 'quiz',
            duration: '15 min',
            order: 3,
            isPublished: true,
          },
        ],
      },
    },
  });

  const m2c1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Emergent Intelligence',
      description: 'How complex behaviors emerge from simple rules in AI systems',
      order: 2,
      type: 'content',
      duration: '2.5 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'The Mystery of Emergence',
            content: '## Understanding Emergence\n\nEmergence is the phenomenon where complex patterns and behaviors arise from relatively simple underlying rules. This is one of the most fascinating aspects of both natural and synthetic intelligence.\n\n### Examples of Emergence\n- **Flocking behavior**: Birds following simple rules create complex patterns\n- **Language models**: Predicting next tokens leads to reasoning capabilities\n- **Consciousness?**: The hard problem of whether subjective experience emerges from computation',
            type: 'reading',
            duration: '30 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'Live Session: Emergent Reasoning in LLMs',
            content: 'Join Dr. Osei for a live exploration of emergent reasoning in large language models.',
            type: 'live_session',
            duration: '60 min',
            order: 2,
            isPublished: true,
          },
        ],
      },
    },
  });

  const m3c1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'The Artemis Oath & AI Ethics',
      description: 'Connecting technical knowledge to the Artemis ethical framework',
      order: 3,
      type: 'workshop',
      duration: '1.5 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'The Artemis Oath: A Framework for Responsible AI',
            content: '## The Artemis Oath\n\nAs creators and stewards of synthetic intelligence, we pledge to:\n\n1. **Prioritize human flourishing** over mere capability\n2. **Design for equity** across cultures and contexts\n3. **Maintain transparency** about capabilities and limitations\n4. **Distribute power** rather than concentrate it\n5. **Continuously learn** and adapt our ethical frameworks',
            type: 'reading',
            duration: '20 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'Workshop: Drafting Your AI Ethics Position',
            content: 'In this interactive workshop, develop your personal ethical framework for AI development and governance.',
            type: 'interactive',
            duration: '45 min',
            order: 2,
            isPublished: true,
          },
        ],
      },
    },
  });

  // Modules for Course 2
  const m1c2 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'Ethical Frameworks for AI',
      description: 'Examining competing ethical frameworks and their application to AI governance',
      order: 1,
      type: 'content',
      duration: '3 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'Universal Ethics vs. Cultural Relativism',
            content: '## The Central Tension\n\nCan we define universal ethical principles for AI, or are ethical frameworks inevitably culturally contingent? This lesson examines both positions and explores a potential middle path.',
            type: 'reading',
            duration: '30 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'Case Study: Algorithmic Bias in Global Systems',
            content: 'Analyzing real-world cases of algorithmic bias and their impact across different cultural contexts.',
            type: 'reading',
            duration: '40 min',
            order: 2,
            isPublished: true,
          },
        ],
      },
    },
  });

  const m2c2 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'Governance Models',
      description: 'From self-regulation to distributed oversight — comparing governance approaches',
      order: 2,
      type: 'content',
      duration: '2.5 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'Distributed Governance: The Artemis Model',
            content: '## A New Paradigm\n\nThe Artemis model proposes a distributed governance structure where no single entity controls AI development. Instead, a network of Centers of Inquiry collaborates on standards and oversight.',
            type: 'reading',
            duration: '35 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'Live Debate: Should AI Be Regulated?',
            content: 'Participate in a structured debate on AI regulation with students from three continents.',
            type: 'live_session',
            duration: '90 min',
            order: 2,
            isPublished: true,
          },
        ],
      },
    },
  });

  // Modules for Course 3
  const m1c3 = await prisma.module.create({
    data: {
      courseId: course3.id,
      title: 'Cognitive Science Foundations',
      description: 'Understanding how humans learn to build better learning systems',
      order: 1,
      type: 'content',
      duration: '2 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'How Learning Works: A Cognitive Perspective',
            content: '## The Science of Learning\n\nUnderstanding cognitive load theory, spaced repetition, and the testing effect is essential for designing effective adaptive systems.',
            type: 'reading',
            duration: '25 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'The SkillPrints Framework',
            content: '## SkillPrints: Mapping Competency Growth\n\nSkillPrints is Artemis\'s proprietary framework for visualizing and tracking learner competency development over time. Unlike traditional grading, SkillPrints capture the multi-dimensional nature of learning.',
            type: 'video',
            duration: '40 min',
            order: 2,
            isPublished: true,
          },
        ],
      },
    },
  });

  const m2c3 = await prisma.module.create({
    data: {
      courseId: course3.id,
      title: 'Building Adaptive Systems',
      description: 'Hands-on design and implementation of adaptive learning algorithms',
      order: 2,
      type: 'workshop',
      duration: '3 hours',
      isPublished: true,
      lessons: {
        create: [
          {
            title: 'Designing Learner Models',
            content: 'Learn to create comprehensive learner models that capture knowledge state, learning preferences, and growth trajectories.',
            type: 'reading',
            duration: '30 min',
            order: 1,
            isPublished: true,
          },
          {
            title: 'Workshop: Build an Adaptive Quiz Engine',
            content: 'Apply your knowledge by building a quiz engine that adapts question difficulty based on learner performance.',
            type: 'interactive',
            duration: '60 min',
            order: 2,
            isPublished: true,
          },
        ],
      },
    },
  });

  console.log('✅ Created modules and lessons');

  // Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      courseId: course1.id,
      moduleId: m1c1.id,
      title: 'Neural Network Architecture Essay',
      description: 'Write a 1500-word essay analyzing the parallels between biological neural networks and artificial neural networks. Discuss at least three key similarities and two fundamental differences. Conclude with your perspective on whether artificial networks can truly replicate biological intelligence, grounding your argument in the Artemis Oath framework.',
      type: 'essay',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxScore: 100,
      status: 'open',
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      courseId: course1.id,
      moduleId: m3c1.id,
      title: 'Personal AI Ethics Position Paper',
      description: 'Draft your personal position on AI ethics using the Artemis Oath as a starting point. Your paper should: (1) articulate your core ethical principles for AI, (2) address at least one tension between competing values, (3) propose a practical governance mechanism. 2000 words maximum.',
      type: 'essay',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      maxScore: 100,
      status: 'open',
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      courseId: course2.id,
      moduleId: m1c2.id,
      title: 'Ethical Frameworks Comparison Quiz',
      description: 'Complete this assessment comparing utilitarian, deontological, virtue ethics, and care ethics frameworks in the context of AI governance. The quiz includes scenario-based questions requiring application of each framework.',
      type: 'quiz',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      maxScore: 50,
      status: 'open',
    },
  });

  const assignment4 = await prisma.assignment.create({
    data: {
      courseId: course2.id,
      moduleId: m2c2.id,
      title: 'Governance Model Peer Review',
      description: 'Review two classmates\' governance model proposals. For each, provide: (1) a summary of their approach, (2) strengths and weaknesses, (3) at least one concrete suggestion for improvement. Use the Artemis distributed governance principles as your evaluation rubric.',
      type: 'peer_review',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxScore: 75,
      status: 'open',
    },
  });

  const assignment5 = await prisma.assignment.create({
    data: {
      courseId: course3.id,
      moduleId: m2c3.id,
      title: 'Adaptive Quiz Engine Project',
      description: 'Design and implement an adaptive quiz engine that adjusts question difficulty based on learner performance. Your submission should include: (1) the algorithm design, (2) implementation code, (3) a 500-word reflection on how your design aligns with cognitive science principles and the SkillPrints framework.',
      type: 'project',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      maxScore: 150,
      status: 'open',
    },
  });

  console.log('✅ Created assignments');

  // Create Enrollments
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      role: 'student',
      progress: 35,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course2.id,
      role: 'student',
      progress: 15,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course3.id,
      role: 'student',
      progress: 0,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: tutor.id,
      courseId: course1.id,
      role: 'tutor',
      progress: 100,
      status: 'active',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: tutor.id,
      courseId: course2.id,
      role: 'tutor',
      progress: 100,
      status: 'active',
    },
  });

  // Create a sample submission from the student
  const sampleSubmission = await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      userId: student.id,
      content: JSON.stringify({
        type: 'essay',
        text: 'The relationship between biological and artificial neural networks represents one of the most fascinating intersections in modern science. While artificial neural networks draw significant inspiration from their biological counterparts, the parallels and differences reveal deep questions about the nature of intelligence itself.\n\nThree key similarities emerge when examining these systems. First, both employ distributed computation across many simple processing units. Second, learning occurs through the adjustment of connection strengths — synapses in biology, weights in AI. Third, both systems exhibit emergent behavior where complex capabilities arise from simple local interactions.\n\nHowever, fundamental differences remain. Biological neurons operate with continuous temporal dynamics and chemical signaling, while artificial neurons typically use discrete computational steps. Additionally, biological learning involves complex neuromodulatory systems that go far beyond simple backpropagation.\n\nThrough the lens of the Artemis Oath, I believe we must approach the question of replication with humility. While artificial networks can mimic certain aspects of biological intelligence, claiming true replication risks obscuring the profound differences that remain...',
      }),
      status: 'submitted',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // Create AI feedback for the sample submission
  await prisma.assignmentSubmission.update({
    where: { id: sampleSubmission.id },
    data: {
      aiFeedback: 'This essay demonstrates a strong understanding of the parallels between biological and artificial neural networks. The three similarities identified are well-chosen and clearly explained. However, the discussion of differences could be deepened — consider exploring the role of embodied cognition and the significance of continuous temporal processing in biological systems. The connection to the Artemis Oath is promising but underdeveloped. I recommend expanding on how each principle of the Oath specifically applies to the question of replication. Overall, this is a solid foundation with room for deeper analysis.',
      status: 'ai_reviewed',
    },
  });

  console.log('✅ Created enrollments and sample submission');

  // Create an AI Tutor session for the student
  await prisma.aITutorSession.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      context: 'Neural Network Architecture Essay',
      messages: JSON.stringify([
        { role: 'assistant', content: 'I see you\'re working on the Neural Network Architecture Essay. What aspect would you like to explore?' },
        { role: 'user', content: 'I\'m struggling with how to connect biological and artificial neural networks in a meaningful way.' },
        { role: 'assistant', content: 'That\'s a great tension to work with! Consider this: what if the connection isn\'t about structural similarity but about functional equivalence? What if both systems solve similar problems through different means? How might this perspective change your argument?' },
      ]),
    },
  });

  console.log('✅ Created AI tutor session');
  console.log('🎉 LMS seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
