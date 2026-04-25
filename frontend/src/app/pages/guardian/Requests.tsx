import { useState } from 'react';
import { CheckCircle, XCircle, MapPin, GraduationCap, Briefcase, Bell, Eye } from 'lucide-react';
import { GuardianLayout } from '../../components/layout/GuardianLayout';
import { useAuth } from '../../context/AuthContext';
import { getCandidateForGuardian, getProfileByUserId, MOCK_REQUESTS } from '../../lib/mockData';
import { InterestRequest } from '../../types';

export default function GuardianRequests() {
  const { user } = useAuth();
  const candidateId = user ? getCandidateForGuardian(user.id) : undefined;
  const candidateProfile = candidateId ? getProfileByUserId(candidateId) : null;

  const [requests, setRequests] = useState<InterestRequest[]>(
    candidateId
      ? MOCK_REQUESTS.filter(r => r.receiverId === candidateId && !r.guardianReviewed && r.status === 'pending')
      : []
  );
  const [reviewed, setReviewed] = useState<{ id: string; action: 'approved' | 'declined' }[]>([]);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setReviewed(prev => [...prev, { id, action: 'approved' }]);
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setReviewed(prev => [...prev, { id, action: 'declined' }]);
  };

  return (
    <GuardianLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5A55A' }}>Guardian Panel</p>
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>Review Interest Requests</h1>
          {candidateProfile && (
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Reviewing requests for: <span className="font-medium" style={{ color: '#1B3B2D' }}>{candidateProfile.name}</span>
            </p>
          )}
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-xl border text-sm" style={{ backgroundColor: 'rgba(27,59,45,0.04)', borderColor: 'rgba(27,59,45,0.12)', color: '#374151' }}>
          <p className="font-medium mb-1" style={{ color: '#1B3B2D' }}>How this works:</p>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            Review each interest request carefully. Approved requests will be forwarded to {candidateProfile?.name || 'your candidate'} for their decision. Declined requests will be removed. You can view the sender's profile details below.
          </p>
        </div>

        {/* Pending Requests */}
        {requests.length === 0 && reviewed.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(27,59,45,0.07)' }}>
              <Bell size={24} color="#9CA3AF" />
            </div>
            <p className="font-playfair text-xl mb-2" style={{ color: '#1B3B2D' }}>No pending requests</p>
            <p className="text-sm" style={{ color: '#6B7280' }}>New interest requests for {candidateProfile?.name} will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Pending */}
            {requests.length > 0 && (
              <div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C5A55A' }}>
                  Awaiting Review ({requests.length})
                </p>
                {requests.map(req => {
                  const sender = req.senderProfile;
                  if (!sender) return null;
                  return (
                    <div key={req.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-4" style={{ borderColor: '#E5E1D8' }}>
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Blurred photo for guardian */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                            {sender.photoUrl ? (
                              <img src={sender.photoUrl} alt="" className="w-full h-full object-cover blur-md scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-playfair text-xl" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
                                {sender.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-playfair text-base" style={{ color: '#1B3B2D' }}>{sender.name}, {sender.age}</h4>
                              {sender.isVerified && (
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                                  <CheckCircle size={10} /> Verified
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}><MapPin size={11} />{sender.city}</span>
                              <span className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}><Briefcase size={11} />{sender.profession}</span>
                              <span className="flex items-center gap-1.5 text-xs col-span-2" style={{ color: '#6B7280' }}><GraduationCap size={11} />{sender.education}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                              "{sender.aboutMe.slice(0, 140)}..."
                            </p>
                          </div>
                        </div>

                        {/* Values */}
                        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                          <p className="text-xs mb-1 font-medium" style={{ color: '#374151' }}>Religious Values:</p>
                          <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{sender.religiousValues}</p>
                        </div>

                        {/* Request date */}
                        <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>
                          Request received: {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex border-t" style={{ borderColor: '#E5E1D8' }}>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: '#1B3B2D', color: 'white' }}
                        >
                          <CheckCircle size={15} />
                          Approve & Forward
                        </button>
                        <div className="w-px" style={{ backgroundColor: '#E5E1D8' }} />
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors"
                          style={{ color: '#DC2626' }}
                        >
                          <XCircle size={15} />
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reviewed */}
            {reviewed.length > 0 && (
              <div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#9CA3AF' }}>
                  Recently Reviewed ({reviewed.length})
                </p>
                {reviewed.map(({ id, action }) => (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-lg border mb-2" style={{ borderColor: '#E5E1D8', backgroundColor: '#FAFAFA' }}>
                    {action === 'approved' ? (
                      <CheckCircle size={16} color="#16A34A" />
                    ) : (
                      <XCircle size={16} color="#DC2626" />
                    )}
                    <p className="text-sm" style={{ color: '#374151' }}>
                      Request {action === 'approved' ? 'approved and forwarded' : 'declined'}
                    </p>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: action === 'approved' ? '#DCFCE7' : '#FEE2E2',
                      color: action === 'approved' ? '#166534' : '#991B1B',
                    }}>
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}
