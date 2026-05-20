'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  BookOpen,
  Settings,
  TrendingUp,
  BarChart3,
  Shield,
  Search,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface AdminPanelProps {
  user: LMSUser;
}

interface AdminData {
  allUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    bio?: string | null;
    createdAt: string;
    lastActiveAt?: string;
  }>;
  allCourses: Array<{
    id: string;
    title: string;
    code: string;
    status: string;
    level: string;
    _count: { enrollments: number; assignments: number };
  }>;
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'analytics'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch(`/api/lms/dashboard?userId=${user.id}&role=admin`);
        const json = await res.json();
        setData(json.adminData);
      } catch (err) {
        console.error('Admin data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  const filteredUsers = data?.allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredCourses = data?.allCourses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalStudents = data?.allUsers.filter((u) => u.role === 'student').length || 0;
  const totalTutors = data?.allUsers.filter((u) => u.role === 'tutor').length || 0;
  const totalAdmins = data?.allUsers.filter((u) => u.role === 'admin').length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#8A0000]" />
            Administration
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage users, courses, and system settings</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8A0000] text-white rounded-lg text-sm hover:bg-[#9B0F0F] transition-colors">
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Students', value: totalStudents, icon: <Users className="w-4 h-4" />, color: 'text-emerald-400' },
          { label: 'Tutors', value: totalTutors, icon: <BookOpen className="w-4 h-4" />, color: 'text-amber-400' },
          { label: 'Admins', value: totalAdmins, icon: <Shield className="w-4 h-4" />, color: 'text-[#8A0000]' },
          { label: 'Active Courses', value: data?.allCourses.filter((c) => c.status === 'active').length || 0, icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-400' },
          { label: 'Total Enrollments', value: data?.allCourses.reduce((a, c) => a + c._count.enrollments, 0) || 0, icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1 border border-white/5 w-fit">
        {[
          { id: 'users' as const, label: 'Users', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'courses' as const, label: 'Courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'analytics' as const, label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-[#8A0000] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1a1a1a] border border-white/5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8A0000]/50 transition-all"
        />
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">User</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Email</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Role</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Joined</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8A0000] flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        u.role === 'admin' ? 'bg-[#8A0000]/10 text-[#ff4444]' :
                        u.role === 'tutor' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Course</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Code</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Level</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Status</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Enrolled</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCourses.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="px-5 py-3 text-sm text-white">{c.title}</td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400 capitalize">{c.level}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400">{c._count.enrollments}</td>
                    <td className="px-5 py-3 text-right">
                      <button className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enrollment Chart Placeholder */}
          <motion.div
            className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#8A0000]" />
              Enrollment Trends
            </h3>
            <div className="space-y-3">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">{month}</span>
                  <div className="flex-1 h-6 bg-[#0f0f0f] rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-[#8A0000] rounded"
                      initial={{ width: 0 }}
                      animate={{ width: `${30 + i * 15}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-mono w-8">{30 + i * 15}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Course Distribution */}
          <motion.div
            className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8A0000]" />
              Course Distribution
            </h3>
            <div className="space-y-4">
              {data?.allCourses.map((course, i) => (
                <div key={course.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">{course.code} - {course.title.slice(0, 25)}...</span>
                    <span className="text-gray-500">{course._count.enrollments} students</span>
                  </div>
                  <div className="w-full h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#8A0000] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(course._count.enrollments * 30, 100)}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#8A0000]" />
              System Health
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'API Status', value: 'Operational', color: 'text-emerald-400' },
                { label: 'Database', value: 'Connected', color: 'text-emerald-400' },
                { label: 'AI Service', value: 'Active', color: 'text-emerald-400' },
                { label: 'Uptime', value: '99.9%', color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="bg-[#0f0f0f] rounded-lg p-3 border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
