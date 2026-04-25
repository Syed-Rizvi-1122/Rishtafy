import { Users, Send, Link2, BadgeCheck, TrendingUp, Activity, Clock } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatsCard } from '../../components/StatsCard';
import { ADMIN_STATS, MOCK_USERS } from '../../lib/mockData';

const recentActivity = [
  { user: 'Amna Malik', action: 'Profile verified', time: '2 hours ago', type: 'verify' },
  { user: 'Omar Siddiqui', action: 'New registration', time: '4 hours ago', type: 'register' },
  { user: 'Fatima Raza', action: 'Sent interest request', time: '6 hours ago', type: 'request' },
  { user: 'Ali Hassan', action: 'New registration', time: '1 day ago', type: 'register' },
  { user: 'Zara Ahmed', action: 'Connection accepted', time: '2 days ago', type: 'connect' },
];

export default function AdminDashboard() {
  const verifiedCount = MOCK_USERS.filter(u => u.isVerified && u.role === 'candidate').length;
  const candidateCount = MOCK_USERS.filter(u => u.role === 'candidate').length;

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5A55A' }}>Admin Dashboard</p>
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>Platform Overview</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Users} label="Total Users" value={ADMIN_STATS.totalUsers.toLocaleString()} accent />
          <StatsCard icon={Send} label="Interest Requests" value={ADMIN_STATS.totalRequests.toLocaleString()} />
          <StatsCard icon={Link2} label="Active Connections" value={ADMIN_STATS.activeConnections.toLocaleString()} />
          <StatsCard icon={BadgeCheck} label="Verified Profiles" value={ADMIN_STATS.verifiedUsers.toLocaleString()} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity chart placeholder */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A55A' }}>Registration Trend</p>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(27,59,45,0.07)', color: '#1B3B2D' }}>Last 7 days</span>
            </div>
            {/* Simple bar chart visualization */}
            <div className="flex items-end gap-2 h-36">
              {[42, 67, 55, 89, 73, 91, 84].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(val / 100) * 120}px`,
                      backgroundColor: i === 6 ? '#C5A55A' : '#1B3B2D',
                      opacity: i === 6 ? 1 : 0.15 + i * 0.1,
                    }}
                  />
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: '#E5E1D8' }}>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C5A55A' }} />
                Today: 84 signups
              </div>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: '#16A34A' }}>
                <TrendingUp size={13} />
                +12% vs last week
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} color="#C5A55A" />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A55A' }}>Recent Activity</p>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold" style={{ backgroundColor: 'rgba(27,59,45,0.08)', color: '#1B3B2D' }}>
                    {item.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#374151' }}>{item.user}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{item.action}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs shrink-0" style={{ color: '#9CA3AF' }}>
                    <Clock size={10} />
                    {item.time.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role breakdown */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Candidates', count: MOCK_USERS.filter(u => u.role === 'candidate').length, pct: 75 },
            { label: 'Guardians', count: MOCK_USERS.filter(u => u.role === 'guardian').length, pct: 15 },
            { label: 'Admins', count: MOCK_USERS.filter(u => u.role === 'admin').length, pct: 10 },
          ].map(({ label, count, pct }) => (
            <div key={label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium" style={{ color: '#374151' }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: '#1B3B2D' }}>{count}</p>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#1B3B2D' }} />
              </div>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{pct}% of users</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
