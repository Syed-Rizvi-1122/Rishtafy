import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Send, ArrowLeft, Phone, Info } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { ChatBubble } from '../../components/ChatBubble';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CONNECTIONS, getMessagesForConnection } from '../../lib/mockData';
import { Message } from '../../types';

export default function Chat() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const connection = MOCK_CONNECTIONS.find(c => c.id === connectionId);
  const profile = connection
    ? (connection.user1Id === user?.id ? connection.user2Id : connection.user1Id)
    : null;

  const [messages, setMessages] = useState<Message[]>(
    connectionId ? getMessagesForConnection(connectionId) : []
  );
  const [input, setInput] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user || !connection) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-64">
          <p style={{ color: '#6B7280' }}>Connection not found.</p>
        </div>
      </CandidateLayout>
    );
  }

  const connectedProfile = connection.connectedProfile || 
    MOCK_CONNECTIONS.find(c => c.id === connectionId)?.connectedProfile;
  
  // Get profile based on who the other user is
  const otherUserId = connection.user1Id === user.id ? connection.user2Id : connection.user1Id;
  const partnerProfile = connection.connectedProfile;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      connectionId: connectionId!,
      senderId: user.id,
      text: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "JazakAllah Khair for your message! 🤲",
        "That sounds wonderful, inshallah!",
        "I agree completely. May Allah bless our efforts.",
        "Alhamdulillah! I'm so glad we connected.",
      ];
      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        connectionId: connectionId!,
        senderId: otherUserId,
        text: replies[Math.floor(Math.random() * replies.length)],
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-0 sm:px-6 py-0 sm:py-8 h-[calc(100vh-4rem-5rem)] sm:h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex flex-col h-full bg-white sm:rounded-2xl sm:border shadow-sm overflow-hidden" style={{ borderColor: '#E5E1D8' }}>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ backgroundColor: '#1B3B2D', borderColor: 'rgba(255,255,255,0.1)' }}>
            <button onClick={() => navigate('/connections')} className="text-white/70 hover:text-white mr-1">
              <ArrowLeft size={18} />
            </button>
            {partnerProfile?.photoUrl ? (
              <img src={partnerProfile.photoUrl} alt={partnerProfile.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-playfair" style={{ backgroundColor: '#C5A55A', color: '#1B3B2D' }}>
                {partnerProfile?.name.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{partnerProfile?.name || 'Connection'}</p>
              <p className="text-xs" style={{ color: '#C5A55A' }}>✅ Connected · Chat enabled</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-white/60 hover:text-white p-1.5 rounded-lg transition-colors">
                <Info size={16} />
              </button>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="px-4 py-2 text-center text-xs" style={{ backgroundColor: 'rgba(197,165,90,0.08)', color: '#92400E' }}>
            🕌 Please maintain Islamic adab in all communication. Involve your families.
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ backgroundColor: '#FAF7F2' }}>
            {messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>No messages yet</p>
                <p className="text-xs" style={{ color: '#C5A55A' }}>Start the conversation with Bismillah 🌿</p>
              </div>
            )}
            {messages.map(msg => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: '#E5E1D8', backgroundColor: 'white' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: '#E5E1D8', backgroundColor: '#FAFAFA' }}
              onFocus={e => e.target.style.borderColor = '#1B3B2D'}
              onBlur={e => e.target.style.borderColor = '#E5E1D8'}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ backgroundColor: '#C5A55A' }}
            >
              <Send size={15} color="white" />
            </button>
          </form>
        </div>
      </div>
    </CandidateLayout>
  );
}
