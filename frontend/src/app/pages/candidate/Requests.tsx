import { useState } from 'react';
import { Send, Inbox } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { RequestCard } from '../../components/RequestCard';
import { useAuth } from '../../context/AuthContext';
import { getSentRequests, getReceivedRequests, MOCK_REQUESTS } from '../../lib/mockData';
import { InterestRequest } from '../../types';

export default function Requests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');
  const [requests, setRequests] = useState<InterestRequest[]>(MOCK_REQUESTS);

  if (!user) return null;

  const sent = requests.filter(r => r.senderId === user.id);
  const received = requests.filter(r => r.receiverId === user.id && r.guardianReviewed);
  const pendingCount = received.filter(r => r.status === 'pending' || r.status === 'approved_by_guardian').length;

  const handleAccept = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r));
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' as const } : r));
  };

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>Interest Requests</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Manage sent and received interest requests.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border p-1 mb-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
          {([
            { key: 'received' as const, label: 'Received', icon: Inbox, count: pendingCount },
            { key: 'sent' as const, label: 'Sent', icon: Send, count: 0 },
          ] as const).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={activeTab === key
                ? { backgroundColor: '#1B3B2D', color: 'white' }
                : { color: '#6B7280' }
              }
            >
              <Icon size={15} />
              {label}
              {key === 'received' && pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#C5A55A', color: 'white' }}>
                  {pendingCount}
                </span>
              )}
              {key === 'sent' && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: activeTab === key ? 'rgba(255,255,255,0.2)' : '#F3F4F6', color: activeTab === key ? 'white' : '#6B7280' }}>
                  {sent.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'received' && (
          <div className="space-y-4">
            {received.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(27,59,45,0.07)' }}>
                  <Inbox size={22} color="#9CA3AF" />
                </div>
                <p className="font-playfair text-lg mb-1" style={{ color: '#1B3B2D' }}>No requests yet</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Received requests will appear here once guardians review them.</p>
              </div>
            ) : (
              received.map(req => (
                <RequestCard
                  key={req.id}
                  request={req}
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
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(27,59,45,0.07)' }}>
                  <Send size={22} color="#9CA3AF" />
                </div>
                <p className="font-playfair text-lg mb-1" style={{ color: '#1B3B2D' }}>No requests sent</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>Browse profiles to send your first interest request.</p>
              </div>
            ) : (
              sent.map(req => (
                <RequestCard key={req.id} request={req} type="sent" />
              ))
            )}
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
