import { useNavigate, Link } from 'react-router';
import { Send, Users, UserCheck, Search, Bell, Edit, ArrowRight, Clock, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { StatsCard } from '../../components/StatsCard';
import { getSentRequests, getReceivedRequests, getConnectionsForUser, getProfileByUserId } from '../../lib/mockData';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const profile = getProfileByUserId(user.id);
  const sentRequests = getSentRequests(user.id);
  const receivedRequests = getReceivedRequests(user.id);
  const connections = getConnectionsForUser(user.id);
  const pendingReceived = receivedRequests.filter(r => r.status === 'pending' || r.status === 'approved_by_guardian');
  const profileCompletion = profile?.profileCompletion ?? 40;

  const recentActivity = [
    { icon: Bell, text: 'Ali Hassan sent you an interest request', time: '2 hours ago', color: '#1B3B2D' },
    { icon: CheckCircle, text: 'Your connection with Zara Ahmed was accepted', time: '3 weeks ago', color: '#16A34A' },
    { icon: Send, text: 'You sent an interest request to Amna Malik', time: '8 days ago', color: '#C5A55A' },
    { icon: Star, text: 'Your profile was verified by Rishtafy', time: '1 month ago', color: '#C5A55A' },
  ];

  return (
    <CandidateLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="font-playfair mb-1" style={{ color: '#1B3B2D', fontSize: '1.8rem' }}>
            Assalamu Alaikum, <span style={{ color: '#C5A55A' }}>{user.name.split(' ')[0]}</span> 🌿
          </h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {pendingReceived.length > 0
              ? `You have ${pendingReceived.length} pending interest request${pendingReceived.length > 1 ? 's' : ''} awaiting your response.`
              : 'Everything is up to date. Browse profiles to find your match.'}
          </p>
        </div>

        {/* Profile Completion Banner */}
        {profileCompletion < 100 && (
          <div className="mb-6 rounded-xl p-4 flex items-center justify-between gap-4 border" style={{ backgroundColor: 'rgba(197,165,90,0.08)', borderColor: 'rgba(197,165,90,0.3)' }}>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2" style={{ color: '#92400E' }}>
                Complete your profile to attract more matches ({profileCompletion}% done)
              </p>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(197,165,90,0.2)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${profileCompletion}%`, backgroundColor: '#C5A55A' }} />
              </div>
            </div>
            <Link to="/profile/edit" className="flex items-center gap-1.5 text-sm font-medium no-underline px-4 py-2 rounded-lg" style={{ backgroundColor: '#C5A55A', color: 'white' }}>
              <Edit size={14} />
              Edit Profile
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Send} label="Sent Requests" value={sentRequests.length} />
          <StatsCard icon={Bell} label="Received" value={receivedRequests.length} sublabel={`${pendingReceived.length} pending`} />
          <StatsCard icon={Users} label="Connections" value={connections.length} accent />
          <StatsCard icon={UserCheck} label="Profile" value={`${profileCompletion}%`} sublabel="Completion" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C5A55A' }}>Quick Actions</p>
              <div className="space-y-2">
                {[
                  { icon: Search, label: 'Find Matches', sub: 'Browse verified profiles', to: '/search', accent: true },
                  { icon: Bell, label: 'View Requests', sub: `${pendingReceived.length} awaiting response`, to: '/requests', accent: false },
                  { icon: Users, label: 'Connections', sub: `${connections.length} active`, to: '/connections', accent: false },
                  { icon: Edit, label: 'Edit Profile', sub: `${profileCompletion}% complete`, to: '/profile/edit', accent: false },
                ].map(({ icon: Icon, label, sub, to, accent }) => (
                  <button
                    key={to}
                    onClick={() => navigate(to)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border text-left transition-all hover:shadow-sm"
                    style={accent
                      ? { backgroundColor: '#1B3B2D', borderColor: '#1B3B2D' }
                      : { backgroundColor: '#FAFAFA', borderColor: '#E5E1D8' }
                    }
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: accent ? 'rgba(255,255,255,0.15)' : 'rgba(27,59,45,0.07)' }}>
                      <Icon size={16} color={accent ? '#C5A55A' : '#1B3B2D'} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium" style={{ color: accent ? 'white' : '#1B3B2D' }}>{label}</p>
                      <p className="text-xs" style={{ color: accent ? 'rgba(255,255,255,0.6)' : '#9CA3AF' }}>{sub}</p>
                    </div>
                    <ArrowRight size={14} style={{ color: accent ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }} className="ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A55A' }}>Recent Activity</p>
                <Link to="/requests" className="text-xs no-underline" style={{ color: '#1B3B2D' }}>View all →</Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${item.color}15` }}>
                      <item.icon size={14} color={item.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: '#374151' }}>{item.text}</p>
                      <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                        <Clock size={10} />
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
