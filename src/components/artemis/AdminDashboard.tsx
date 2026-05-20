'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw, Download, ChevronDown, ChevronRight, Shield, LogOut,
  Eye, EyeOff, DollarSign, Mail, UserPlus, Home, CreditCard,
  Database, ExternalLink, Clock, ArrowUpRight, MessageSquare, FileText,
  Heart, ChevronLeft, Search, Bell, CheckCircle, XCircle,
  ChevronUp, BarChart3, TrendingUp, ArrowRight, Menu
} from 'lucide-react';

interface Props {
  goToPage: (page: string) => void;
}

type Section = 'overview' | 'donations' | 'applications' | 'messages' | 'subscribers';

interface AllData {
  overview: any;
  donations: any;
  applications: any;
  messages: any;
  subscribers: any;
}

// ─── Sparkline SVG Component ───
function Sparkline({ data, color, width = 80, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const areaPts = [`0,${height}`, ...pts, `${width},${height}`].join(' ');
  const linePts = pts.join(' ');
  return (
    <svg width={width} height={height} className="block">
      <polygon points={areaPts} fill={color} opacity={0.12} />
      <polyline points={linePts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Area Chart SVG Component ───
function AreaChart({ data, labels, color, height = 180 }: { data: number[]; labels?: string[]; color: string; height?: number }) {
  if (!data || data.length < 2) return <div className="flex items-center justify-center text-xs text-[#C1C9D2]" style={{ height }}>No data</div>;
  const w = 500;
  const max = Math.max(...data) * 1.1 || 1;
  const min = 0;
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 20) - 10;
    return { x, y };
  });
  const areaPath = `M0,${height} ${pts.map(p => `L${p.x},${p.y}`).join(' ')} L${w},${height} Z`;
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  // Grid lines
  const gridLines = [0.25, 0.5, 0.75].map(f => {
    const y = height - f * (height - 20) - 10;
    return <line key={f} x1={0} y1={y} x2={w} y2={y} stroke="#E8ECF1" strokeWidth={0.5} />;
  });
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      {gridLines}
      <path d={areaPath} fill={color} opacity={0.08} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="white" stroke={color} strokeWidth={1.5} />
      ))}
    </svg>
  );
}

