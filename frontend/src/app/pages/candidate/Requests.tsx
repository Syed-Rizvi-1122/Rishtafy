import { useState, useEffect } from 'react';
import { Send, Inbox } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { RequestCard } from '../../components/RequestCard';
import { useAuth } from '../../context/AuthContext';

export default function Requests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/interests/${user?.id}`);
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const sent = requests.filter(r => r.sender_id === user.id);
  const received = requests.filter(r => r.receiver_id === user.id);
  const pendingCount = received.filter(r => r.status === 'pending_candidate' || r.status === 'pending_guardian').length;

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/interests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      if (response.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r));
        alert('Match accepted! You can now find this person in your Connections.');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Could not accept request'}`);
      }
    } catch (err) {
      alert('Could not connect to server.');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/interests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'declined' })
      });
      if (response.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' as const } : r));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Could not decline request'}`);
      }
    } catch (err) {
      alert('Could not connect to server.');
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: 'var(--color-primary-900)' }}>Interest Requests</h1>
          <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>Manage sent and received interest requests.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border p-1 mb-6 shadow-sm" style={{ borderColor: 'var(--color-neutral-100)' }}>
          {([
            { key: 'received' as const, label: 'Received', icon: Inbox, count: pendingCount },
            { key: 'sent' as const, label: 'Sent', icon: Send, count: sent.length },
          ] as const).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={activeTab === key
                ? { backgroundColor: 'var(--color-primary-900)', color: 'white' }
                : { color: 'var(--color-neutral-400)' }
              }
            >
              <Icon size={15} />
              {label}
              {count > 0 && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${activeTab === key ? 'bg-white/20' : 'bg-var(--color-accent-500)'}`} 
                      style={activeTab === key ? { color: 'white' } : { backgroundColor: 'var(--color-accent-500)', color: 'white' }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">Loading requests...</div>
        ) : (
          <>
            {activeTab === 'received' && (
              <div className="space-y-4">
                {received.length === 0 ? (
                  <div className="text-center py-16">
                    <Inbox size={22} className="mx-auto mb-3 opacity-20" />
                    <p className="font-playfair text-lg">No requests yet</p>
                  </div>
                ) : (
                  received.map(req => (
                    <RequestCard
                      key={req.id}
                      request={{
                        id: req.id,
                        senderId: req.sender_id,
                        receiverId: req.receiver_id,
                        status: req.status,
                        createdAt: req.created_at,
                        senderProfile: {
                          name: req.sender?.full_name,
                          city: req.sender?.city,
                          age: req.sender?.age
                        }
                      }}
                      type="received"
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div className="space-y-4">
                {sent.length === 0 ? (
                  <div className="text-center py-16">
                    <Send size={22} className="mx-auto mb-3 opacity-20" />
                    <p className="font-playfair text-lg">No requests sent</p>
                  </div>
                ) : (
                  sent.map(req => (
                    <RequestCard 
                      key={req.id} 
                      request={{
                        id: req.id,
                        senderId: req.sender_id,
                        receiverId: req.receiver_id,
                        status: req.status,
                        createdAt: req.created_at,
                        receiverProfile: {
                          name: req.receiver?.full_name,
                          city: req.receiver?.city,
                          age: req.receiver?.age
                        }
                      }} 
                      type="sent" 
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </CandidateLayout>
  );
}
