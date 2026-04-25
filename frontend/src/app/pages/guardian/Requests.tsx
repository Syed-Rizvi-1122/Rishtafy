import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, GraduationCap, Briefcase, Bell } from 'lucide-react';
import { GuardianLayout } from '../../components/layout/GuardianLayout';
import { useAuth } from '../../context/AuthContext';

export default function GuardianRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState<{ id: string; action: 'approved' | 'declined' }[]>([]);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/interests/${user?.id}`);
      const data = await response.json();
      if (response.ok) {
        // For guardian, we show requests where they are the guardian and status is pending_guardian
        setRequests(data.filter((r: any) => r.status === 'pending_guardian'));
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    // TODO: Implement Update Request API
    setRequests(prev => prev.filter(r => r.id !== id));
    setReviewed(prev => [...prev, { id, action: 'approved' }]);
  };

  const handleDecline = async (id: string) => {
    // TODO: Implement Update Request API
    setRequests(prev => prev.filter(r => r.id !== id));
    setReviewed(prev => [...prev, { id, action: 'declined' }]);
  };

  return (
    <GuardianLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--color-accent-500)' }}>Guardian Panel</p>
          <h1 className="font-playfair text-2xl mb-1" style={{ color: 'var(--color-primary-900)' }}>Review Interest Requests</h1>
          <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>
            Reviewing interests sent to your linked candidate.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-xl border text-sm" style={{ backgroundColor: 'rgba(27,59,45,0.04)', borderColor: 'rgba(27,59,45,0.12)', color: '#374151' }}>
          <p className="font-medium mb-1" style={{ color: 'var(--color-primary-900)' }}>How this works:</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
            Review each interest request carefully. Approved requests will be forwarded to your candidate for their decision.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading requests...</div>
        ) : requests.length === 0 && reviewed.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(27,59,45,0.07)' }}>
              <Bell size={24} color="#9CA3AF" />
            </div>
            <p className="font-playfair text-xl mb-2" style={{ color: 'var(--color-primary-900)' }}>No pending requests</p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.length > 0 && (
              <div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--color-accent-500)' }}>
                  Awaiting Review ({requests.length})
                </p>
                {requests.map(req => {
                  const sender = req.sender;
                  if (!sender) return null;
                  return (
                    <div key={req.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-4" style={{ borderColor: 'var(--color-neutral-100)' }}>
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                             <div className="w-full h-full flex items-center justify-center font-playfair text-xl" style={{ backgroundColor: 'var(--color-primary-900)', color: 'var(--color-accent-500)' }}>
                                {sender.full_name?.charAt(0)}
                              </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-playfair text-base" style={{ color: 'var(--color-primary-900)' }}>{sender.full_name}, {sender.age}</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-neutral-400)' }}><MapPin size={11} />{sender.city}</span>
                              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-neutral-400)' }}><Briefcase size={11} />{sender.profession}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>
                          Request received: {new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex border-t" style={{ borderColor: 'var(--color-neutral-100)' }}>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: 'var(--color-primary-900)', color: 'white' }}
                        >
                          <CheckCircle size={15} />
                          Approve & Forward
                        </button>
                        <div className="w-px" style={{ backgroundColor: 'var(--color-neutral-100)' }} />
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

            {reviewed.length > 0 && (
              <div>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#9CA3AF' }}>
                  Recently Reviewed ({reviewed.length})
                </p>
                {reviewed.map(({ id, action }) => (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-lg border mb-2" style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: '#FAFAFA' }}>
                    {action === 'approved' ? (
                      <CheckCircle size={16} color="#16A34A" />
                    ) : (
                      <XCircle size={16} color="#DC2626" />
                    )}
                    <p className="text-sm" style={{ color: '#374151' }}>
                      Request {action === 'approved' ? 'approved and forwarded' : 'declined'}
                    </p>
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