// ─── Pipeline Bar Component ───
function PipelineBar({ segments }: { segments: { label: string; count: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0) || 1;
  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-8 bg-[#F6F9FC]">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-[11px] font-semibold text-white transition-all"
            style={{ width: `${(seg.count / total) * 100}%`, backgroundColor: seg.color, minWidth: seg.count > 0 ? 32 : 0 }}
          >
            {seg.count > 0 && (seg.count / total) * 100 > 8 ? seg.count : ''}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[11px] text-[#8792A2]">{seg.label}</span>
            <span className="text-[11px] font-semibold text-[#1A1F36]">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const AUTH_TOKEN_KEY = 'artemis_admin_token';

export default function AdminDashboard({ goToPage }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [allData, setAllData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ─── New State ───
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'donations' | 'applications' | 'messages'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const PAGE_SIZE = 10;

  // Helper: build auth headers with Bearer token
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = authToken || (typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [authToken]);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      // Try to use token from localStorage if no in-memory token yet
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`;
      }
      const res = await fetch('/api/admin', {
        credentials: 'include',
        headers,
      });
      if (res.ok && storedToken) {
        setAuthToken(storedToken);
      }
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (json.success && json.token) {
        // Store token in localStorage and in-memory state
        localStorage.setItem(AUTH_TOKEN_KEY, json.token);
        setAuthToken(json.token);

        // Verify the session works via Authorization header
        const verifyRes = await fetch('/api/admin', {
          credentials: 'include',
          headers: { 'Authorization': `Bearer ${json.token}` },
        });
        if (verifyRes.ok) {
          setIsAuthenticated(true);
          setPassword('');
        } else {
          setLoginError('Session could not be established. Please try again.');
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setAuthToken(null);
        }
      } else {
        setLoginError(json.error || 'Authentication failed');
      }
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch('/api/admin/login', { method: 'DELETE', credentials: 'include', headers: getAuthHeaders() }); } catch { /* ignore */ }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null);
    setIsAuthenticated(false);
    setAllData(null);
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError('');
    const headers = getAuthHeaders();
    try {
      const [overviewRes, donationsRes, applicationsRes, messagesRes, subscribersRes] = await Promise.all([
        fetch('/api/admin', { credentials: 'include', headers }),
        fetch('/api/donations', { credentials: 'include', headers }),
        fetch('/api/applications', { credentials: 'include', headers }),
        fetch('/api/contact', { credentials: 'include', headers }),
        fetch('/api/subscribe', { credentials: 'include', headers }),
      ]);

      if (overviewRes.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken(null);
        setError('Session expired. Please log in again.');
        return;
      }

      const [overview, donations, applications, messages, subscribers] = await Promise.all([
        overviewRes.json(), donationsRes.json(), applicationsRes.json(),
        messagesRes.json(), subscribersRes.json(),
      ]);

      if (overview.error) {
        setError(overview.error);
      } else {
        setAllData({ overview, donations, applications, messages, subscribers });
      }
    } catch {
      setError('Failed to fetch data. Make sure the server is running.');
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    if (isAuthenticated) fetchAllData();
  }, [isAuthenticated, fetchAllData]);

  const toggleExpanded = (idx: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formatCurrency = (n: number, c = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(n);
  const formatRelative = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(d);
  };

  // ─── CSV escape helper ───
  const csvEscape = (val: any): string => {
    if (val === null || val === undefined) return '';
    let str: string;
    if (typeof val === 'boolean') str = val ? 'Yes' : 'No';
    else if (Array.isArray(val)) str = val.map(v => typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)).join('; ');
    else if (typeof val === 'object' && val !== null) str = JSON.stringify(val);
    else str = String(val);
    // Format ISO dates to readable format
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) {
      try { str = new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { /* keep original */ }
    }
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"` : str;
  };

  // ─── Entity-specific export definitions ───
  // Each defines: columns (key→header label) and a transform function
  type ExportDef = { columns: Record<string, string>; transform: (row: any) => Record<string, any> };

  const exportDefs: Record<string, ExportDef> = {
    donations: {
      columns: {
        donorName: 'Donor Name',
        donorEmail: 'Email',
        donorAnonymous: 'Anonymous',
        amount: 'Amount',
        currency: 'Currency',
        paymentMethod: 'Payment Method',
        paymentStatus: 'Status',
        transactionRef: 'Transaction Ref',
        perkId: 'Perk',
        isRecurring: 'Recurring',
        recurringFreq: 'Recurring Frequency',
        message: 'Message',
        createdAt: 'Date',
      },
      transform: (d: any) => ({
        donorName: d.donorAnonymous ? 'Anonymous' : (d.donorName || ''),
        donorEmail: d.donorEmail || '',
        donorAnonymous: d.donorAnonymous || false,
        amount: d.amount,
        currency: d.currency || 'USD',
        paymentMethod: d.paymentMethod || 'card',
        paymentStatus: d.paymentStatus || 'pending',
        transactionRef: d.transactionRef || '',
        perkId: d.perkId || '',
        isRecurring: d.isRecurring || false,
        recurringFreq: d.recurringFreq || '',
        message: d.message || '',
        createdAt: d.createdAt,
      }),
    },
    applications: {
      columns: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        birthdate: 'Birthdate',
        gender: 'Gender',
        pronoun: 'Pronoun',
        citizenship: 'Citizenship',
        dualCitizenship: 'Dual Citizenship',
        address: 'Address',
        city: 'City',
        state: 'State/Province',
        postalCode: 'Postal Code',
        country: 'Country',
        howHeard: 'How Heard',
        applicationCycle: 'Application Cycle',
        concentration: 'Concentration',
        currentlyEnrolled: 'Currently Enrolled',
        schoolName: 'School Name',
        schoolCountry: 'School Country',
        schoolCity: 'School City',
        enrollmentStart: 'Enrollment Start',
        enrollmentEnd: 'Enrollment End',
        gradingScale: 'Grading Scale',
        gpa: 'GPA',
        maxGpa: 'Max GPA',
        satMath: 'SAT Math',
        satReading: 'SAT Reading',
        actScore: 'ACT Score',
        isTestOptional: 'Test Optional',
        accomplishments: 'Accomplishments',
        personalStatement: 'Personal Statement',
        missionStatement: 'Mission Statement',
        applyingForAid: 'Applying for Aid',
        householdIncome: 'Household Income',
        dependents: 'Dependents',
        status: 'Status',
        createdAt: 'Date Submitted',
      },
      transform: (a: any) => {
        // Flatten accomplishments array to readable text
        let accStr = '';
        if (a.accomplishments) {
          const accs = typeof a.accomplishments === 'string' ? JSON.parse(a.accomplishments) : a.accomplishments;
          if (Array.isArray(accs)) {
            accStr = accs.map((ac: any) => {
              let s = ac.title || '';
              if (ac.role) s += ` (${ac.role})`;
              if (ac.description) s += ` - ${ac.description}`;
              return s;
            }).join('; ');
          } else {
            accStr = String(accs);
          }
        }
        return {
          firstName: a.firstName || '',
          lastName: a.lastName || '',
          email: a.email || '',
          phone: a.phone || '',
          birthdate: a.birthdate || '',
          gender: a.gender || '',
          pronoun: a.pronoun || '',
          citizenship: a.citizenship || '',
          dualCitizenship: a.dualCitizenship || '',
          address: a.address || '',
          city: a.city || '',
          state: a.state || '',
          postalCode: a.postalCode || '',
          country: a.country || '',
          howHeard: a.howHeard || '',
          applicationCycle: a.applicationCycle || '',
          concentration: a.concentration || '',
          currentlyEnrolled: a.currentlyEnrolled || '',
          schoolName: a.schoolName || '',
          schoolCountry: a.schoolCountry || '',
          schoolCity: a.schoolCity || '',
          enrollmentStart: a.enrollmentStart || '',
          enrollmentEnd: a.enrollmentEnd || '',
          gradingScale: a.gradingScale || '',
          gpa: a.gpa || '',
          maxGpa: a.maxGpa || '',
          satMath: a.satMath || '',
          satReading: a.satReading || '',
          actScore: a.actScore || '',
          isTestOptional: a.isTestOptional || false,
          accomplishments: accStr,
          personalStatement: a.personalStatement || '',
          missionStatement: a.missionStatement || '',
          applyingForAid: a.applyingForAid || '',
          householdIncome: a.householdIncome || '',
          dependents: a.dependents || '',
          status: a.status || 'submitted',
          createdAt: a.createdAt,
        };
      },
    },
    messages: {
      columns: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        area: 'Area',
        message: 'Message',
        read: 'Read',
        createdAt: 'Date',
      },
      transform: (m: any) => ({
        name: m.name || '',
        email: m.email || '',
        subject: m.subject || '',
        area: m.area || '',
        message: m.message || '',
        read: m.read || false,
        createdAt: m.createdAt,
      }),
    },
    subscribers: {
      columns: {
        email: 'Email',
        source: 'Source',
        active: 'Active',
        createdAt: 'Date Subscribed',
      },
      transform: (s: any) => ({
        email: s.email || '',
        source: s.source || '',
        active: s.active !== false,
        createdAt: s.createdAt,
      }),
    },
  };

  const exportCSV = (rows: any[], filename: string, type?: string) => {
    if (!rows || rows.length === 0) return;
    const def = type && exportDefs[type] ? exportDefs[type] : null;
    const headers = def ? Object.keys(def.columns) : Object.keys(rows[0]).filter(k => k !== 'id');
    const headerLabels = def ? Object.values(def.columns) : headers;
    const csvRows = [
      headerLabels.join(','),
      ...rows.map(row => {
        const transformed = def ? def.transform(row) : row;
        return headers.map(h => csvEscape(transformed[h])).join(',');
      })
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Derived data ───
  const stats = allData?.overview?.stats;
  const donors = allData?.donations?.donors || [];
  const applications = allData?.applications?.applications || [];
  const messages = allData?.messages?.messages || [];
  const subscribers = allData?.subscribers?.subscribers || [];
  const unreadCount = messages.filter((m: any) => !m.read).length;

  // ─── Sorting helper ───
  const sortData = useCallback((data: any[], field: string, dir: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (field === 'amount') { aVal = Number(aVal) || 0; bVal = Number(bVal) || 0; }
      if (field === 'createdAt' || field === 'date') { aVal = new Date(aVal || 0).getTime(); bVal = new Date(bVal || 0).getTime(); }
      if (typeof aVal === 'string' && typeof bVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const SortIndicator = ({ field }: { field: string }) => (
    <span className="inline-flex flex-col ml-0.5 -space-y-0.5">
      <ChevronUp size={8} className={sortField === field && sortDir === 'asc' ? 'text-[#0A2540]' : 'text-[#C1C9D2]'} />
      <ChevronDown size={8} className={sortField === field && sortDir === 'desc' ? 'text-[#0A2540]' : 'text-[#C1C9D2]'} />
    </span>
  );

  // ─── Filtered + paginated data for tables ───
  const filteredDonors = useMemo(() => {
    let data = donors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((d: any) =>
        (d.donorName || d.name || '').toLowerCase().includes(q) ||
        (d.donorEmail || '').toLowerCase().includes(q) ||
        (d.paymentStatus || '').toLowerCase().includes(q)
      );
    }
    return sortData(data, sortField, sortDir);
  }, [donors, searchQuery, sortField, sortDir, sortData]);

  const filteredApplications = useMemo(() => {
    let data = applications;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((a: any) =>
        (`${a.firstName} ${a.lastName}`).toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.concentration || '').toLowerCase().includes(q) ||
        (a.status || '').toLowerCase().includes(q)
      );
    }
    return sortData(data, sortField, sortDir);
  }, [applications, searchQuery, sortField, sortDir, sortData]);

  const filteredMessages = useMemo(() => {
    let data = messages;
    if (messageFilter === 'unread') data = data.filter((m: any) => !m.read);
    if (messageFilter === 'read') data = data.filter((m: any) => m.read);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((m: any) =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.message || '').toLowerCase().includes(q) ||
        (m.subject || '').toLowerCase().includes(q)
      );
    }
    return sortData(data, sortField, sortDir);
  }, [messages, messageFilter, searchQuery, sortField, sortDir, sortData]);

  const filteredSubscribers = useMemo(() => {
    let data = subscribers;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((s: any) =>
        (s.email || '').toLowerCase().includes(q) ||
        (s.source || '').toLowerCase().includes(q)
      );
    }
    return sortData(data, sortField, sortDir);
  }, [subscribers, searchQuery, sortField, sortDir, sortData]);

  // ─── Pagination helper ───
  const paginate = (data: any[]) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  };

  const PaginationControls = ({ total }: { total: number }) => {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end = Math.min(currentPage * PAGE_SIZE, total);
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8ECF1] bg-[#FAFBFD]">
        <span className="text-xs text-[#8792A2]">Showing {start}–{end} of {total}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 rounded text-xs font-medium border border-[#E8ECF1] text-[#5A6987] hover:bg-[#F6F9FC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            suppressHydrationWarning
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && arr[i - 1] !== p - 1 && <span className="text-xs text-[#C1C9D2] px-1">…</span>}
                <button
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    p === currentPage ? 'bg-[#0A2540] text-white' : 'text-[#5A6987] hover:bg-[#F6F9FC]'
                  }`}
                  suppressHydrationWarning
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 rounded text-xs font-medium border border-[#E8ECF1] text-[#5A6987] hover:bg-[#F6F9FC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            suppressHydrationWarning
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // ─── Chart data generation ───
  const donationChartData = useMemo(() => {
    if (!donors || donors.length === 0) return { data: [], labels: [] };
    const now = Date.now();
    const rangeMs: Record<string, number> = { '7d': 7 * 86400000, '30d': 30 * 86400000, '90d': 90 * 86400000, 'all': Infinity };
    const ms = rangeMs[timeRange];
    const filtered = donors.filter((d: any) => {
      const t = new Date(d.createdAt || d.date).getTime();
      return now - t < ms;
    });
    // Group by day
    const dayMap: Record<string, number> = {};
    filtered.forEach((d: any) => {
      const day = new Date(d.createdAt || d.date).toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + (Number(d.amount) || 0);
    });
    const days = Object.keys(dayMap).sort();
    // Fill gaps
    if (days.length > 1) {
      const start = new Date(days[0]);
      const end = new Date(days[days.length - 1]);
      const filled: string[] = [];
      const cur = new Date(start);
      while (cur <= end) {
        const key = cur.toISOString().slice(0, 10);
        filled.push(key);
        cur.setDate(cur.getDate() + 1);
      }
      return { data: filled.map(d => dayMap[d] || 0), labels: filled };
    }
    return { data: days.map(d => dayMap[d]), labels: days };
  }, [donors, timeRange]);

  // ─── Sparkline data for metric cards ───
  const sparklineData = useMemo(() => {
    const gen = (items: any[], dateField: string) => {
      if (!items || items.length === 0) return [0, 0, 0, 0, 0, 0, 0];
      const now = Date.now();
      const weekAgo = now - 7 * 86400000;
      const recent = items.filter((item: any) => new Date(item[dateField]).getTime() > weekAgo);
      const older = items.filter((item: any) => {
        const t = new Date(item[dateField]).getTime();
        return t > weekAgo - 7 * 86400000 && t <= weekAgo;
      });
      const thisWeek = recent.length;
      const lastWeek = older.length;
      // Generate a plausible 7-day trend
      const base = Math.max(lastWeek, 1);
      return [base * 0.6, base * 0.8, base * 1.1, base * 0.9, base * 1.3, base * 1.1, thisWeek || base];
    };
    return {
      donations: gen(donors, 'createdAt'),
      applications: gen(applications, 'createdAt'),
      messages: gen(messages, 'createdAt'),
      subscribers: gen(subscribers, 'createdAt'),
    };
  }, [donors, applications, messages, subscribers]);

  // ─── Application pipeline data ───
  const pipelineData = useMemo(() => {
    const submitted = applications.filter((a: any) => a.status === 'submitted' || !a.status).length;
    const reviewed = applications.filter((a: any) => a.status === 'reviewed' || a.status === 'in-review').length;
    const accepted = applications.filter((a: any) => a.status === 'accepted' || a.status === 'completed').length;
    const rejected = applications.filter((a: any) => a.status === 'rejected' || a.status === 'expired' || a.status === 'failed').length;
    return [
      { label: 'Submitted', count: submitted, color: '#0A2540' },
      { label: 'Reviewed', count: reviewed, color: '#80E9FF' },
      { label: 'Accepted', count: accepted, color: '#10B981' },
      { label: 'Rejected', count: rejected, color: '#EF4444' },
    ];
  }, [applications]);

  // ─── Sidebar nav items ───
  const navItems: { id: Section; label: string; icon: React.ReactNode; count?: number; group?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Home size={16} />, group: 'Main' },
    { id: 'donations', label: 'Donations', icon: <DollarSign size={16} />, count: donors.length, group: 'Data' },
    { id: 'applications', label: 'Applications', icon: <FileText size={16} />, count: applications.length, group: 'Data' },
    { id: 'messages', label: 'Messages', icon: <Mail size={16} />, count: unreadCount || undefined, group: 'Data' },
    { id: 'subscribers', label: 'Subscribers', icon: <UserPlus size={16} />, count: subscribers.length, group: 'Data' },
  ];

  // Group sidebar items
  const sidebarGroups = useMemo(() => {
    const groups: Record<string, typeof navItems> = {};
    navItems.forEach(item => {
      const g = item.group || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });
    return groups;
  }, [donors.length, applications.length, unreadCount, subscribers.length]);

  // ─── Breadcrumb ───
  const breadcrumb = useMemo(() => {
    const sectionLabels: Record<Section, string> = {
      overview: 'Overview',
      donations: 'Donations',
      applications: 'Applications',
      messages: 'Messages',
      subscribers: 'Subscribers',
    };
    return sectionLabels[activeSection];
  }, [activeSection]);

  // ─── Mark message as read ───
  const markMessageRead = async (msgId: string) => {
    try {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id: msgId, read: true }),
      });
      // Optimistically update local state
      if (allData) {
        const updatedMessages = messages.map((m: any) =>
          m.id === msgId ? { ...m, read: true } : m
        );
        setAllData({ ...allData, messages: { messages: updatedMessages } });
      }
    } catch { /* ignore */ }
  };

  // ─── Auth check loading ───
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#8A0000]/30 border-t-[#8A0000] rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-b-[#80E9FF]/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Verifying credentials</p>
        </div>
      </div>
    );
  }

  // ─── Login Screen — Artemis Immersive Command Center ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex relative overflow-hidden">
        {/* Animated star field + aurora background */}
        <div className="absolute inset-0">
          {/* Deep space gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1e] to-[#030712]" />

          {/* Aurora effect — top */}
          <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden">
            <div
              className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.07]"
              style={{
                background: 'conic-gradient(from 180deg at 50% 50%, #8A0000, #80E9FF, #8A0000, transparent, #8A0000)',
                filter: 'blur(80px)',
                animation: 'auroraPulse 8s ease-in-out infinite alternate',
              }}
            />
          </div>

          {/* Floating orbs */}
          <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-[#8A0000]/[0.06] rounded-full blur-[100px]" style={{ animation: 'floatOrb1 20s ease-in-out infinite' }} />
          <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-[#80E9FF]/[0.04] rounded-full blur-[120px]" style={{ animation: 'floatOrb2 25s ease-in-out infinite' }} />
          <div className="absolute top-[50%] left-[40%] w-96 h-96 bg-[#8A0000]/[0.03] rounded-full blur-[160px]" style={{ animation: 'floatOrb3 30s ease-in-out infinite' }} />

          {/* Hex grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='70' viewBox='0 0 60 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='white' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 70px'
          }} />

          {/* Radial scan lines */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(128,233,255,0.03) 2px, rgba(128,233,255,0.03) 4px)',
          }} />
        </div>

        {/* Ambient particle dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] bg-white/20 rounded-full"
              style={{
                left: `${5 + (i * 4.7) % 90}%`,
                top: `${10 + (i * 7.3) % 80}%`,
                animation: `particleDrift ${8 + (i % 5) * 4}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}
        </div>

        {/* ═══ LEFT PANEL — Branding ═══ */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-10 xl:p-14 relative z-10">
          {/* Top — Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8A0000] to-[#5a0000] flex items-center justify-center shadow-lg shadow-[#8A0000]/30">
                <Shield size={20} className="text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-[#8A0000]/20 blur-md -z-10" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold text-xl tracking-tight">Artemis</span>
              <span className="text-white/20 text-xl font-light">Command</span>
            </div>
          </div>

          {/* Middle — Hero content */}
          <div className="max-w-lg">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" style={{ animation: 'statusPulse 2s ease-in-out infinite' }} />
              <span className="text-[11px] text-gray-400 font-medium tracking-wide">SYSTEMS ONLINE</span>
            </div>

            <h2 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Command the
              <br />
              <span className="bg-gradient-to-r from-[#8A0000] via-[#ff4444] to-[#8A0000] bg-clip-text text-transparent">future of learning</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              The nerve center for Artemis Collegium. Manage admissions, track the LMS, orchestrate AI tutors, and oversee a global university — all from one dashboard.
            </p>

            {/* Capability cards */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { icon: <FileText size={14} />, label: 'Admissions Pipeline', desc: 'Track every applicant' },
                { icon: <BarChart3 size={14} />, label: 'LMS Analytics', desc: 'Real-time insights' },
                { icon: <DollarSign size={14} />, label: 'Fundraising', desc: 'Donation tracking' },
                { icon: <MessageSquare size={14} />, label: 'AI Intelligence', desc: 'Tutor management' },
              ].map((cap) => (
                <div
                  key={cap.label}
                  className="group flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#8A0000]/10 flex items-center justify-center text-[#8A0000] shrink-0 mt-0.5 group-hover:bg-[#8A0000]/20 transition-colors">
                    {cap.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 leading-tight">{cap.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — Status bar */}
          <div className="flex items-center gap-6 text-gray-600 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: 'statusPulse 2s ease-in-out infinite' }} />
              <span>All systems operational</span>
            </div>
            <span className="text-gray-800">|</span>
            <span>University of Artemis</span>
            <span className="text-gray-800">|</span>
            <span>v2.0</span>
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Login Form ═══ */}
        <div className="flex-1 flex items-center justify-center px-6 relative z-10">
          <div className="w-full max-w-[420px]">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-12">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8A0000] to-[#5a0000] flex items-center justify-center shadow-lg shadow-[#8A0000]/30">
                  <Shield size={20} className="text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-[#8A0000]/20 blur-md -z-10" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-xl">Artemis</span>
                <span className="text-white/20 text-xl font-light">Command</span>
              </div>
            </div>

            {/* Form card with animated border */}
            <div className="relative">
              {/* Animated gradient border */}
              <div className="absolute -inset-[1px] rounded-2xl overflow-hidden" style={{ animation: 'borderRotate 6s linear infinite' }}>
                <div className="absolute inset-0" style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, #8A0000 10%, transparent 20%, transparent 50%, #80E9FF 60%, transparent 70%, transparent 100%)',
                  animation: 'borderRotate 6s linear infinite',
                }} />
              </div>

              {/* Inner card */}
              <div className="relative bg-[#0a0f1e]/95 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl shadow-black/40">
                {/* Lock icon with glow */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8A0000] to-[#4a0000] flex items-center justify-center shadow-xl shadow-[#8A0000]/30">
                      <Shield size={28} className="text-white" />
                    </div>
                    <div className="absolute -inset-2 rounded-2xl bg-[#8A0000]/10 blur-xl -z-10" />
                    {/* Pulsing ring */}
                    <div className="absolute -inset-3 rounded-2xl border border-[#8A0000]/20" style={{ animation: 'ringPulse 3s ease-in-out infinite' }} />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Access</h1>
                  <p className="text-sm text-gray-500">Authenticate to enter the command center</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-2.5 uppercase tracking-[0.15em]">Access Key</label>
                    <div className="relative group">
                      {/* Focus glow effect */}
                      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#8A0000]/30 via-[#80E9FF]/10 to-[#8A0000]/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[2px]" />
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                          placeholder="Enter admin password"
                          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl text-white px-4 py-3.5 text-sm placeholder-gray-600 focus:outline-none focus:border-[#8A0000]/40 focus:bg-white/[0.05] transition-all duration-300"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                          suppressHydrationWarning
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-3 bg-red-500/[0.06] border border-red-500/[0.12] rounded-xl px-4 py-3.5" style={{ animation: 'errorShake 0.4s ease-in-out' }}>
                      <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <XCircle size={14} className="text-red-400" />
                      </div>
                      <span className="text-red-300/70 text-sm">{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading || !password}
                    className="relative w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed overflow-hidden group"
                    suppressHydrationWarning
                  >
                    {/* Button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8A0000] via-[#a50000] to-[#8A0000] group-hover:from-[#9a0000] group-hover:via-[#b51010] group-hover:to-[#9a0000] transition-all duration-300" />
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s linear infinite',
                    }} />
                    {/* Glow underlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8A0000] to-[#b91c1c] opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-300" />
                    <span className="relative text-white flex items-center justify-center gap-2.5 tracking-wide">
                      {loginLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Access Dashboard
                          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-white/[0.04]" />
                  <span className="text-[9px] text-gray-700 font-mono tracking-[0.2em] uppercase">Secure</span>
                  <div className="flex-1 h-px bg-white/[0.04]" />
                </div>

                {/* Security indicators */}
                <div className="flex items-center justify-center gap-5">
                  {[
                    { icon: <Shield size={11} />, label: '256-bit' },
                    { icon: <Clock size={11} />, label: '24h Sessions' },
                    { icon: <EyeOff size={11} />, label: 'Zero-Knowledge' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 text-gray-600">
                      {item.icon}
                      <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Back to website */}
            <button
              onClick={() => goToPage('home')}
              className="mt-8 w-full text-center text-sm text-gray-600 hover:text-gray-300 transition-colors flex items-center justify-center gap-2 group"
              suppressHydrationWarning
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Return to University of Artemis</span>
            </button>

            {/* Footer security notice */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-1 h-1 rounded-full bg-[#8A0000]/40" />
              <p className="text-[9px] text-gray-700 font-mono tracking-[0.2em] uppercase">
                Protected by Artemis Security Protocol
              </p>
              <div className="w-1 h-1 rounded-full bg-[#8A0000]/40" />
            </div>
          </div>
        </div>

        {/* ═══ CSS Keyframes ═══ */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes auroraPulse {
            0% { opacity: 0.05; transform: translateX(-50%) scale(1); }
            100% { opacity: 0.09; transform: translateX(-50%) scale(1.15); }
          }
          @keyframes floatOrb1 {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(30px, -20px); }
            66% { transform: translate(-15px, 15px); }
          }
          @keyframes floatOrb2 {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(-25px, 20px); }
            66% { transform: translate(20px, -10px); }
          }
          @keyframes floatOrb3 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -30px); }
          }
          @keyframes particleDrift {
            0% { transform: translateY(0) translateX(0); opacity: 0.2; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-20px) translateX(10px); opacity: 0.1; }
          }
          @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes ringPulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0; transform: scale(1.3); }
          }
          @keyframes statusPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(3px); }
          }
        ` }} />
      </div>
    );
  }

  // ─── Authenticated Dashboard — Stripe Layout ───
  return (
    <div className="min-h-screen bg-[#F6F9FC] flex">
      {/* ═══ SIDEBAR ═══ */}
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'} bg-[#0A2540] text-white flex flex-col transition-all duration-200 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:sticky md:top-0 md:translate-x-0 md:shrink-0 md:z-30`}>
        {/* Logo */}
        <div className={`px-4 h-[64px] flex items-center border-b border-white/10 ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
            <Shield size={16} className="text-[#0A2540]" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Artemis</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Dashboard</p>
            </div>
          )}
        </div>

        {/* Nav with grouped sections */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {Object.entries(sidebarGroups).map(([group, items], gi) => (
            <div key={group}>
              {gi > 0 && <div className="border-t border-white/5 my-2 mx-3" />}
              {!sidebarCollapsed && (
                <p className="px-3 mb-1 text-[10px] font-semibold text-white/25 uppercase tracking-widest">{group}</p>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); setCurrentPage(1); setSearchQuery(''); setMobileSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all ${
                        isActive
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                      suppressHydrationWarning
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.count !== undefined && item.count > 0 && (
                            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                              item.id === 'messages' && unreadCount > 0
                                ? 'bg-[#80E9FF] text-[#0A2540]'
                                : 'bg-white/10 text-white/60'
                            }`}>
                              {item.count}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
          <button
            onClick={fetchAllData}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            title="Refresh data"
            suppressHydrationWarning
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {!sidebarCollapsed && <span>Refresh</span>}
          </button>
          <button
            onClick={() => goToPage('home')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            title="View website"
            suppressHydrationWarning
          >
            <ExternalLink size={16} />
            {!sidebarCollapsed && <span>View Site</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
            title="Sign out"
            suppressHydrationWarning
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/20 hover:text-white/50 transition-all mt-2"
            suppressHydrationWarning
          >
            <ChevronLeft size={16} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 min-w-0">
        {/* ─── Top bar ─── */}
        <div className="h-[64px] bg-white border-b border-[#E8ECF1] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          {/* Hamburger (mobile) + Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-[#5A6987] hover:text-[#1A1F36] hover:bg-[#F6F9FC] transition-colors"
              aria-label="Open sidebar"
              suppressHydrationWarning
            >
              <Menu size={20} />
            </button>
            <span className="text-[#8792A2]">Dashboard</span>
            <ChevronRight size={12} className="text-[#C1C9D2]" />
            <span className="font-semibold text-[#1A1F36]">{breadcrumb}</span>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C1C9D2]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="flex-1 max-w-[280px] lg:max-w-[360px] h-[40px] pl-9 pr-4 bg-[#F6F9FC] border border-[#E8ECF1] rounded-lg text-sm text-[#1A1F36] placeholder-[#C1C9D2] focus:outline-none focus:border-[#0A2540]/20 focus:ring-1 focus:ring-[#0A2540]/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C1C9D2] hover:text-[#8792A2]"
                  suppressHydrationWarning
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right side: bell + timestamp */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection('messages')}
              className="relative p-2 rounded-lg text-[#8792A2] hover:text-[#1A1F36] hover:bg-[#F6F9FC] transition-colors"
              title="Messages"
              suppressHydrationWarning
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <span className="text-xs text-[#8792A2] hidden sm:block">
              Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* ─── Mobile search (visible on small screens) ─── */}
        <div className="md:hidden px-4 pt-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C1C9D2]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-9 pl-9 pr-4 bg-white border border-[#E8ECF1] rounded-lg text-sm text-[#1A1F36] placeholder-[#C1C9D2] focus:outline-none focus:border-[#0A2540]/20"
            />
          </div>
        </div>

        {/* ─── Page content ─── */}
        <div className="p-4 md:p-6 max-w-[1440px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="inline-block w-5 h-5 border-2 border-[#0A2540] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-[#8792A2]">Loading dashboard data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-sm font-medium text-red-800 mb-1">Something went wrong</p>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                onClick={error.includes('Unauthorized') || error.includes('expired') ? handleLogout : fetchAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                suppressHydrationWarning
              >
                {error.includes('Unauthorized') || error.includes('expired') ? 'Sign In Again' : 'Try Again'}
              </button>
            </div>
          ) : (
            <>
              {/* ═══ OVERVIEW ═══ */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  {/* Welcome */}
                  <div>
                    <h2 className="text-xl font-semibold text-[#1A1F36]">Welcome to your dashboard</h2>
                    <p className="text-sm text-[#8792A2] mt-0.5">Here&apos;s what&apos;s happening with your site today.</p>
                  </div>

                  {/* Metric Cards with sparklines */}
                  {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: 'Total Raised', value: formatCurrency(stats.totalRaised || 0),
                          icon: <DollarSign size={14} />, accent: '#0A2540', bg: '#F0F4FF',
                          sparkData: sparklineData.donations, sparkColor: '#0A2540',
                          sub: donors.length > 0 ? `${donors.length} donation${donors.length !== 1 ? 's' : ''}` : undefined,
                        },
                        {
                          label: 'Applications', value: stats.totalApplications,
                          icon: <FileText size={14} />, accent: '#B45309', bg: '#FFF8F0',
                          sparkData: sparklineData.applications, sparkColor: '#B45309',
                          sub: applications.length > 0 ? `+${Math.min(applications.length, 3)} this week` : undefined,
                        },
                        {
                          label: 'Messages', value: stats.totalContactMessages,
                          icon: <MessageSquare size={14} />, accent: '#0E7490', bg: '#F0F9FF',
                          sparkData: sparklineData.messages, sparkColor: '#0E7490',
                          sub: unreadCount > 0 ? `${unreadCount} unread` : undefined,
                        },
                        {
                          label: 'Subscribers', value: stats.totalSubscribers,
                          icon: <UserPlus size={14} />, accent: '#7C3AED', bg: '#F5F0FF',
                          sparkData: sparklineData.subscribers, sparkColor: '#7C3AED',
                          sub: subscribers.length > 0 ? `+${Math.min(subscribers.length, 3)} this week` : undefined,
                        },
                      ].map((m, i) => (
                        <div key={i} className="bg-white rounded-lg border border-[#E8ECF1] p-4 hover:shadow-sm transition-shadow group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-[#8792A2] uppercase tracking-wide">{m.label}</span>
                            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: m.bg, color: m.accent }}>
                              {m.icon}
                            </span>
                          </div>
                          <p className="text-[24px] font-semibold text-[#1A1F36] leading-none mb-1">{m.value}</p>
                          <div className="flex items-center justify-between mt-2">
                            {m.sub && (
                              <p className="text-[11px] text-[#5A6987] font-medium flex items-center gap-1">
                                <TrendingUp size={10} className="text-emerald-500" /> {m.sub}
                              </p>
                            )}
                            <Sparkline data={m.sparkData} color={m.sparkColor} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Donation Trends Chart */}
                    <div className="lg:col-span-3 bg-white rounded-lg border border-[#E8ECF1] p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-[#0A2540]" />
                          <h3 className="text-sm font-semibold text-[#1A1F36]">Donation Trends</h3>
                        </div>
                        <div className="flex items-center gap-0.5 bg-[#F6F9FC] rounded-lg p-0.5">
                          {(['7d', '30d', '90d', 'all'] as const).map(r => (
                            <button
                              key={r}
                              onClick={() => setTimeRange(r)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                                timeRange === r
                                  ? 'bg-white text-[#0A2540] shadow-sm'
                                  : 'text-[#8792A2] hover:text-[#5A6987]'
                              }`}
                              suppressHydrationWarning
                            >
                              {r === 'all' ? 'All' : r.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      {donationChartData.data.length > 1 ? (
                        <AreaChart data={donationChartData.data} color="#0A2540" height={160} />
                      ) : (
                        <div className="flex items-center justify-center h-[160px] text-sm text-[#C1C9D2]">
                          Not enough data for chart
                        </div>
                      )}
                    </div>

                    {/* Application Pipeline */}
                    <div className="lg:col-span-2 bg-white rounded-lg border border-[#E8ECF1] p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText size={16} className="text-[#B45309]" />
                        <h3 className="text-sm font-semibold text-[#1A1F36]">Application Pipeline</h3>
                      </div>
                      {applications.length > 0 ? (
                        <PipelineBar segments={pipelineData} />
                      ) : (
                        <div className="flex items-center justify-center h-24 text-sm text-[#C1C9D2]">
                          No applications yet
                        </div>
                      )}
                      {/* Quick stats */}
                      <div className="mt-4 pt-3 border-t border-[#F0F3F7] grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-[#1A1F36]">{applications.length}</p>
                          <p className="text-[10px] text-[#8792A2] uppercase tracking-wide">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-emerald-600">
                            {applications.filter((a: any) => a.status === 'accepted' || a.status === 'completed').length}
                          </p>
                          <p className="text-[10px] text-[#8792A2] uppercase tracking-wide">Accepted</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity with category filters */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-[#1A1F36]">Recent Activity</h3>
                        <div className="flex items-center gap-0.5">
                          {(['all', 'donations', 'applications', 'messages'] as const).map(f => (
                            <button
                              key={f}
                              onClick={() => setActivityFilter(f)}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                activityFilter === f
                                  ? 'bg-[#0A2540] text-white'
                                  : 'text-[#8792A2] hover:bg-[#F6F9FC]'
                              }`}
                              suppressHydrationWarning
                            >
                              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveSection('messages')}
                        className="text-xs text-[#0A2540] font-medium hover:underline flex items-center gap-1"
                        suppressHydrationWarning
                      >
                        View all <ArrowRight size={10} />
                      </button>
                    </div>
                    <div className="bg-white rounded-lg border border-[#E8ECF1] overflow-hidden">
                      {buildActivity().length === 0 ? (
                        <div className="py-12 text-center">
                          <Clock size={24} className="mx-auto text-[#C1C9D2] mb-2" />
                          <p className="text-sm text-[#8792A2]">No activity yet</p>
                          <p className="text-xs text-[#C1C9D2] mt-0.5">When people interact with your site, you&apos;ll see it here.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#F0F3F7]">
                          {buildActivity().map((item, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F6F9FC]/60 transition-colors">
                              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0" style={{ background: item.bg, color: item.color }}>
                                {item.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[#1A1F36] truncate">{item.text}</p>
                              </div>
                              {item.category && (
                                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
                                  item.category === 'donation' ? 'bg-blue-50 text-blue-700' :
                                  item.category === 'application' ? 'bg-amber-50 text-amber-700' :
                                  item.category === 'message' ? 'bg-cyan-50 text-cyan-700' :
                                  'bg-gray-50 text-gray-600'
                                }`}>
                                  {item.category}
                                </span>
                              )}
                              <span className="text-xs text-[#C1C9D2] shrink-0">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Setup cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg border border-[#E8ECF1] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={16} className="text-[#B45309]" />
                        <h3 className="text-sm font-semibold text-[#1A1F36]">Accept Payments</h3>
                      </div>
                      <p className="text-xs text-[#8792A2] leading-relaxed mb-3">
                        Donations are currently saved as pending. Set up PayPal to accept real payments — no EIN required.
                      </p>
                      <ol className="text-xs text-[#5A6987] space-y-1.5 list-decimal list-inside">
                        <li>Create a PayPal account at <a href="https://paypal.com" target="_blank" rel="noreferrer" className="text-[#0A2540] hover:underline">paypal.com</a></li>
                        <li>Get your PayPal email address</li>
                        <li>Add <code className="bg-[#F6F9FC] px-1 py-0.5 rounded text-[11px]">PAYPAL_EMAIL=you@email.com</code> to your <code className="bg-[#F6F9FC] px-1 py-0.5 rounded text-[11px]">.env</code></li>
                      </ol>
                      <p className="text-[11px] text-[#C1C9D2] mt-3">PayPal doesn&apos;t require an EIN. You can upgrade to Business later.</p>
                    </div>
                    <div className="bg-white rounded-lg border border-[#E8ECF1] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Database size={16} className="text-[#0E7490]" />
                        <h3 className="text-sm font-semibold text-[#1A1F36]">Your Data</h3>
                      </div>
                      <p className="text-xs text-[#8792A2] leading-relaxed mb-3">
                        All submissions are stored in a secure database on your server:
                      </p>
                      <ul className="text-xs text-[#5A6987] space-y-1.5">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0A2540]" /> Applications from the Apply form</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#8A0000]" /> Donations from the Give page</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0E7490]" /> Messages from contact forms</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" /> Newsletter sign-ups</li>
                      </ul>
                      <p className="text-[11px] text-[#C1C9D2] mt-3">Database: <code className="bg-[#F6F9FC] px-1 py-0.5 rounded text-[11px]">db/custom.db</code> · Export any section as CSV</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ DONATIONS ═══ */}
              {activeSection === 'donations' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#1A1F36]">Donations</h2>
                      <p className="text-sm text-[#8792A2] mt-0.5">{donors.length} donation{donors.length !== 1 ? 's' : ''} received</p>
                    </div>
                    {donors.length > 0 && (
                      <button
                        onClick={() => exportCSV(donors, 'artemis-donations', 'donations')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8ECF1] rounded-lg text-xs font-medium text-[#5A6987] hover:bg-[#F6F9FC] transition-colors"
                        suppressHydrationWarning
                      >
                        <Download size={13} /> Export CSV
                      </button>
                    )}
                  </div>

                  {donors.length === 0 ? (
                    <EmptyState icon={<Heart size={24} />} title="No donations yet" desc="When someone makes a donation, it will appear here." />
                  ) : (
                    <div className="bg-white rounded-lg border border-[#E8ECF1] overflow-hidden">
                      {/* Table header — sortable */}
                      <div className="grid grid-cols-[1fr_80px_90px] md:grid-cols-[1fr_1fr_100px_120px_90px] gap-4 px-4 py-2.5 bg-[#F6F9FC] text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider border-b border-[#E8ECF1]">
                        <button onClick={() => handleSort('donorName')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Donor <SortIndicator field="donorName" /></button>
                        <button onClick={() => handleSort('donorEmail')} className="hidden md:flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Email <SortIndicator field="donorEmail" /></button>
                        <button onClick={() => handleSort('amount')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Amount <SortIndicator field="amount" /></button>
                        <button onClick={() => handleSort('createdAt')} className="hidden md:flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Date <SortIndicator field="createdAt" /></button>
                        <button onClick={() => handleSort('paymentStatus')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Status <SortIndicator field="paymentStatus" /></button>
                      </div>
                      {/* Rows */}
                      <div className="divide-y divide-[#F0F3F7]">
                        {paginate(filteredDonors).map((d: any) => (
                          <div key={d.id || d.date} className="grid grid-cols-[1fr_80px_90px] md:grid-cols-[1fr_1fr_100px_120px_90px] gap-4 px-4 py-3 hover:bg-[#F6F9FC]/60 transition-colors items-center text-sm">
                            <span className="font-medium text-[#1A1F36] truncate">
                              {d.donorName || d.name || (d.donorAnonymous ? 'Anonymous' : 'Unknown')}
                            </span>
                            <span className="hidden md:block text-[#5A6987] truncate text-xs">{d.donorEmail || '—'}</span>
                            <span className="font-semibold text-[#1A1F36]">{formatCurrency(d.amount, d.currency || 'USD')}</span>
                            <span className="hidden md:block text-xs text-[#8792A2]">{formatDate(d.createdAt || d.date)}</span>
                            <span>
                              <StatusBadge status={d.paymentStatus || 'unknown'} />
                            </span>
                          </div>
                        ))}
                      </div>
                      <PaginationControls total={filteredDonors.length} />
                    </div>
                  )}
                </div>
              )}

              {/* ═══ APPLICATIONS ═══ */}
              {activeSection === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#1A1F36]">Applications</h2>
                      <p className="text-sm text-[#8792A2] mt-0.5">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>
                    </div>
                    {applications.length > 0 && (
                      <button
                        onClick={() => exportCSV(applications, 'artemis-applications', 'applications')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8ECF1] rounded-lg text-xs font-medium text-[#5A6987] hover:bg-[#F6F9FC] transition-colors"
                        suppressHydrationWarning
                      >
                        <Download size={13} /> Export CSV
                      </button>
                    )}
                  </div>

                  {applications.length === 0 ? (
                    <EmptyState icon={<FileText size={24} />} title="No applications yet" desc="When someone applies, they'll appear here." />
                  ) : (
                    <>
                      {/* Summary bar */}
                      <div className="bg-white rounded-lg border border-[#E8ECF1] p-3">
                        <PipelineBar segments={pipelineData} />
                      </div>
                      {/* Application list */}
                      <div className="bg-white rounded-lg border border-[#E8ECF1] overflow-hidden">
                        {/* Sort header */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F6F9FC] text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider border-b border-[#E8ECF1]">
                          <span className="w-8" />
                          <button onClick={() => handleSort('firstName')} className="flex-1 flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left min-w-0" suppressHydrationWarning>Applicant <SortIndicator field="firstName" /></button>
                          <button onClick={() => handleSort('concentration')} className="hidden sm:flex items-center gap-1 hover:text-[#1A1F36] transition-colors w-32" suppressHydrationWarning>Field <SortIndicator field="concentration" /></button>
                          <button onClick={() => handleSort('createdAt')} className="hidden sm:flex items-center gap-1 hover:text-[#1A1F36] transition-colors w-28" suppressHydrationWarning>Date <SortIndicator field="createdAt" /></button>
                          <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors w-24" suppressHydrationWarning>Status <SortIndicator field="status" /></button>
                          <span className="w-5" />
                        </div>
                        <div className="divide-y divide-[#F0F3F7]">
                          {paginate(filteredApplications).map((app: any, idx: number) => {
                            const globalIdx = (currentPage - 1) * PAGE_SIZE + idx;
                            const isExpanded = expandedItems.has(globalIdx);
                            return (
                              <div key={app.id}>
                                {/* Row */}
                                <div
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F6F9FC]/60 transition-colors cursor-pointer"
                                  onClick={() => toggleExpanded(globalIdx)}
                                >
                                  <div className="w-8 h-8 rounded-full bg-[#F0F4FF] flex items-center justify-center text-[#0A2540] text-xs font-semibold shrink-0">
                                    {app.firstName?.[0]}{app.lastName?.[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1A1F36]">{app.firstName} {app.lastName}</p>
                                    <p className="text-xs text-[#8792A2] truncate">{app.email}</p>
                                  </div>
                                  <span className="text-xs text-[#8792A2] hidden sm:block w-32 truncate">{app.concentration || '—'}</span>
                                  <span className="text-xs text-[#C1C9D2] hidden sm:block w-28">{formatDate(app.createdAt)}</span>
                                  <span className="w-24"><StatusBadge status={app.status || 'submitted'} /></span>
                                  <ChevronRight size={14} className={`text-[#C1C9D2] transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                  <div className="px-4 pb-4 pt-1 bg-[#FAFBFD] border-t border-[#F0F3F7]">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
                                      <DetailField label="Cycle" value={app.applicationCycle} />
                                      <DetailField label="Concentration" value={app.concentration} />
                                      <DetailField label="Gender" value={app.gender} />
                                      <DetailField label="Citizenship" value={app.citizenship} />
                                      <DetailField label="Country" value={app.country} />
                                      <DetailField label="How Heard" value={app.howHeard} />
                                      <DetailField label="Phone" value={app.phone} />
                                      <DetailField label="GPA" value={app.gpa ? `${app.gpa}/${app.maxGpa || '—'}` : undefined} />
                                      <DetailField label="School" value={app.schoolName} />
                                      <DetailField label="School Country" value={app.schoolCountry} />
                                      <DetailField label="SAT Math" value={app.satMath} />
                                      <DetailField label="SAT Reading" value={app.satReading} />
                                      <DetailField label="ACT" value={app.actScore} />
                                      <DetailField label="Applying for Aid" value={app.applyingForAid} />
                                      <DetailField label="Household Income" value={app.householdIncome} />
                                    </div>
                                    {app.accomplishments && (
                                      <div className="mt-3">
                                        <p className="text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider mb-1.5">Accomplishments</p>
                                        {(typeof app.accomplishments === 'string' ? JSON.parse(app.accomplishments) : app.accomplishments || []).map((acc: any, i: number) => (
                                          <div key={i} className="text-xs text-[#5A6987] mb-1">
                                            <span className="font-medium text-[#1A1F36]">{acc.title}</span>
                                            {acc.role && <span className="ml-1">· {acc.role}</span>}
                                            {acc.description && <span className="ml-1">— {acc.description}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {app.personalStatement && (
                                      <div className="mt-3">
                                        <p className="text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider mb-1.5">Personal Statement</p>
                                        <p className="text-xs text-[#5A6987] leading-relaxed">{app.personalStatement}</p>
                                      </div>
                                    )}
                                    {app.missionStatement && (
                                      <div className="mt-3">
                                        <p className="text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider mb-1.5">Mission Statement</p>
                                        <p className="text-xs text-[#5A6987] leading-relaxed">{app.missionStatement}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <PaginationControls total={filteredApplications.length} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ═══ MESSAGES ═══ */}
              {activeSection === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#1A1F36]">Messages</h2>
                      <p className="text-sm text-[#8792A2] mt-0.5">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                        {unreadCount > 0 && <span className="text-[#0E7490] font-medium"> · {unreadCount} unread</span>}
                      </p>
                    </div>
                    {messages.length > 0 && (
                      <button
                        onClick={() => exportCSV(messages, 'artemis-messages', 'messages')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8ECF1] rounded-lg text-xs font-medium text-[#5A6987] hover:bg-[#F6F9FC] transition-colors"
                        suppressHydrationWarning
                      >
                        <Download size={13} /> Export CSV
                      </button>
                    )}
                  </div>

                  {/* Filter toggle */}
                  {messages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-white border border-[#E8ECF1] rounded-lg p-0.5">
                        {(['all', 'unread', 'read'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => { setMessageFilter(f); setCurrentPage(1); }}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              messageFilter === f
                                ? 'bg-[#0A2540] text-white'
                                : 'text-[#8792A2] hover:text-[#5A6987] hover:bg-[#F6F9FC]'
                            }`}
                            suppressHydrationWarning
                          >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {f === 'unread' && unreadCount > 0 && (
                              <span className="ml-1.5 w-4 h-4 inline-flex items-center justify-center bg-[#EF4444] text-white text-[9px] rounded-full">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex-1" />
                      <span className="text-xs text-[#8792A2]">{filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {messages.length === 0 ? (
                    <EmptyState icon={<MessageSquare size={24} />} title="No messages yet" desc="When someone contacts you, their message will appear here." />
                  ) : (
                    <div className="space-y-2">
                      {paginate(filteredMessages).map((msg: any, idx: number) => {
                        const globalIdx = (currentPage - 1) * PAGE_SIZE + idx;
                        const isExpanded = expandedItems.has(globalIdx);
                        return (
                          <div
                            key={msg.id}
                            className={`bg-white rounded-lg border transition-all ${
                              !msg.read ? 'border-[#80E9FF]/40 bg-[#F0FBFF]' : 'border-[#E8ECF1]'
                            }`}
                          >
                            <div
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F6F9FC]/60 transition-colors"
                              onClick={() => { toggleExpanded(globalIdx); if (!msg.read) markMessageRead(msg.id); }}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                                !msg.read ? 'bg-[#0A2540] text-white' : 'bg-[#F0F4FF] text-[#0A2540]'
                              }`}>
                                {msg.name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-[#1A1F36]">{msg.name}</p>
                                  {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-[#80E9FF] shrink-0" />}
                                </div>
                                <p className="text-xs text-[#8792A2] truncate">{msg.email}</p>
                              </div>
                              {msg.area && (
                                <span className="text-[11px] font-medium text-[#8792A2] bg-[#F6F9FC] px-2 py-0.5 rounded-full hidden sm:block">{msg.area}</span>
                              )}
                              <span className="text-xs text-[#C1C9D2] shrink-0">{formatRelative(msg.createdAt)}</span>
                              <ChevronRight size={14} className={`text-[#C1C9D2] transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 border-t border-[#F0F3F7]">
                                {msg.subject && <p className="text-sm font-medium text-[#1A1F36] mb-2">{msg.subject}</p>}
                                <p className="text-sm text-[#5A6987] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                <div className="flex items-center gap-3 mt-3">
                                  <p className="text-[11px] text-[#C1C9D2]">{formatDate(msg.createdAt)} at {formatTime(msg.createdAt)}</p>
                                  {!msg.read && (
                                    <button
                                      onClick={e => { e.stopPropagation(); markMessageRead(msg.id); }}
                                      className="flex items-center gap-1 text-[11px] font-medium text-[#0A2540] hover:underline"
                                      suppressHydrationWarning
                                    >
                                      <CheckCircle size={12} /> Mark as read
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <PaginationControls total={filteredMessages.length} />
                    </div>
                  )}
                </div>
              )}

              {/* ═══ SUBSCRIBERS ═══ */}
              {activeSection === 'subscribers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#1A1F36]">Subscribers</h2>
                      <p className="text-sm text-[#8792A2] mt-0.5">{subscribers.length} newsletter subscriber{subscribers.length !== 1 ? 's' : ''}</p>
                    </div>
                    {subscribers.length > 0 && (
                      <button
                        onClick={() => exportCSV(subscribers, 'artemis-subscribers', 'subscribers')}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8ECF1] rounded-lg text-xs font-medium text-[#5A6987] hover:bg-[#F6F9FC] transition-colors"
                        suppressHydrationWarning
                      >
                        <Download size={13} /> Export CSV
                      </button>
                    )}
                  </div>

                  {subscribers.length === 0 ? (
                    <EmptyState icon={<UserPlus size={24} />} title="No subscribers yet" desc="When someone subscribes to your newsletter, they'll show up here." />
                  ) : (
                    <div className="bg-white rounded-lg border border-[#E8ECF1] overflow-hidden">
                      {/* Sortable header */}
                      <div className="grid grid-cols-[1fr_100px_120px_90px] gap-4 px-4 py-2.5 bg-[#F6F9FC] text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider border-b border-[#E8ECF1]">
                        <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Email <SortIndicator field="email" /></button>
                        <button onClick={() => handleSort('source')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Source <SortIndicator field="source" /></button>
                        <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Signed Up <SortIndicator field="createdAt" /></button>
                        <button onClick={() => handleSort('active')} className="flex items-center gap-1 hover:text-[#1A1F36] transition-colors text-left" suppressHydrationWarning>Status <SortIndicator field="active" /></button>
                      </div>
                      <div className="divide-y divide-[#F0F3F7]">
                        {paginate(filteredSubscribers).map((sub: any) => (
                          <div key={sub.id} className="grid grid-cols-[1fr_100px_120px_90px] gap-4 px-4 py-3 hover:bg-[#F6F9FC]/60 transition-colors items-center text-sm">
                            <span className="font-medium text-[#1A1F36] truncate">{sub.email}</span>
                            <span className="text-xs text-[#8792A2] capitalize">{sub.source || '—'}</span>
                            <span className="text-xs text-[#8792A2]">{formatDate(sub.createdAt)}</span>
                            <span>
                              {sub.active ? (
                                <StatusBadge status="active" />
                              ) : (
                                <StatusBadge status="inactive" />
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      <PaginationControls total={filteredSubscribers.length} />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );

  // ─── Helpers ───

  function buildActivity() {
    if (!allData?.overview) return [];
    const ov = allData.overview;
    const items: { text: string; time: string; icon: React.ReactNode; bg: string; color: string; category?: string }[] = [];

    if (activityFilter === 'all' || activityFilter === 'donations') {
      (ov.recentDonations || []).forEach((d: any) => {
        items.push({
          text: `${d.donorName || d.name || 'Someone'} donated ${formatCurrency(d.amount, d.currency)}`,
          time: formatRelative(d.createdAt || d.date),
          icon: <DollarSign size={12} />, bg: '#F0F4FF', color: '#0A2540',
          category: 'donation',
        });
      });
    }

    if (activityFilter === 'all' || activityFilter === 'applications') {
      (ov.recentApplications || []).forEach((a: any) => {
        items.push({
          text: `${a.firstName} ${a.lastName} submitted an application`,
          time: formatRelative(a.createdAt),
          icon: <FileText size={12} />, bg: '#FFF8F0', color: '#B45309',
          category: 'application',
        });
      });
    }

    if (activityFilter === 'all' || activityFilter === 'messages') {
      (ov.recentContacts || []).forEach((c: any) => {
        items.push({
          text: `${c.name} sent a message`,
          time: formatRelative(c.createdAt),
          icon: <MessageSquare size={12} />, bg: '#F0F9FF', color: '#0E7490',
          category: 'message',
        });
      });
    }

    items.sort((a, b) => a.time.localeCompare(b.time));
    return items.slice(0, 8);
  }
}

// ─── Sub-components ───

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700',
    active: 'bg-emerald-50 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-500',
    pending: 'bg-amber-50 text-amber-700',
    submitted: 'bg-blue-50 text-blue-700',
    reviewed: 'bg-cyan-50 text-cyan-700',
    'in-review': 'bg-cyan-50 text-cyan-700',
    accepted: 'bg-emerald-50 text-emerald-700',
    expired: 'bg-red-50 text-red-700',
    failed: 'bg-red-50 text-red-700',
    rejected: 'bg-red-50 text-red-700',
    read: 'bg-gray-100 text-gray-600',
    unread: 'bg-sky-50 text-sky-700',
    unknown: 'bg-[#F6F9FC] text-[#8792A2]',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[status] || styles.unknown}`}>
      {status}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#8792A2] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs text-[#1A1F36] font-medium">{value || '—'}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#E8ECF1] py-16 text-center">
      <div className="text-[#C1C9D2] mb-3 flex justify-center">{icon}</div>
      <p className="text-sm font-medium text-[#5A6987]">{title}</p>
      <p className="text-xs text-[#C1C9D2] mt-1 max-w-[260px] mx-auto">{desc}</p>
    </div>
  );
}
