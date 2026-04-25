import { Link, useNavigate } from 'react-router';
import { Bell, Edit, Users, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { GuardianLayout } from '../../components/layout/GuardianLayout';
import { StatsCard } from '../../components/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { getCandidateForGuardian, getProfileByUserId, getGuardianPendingRequests, MOCK_REQUESTS } from '../../lib/mockData';

export default function GuardianDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const candidateId = getCandidateForGuardian(user.id);
  const candidateProfile = candidateId ? getProfileByUserId(candidateId) : null;
  const pendingRequests = candidateId ? getGuardianPendingRequests(candidateId) : [];
  const allIncoming = candidateId ? MOCK_REQUESTS.filter(r => r.receiverId === candidateId) : [];

  return (
    <GuardianLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5A55A' }}>Guardian Dashboard</p>
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>
            Assalamu Alaikum, {user.name.split(' ').slice(1).join(' ') || user.name}
          </h1>
          {candidateProfile ? (
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Managing profile for: <span className="font-medium" style={{ color: '#1B3B2D' }}>{candidateProfile.name}</span>
              {pendingRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(197,165,90,0.15)', color: '#92400E' }}>
                  {pendingRequests.length} requests await your review
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm" style={{ color: '#6B7280' }}>No candidate linked yet.</p>
          )}
        </div>

        {/* Candidate Card */}
        {candidateProfile && (
          <div className="mb-6 bg-white rounded-xl border p-5 shadow-sm flex items-center gap-5" style={{ borderColor: '#E5E1D8' }}>
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
              {candidateProfile.photoUrl ? (
                <img src={candidateProfile.photoUrl} alt={candidateProfile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-playfair text-2xl" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
                  {candidateProfile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-playfair text-lg mb-0.5" style={{ color: '#1B3B2D' }}>{candidateProfile.name}</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>{candidateProfile.age} yrs • {candidateProfile.city} • {candidateProfile.profession}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full overflow-hidden max-w-xs" style={{ backgroundColor: '#F3F4F6' }}>
                  <div className="h-full rounded-full" style={{ width: `${candidateProfile.profileCompletion}%`, backgroundColor: '#C5A55A' }} />
                </div>
                <span className="text-xs" style={{ color: '#6B7280' }}>{candidateProfile.profileCompletion}% complete</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link to="/guardian/profile/edit" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium no-underline" style={{ backgroundColor: '#1B3B2D', color: 'white' }}>
                <Edit size={13} /> Edit Profile
              </Link>
              <Link to="/guardian/requests" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border no-underline text-center justify-center" style={{ borderColor: '#E5E1D8', color: '#374151' }}>
                <Bell size={13} /> Requests
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatsCard icon={Bell} label="Pending Review" value={pendingRequests.length} accent sublabel="Need your action" />
          <StatsCard icon={Users} label="Total Requests" value={allIncoming.length} />
          <StatsCard icon={CheckCircle} label="Approved" value={allIncoming.filter(r => r.guardianReviewed).length} />
        </div>

        {/* Pending Requests Preview */}
        <div className="bg-white rounded-xl border p-5 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A55A' }}>Pending Requests</p>
            <Link to="/guardian/requests" className="text-xs no-underline flex items-center gap-1" style={{ color: '#1B3B2D' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={24} className="mx-auto mb-2" color="#16A34A" />
              <p className="text-sm" style={{ color: '#6B7280' }}>No pending requests to review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map(req => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FAFAFA' }}>
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    {req.senderProfile?.photoUrl ? (
                      <img src={req.senderProfile.photoUrl} alt="" className="w-full h-full object-cover blur-sm" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-playfair" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
                        {req.senderProfile?.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#374151' }}>{req.senderProfile?.name}, {req.senderProfile?.age}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{req.senderProfile?.city} • {req.senderProfile?.profession}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                    <Clock size={10} />
                    Pending
                  </div>
                </div>
              ))}
              {pendingRequests.length > 3 && (
                <p className="text-xs text-center pt-1" style={{ color: '#9CA3AF' }}>+{pendingRequests.length - 3} more</p>
              )}
            </div>
          )}
        </div>

        {/* Alert */}
        {pendingRequests.length > 0 && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(254,243,199,0.5)', borderColor: 'rgba(197,165,90,0.3)' }}>
            <AlertCircle size={16} color="#C5A55A" className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium mb-0.5" style={{ color: '#92400E' }}>Action Required</p>
              <p className="text-xs" style={{ color: '#B45309' }}>
                You have {pendingRequests.length} interest request{pendingRequests.length > 1 ? 's' : ''} to review. Please review and approve or decline before {candidateProfile?.name} can respond.
              </p>
              <Link to="/guardian/requests" className="mt-2 inline-block text-xs font-medium no-underline" style={{ color: '#C5A55A' }}>
                Review now →
              </Link>
            </div>
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}
