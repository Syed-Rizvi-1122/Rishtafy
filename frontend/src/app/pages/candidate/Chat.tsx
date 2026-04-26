import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Send, ArrowLeft, Info, Circle } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { ChatBubble } from '../../components/ChatBubble';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../main';
import { Message } from '../../types';

export default function Chat() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  useEffect(() => {
    if (user && connectionId) {
      fetchInitialData();
      
      // Initialize Real-time Channel with Broadcast & Presence
      const channel = supabase.channel(`chat:${connectionId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: user.id }
        }
      });

      channelRef.current = channel;

      channel
        // 1. Handle Real-time Messages (Broadcast)
        .on('broadcast', { event: 'message' }, (payload) => {
          const newMessage = payload.payload as Message;
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        })
        // 2. Handle Typing Indicators
        .on('broadcast', { event: 'typing' }, (payload) => {
          if (payload.payload.userId !== user.id) {
            setIsPartnerTyping(payload.payload.isTyping);
          }
        })
        // 3. Handle Presence (Online Status)
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const onlineUserIds = Object.keys(state);
          const partnerInRoom = onlineUserIds.some(id => id !== user.id);
          setIsPartnerOnline(partnerInRoom);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString() });
          }
        });

      return () => {
        supabase.removeChannel(channel);
        channelRef.current = null;
      };
    }
  }, [user, connectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const msgRes = await fetch(`http://localhost:3001/api/messages/${connectionId}`);
      const msgData = await msgRes.json();
      if (msgRes.ok) setMessages(msgData);

      const connRes = await fetch(`http://localhost:3001/api/connections/${user?.id}`);
      const connData = await connRes.json();
      if (connRes.ok) {
        const conn = connData.find((c: any) => c.id === connectionId);
        if (conn) setPartner(conn.partner);
      }
    } catch (err) {
      console.error('Error fetching chat data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Broadcast typing status using the persistent channel
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user?.id, isTyping: true }
      });

      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: user?.id, isTyping: false }
          });
        }
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !connectionId) return;

    const text = input.trim();
    setInput('');

    try {
      // 1. Send to Backend (Persistence)
      const response = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, senderId: user.id, text })
      });
      const savedMsg = await response.json();

      // 2. Broadcast to Peer (Low Latency) using the persistent channel
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'message',
          payload: savedMsg
        });

        // Reset typing status immediately
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user.id, isTyping: false }
        });
      }

    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!user || (!loading && !partner)) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center h-64">
          <p style={{ color: 'var(--color-neutral-400)' }}>Connection not found.</p>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-0 sm:px-6 py-0 sm:py-8 h-[calc(100vh-4rem-5rem)] sm:h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex flex-col h-full bg-white sm:rounded-2xl sm:border shadow-sm overflow-hidden" style={{ borderColor: 'var(--color-neutral-100)' }}>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ backgroundColor: 'var(--color-primary-900)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <button onClick={() => navigate('/connections')} className="text-white/70 hover:text-white mr-1">
              <ArrowLeft size={18} />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 relative">
               {partner?.photo_path ? (
                  <img src={partner.photo_path} alt={partner.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-playfair" style={{ backgroundColor: 'var(--color-accent-50)', color: 'var(--color-primary-900)' }}>
                    {partner?.full_name?.charAt(0) || '?'}
                  </div>
                )}
                {isPartnerOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-primary-900" style={{ backgroundColor: '#10B981' }} />
                )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium">{partner?.full_name || 'Connection'}</p>
                {isPartnerOnline && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium tracking-wide uppercase online-status">Online</span>
                )}
              </div>
              <p className="text-xs" style={{ color: 'var(--color-accent-500)' }}>✅ Connected · Chat enabled</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-white/60 hover:text-white p-1.5 rounded-lg transition-colors">
                <Info size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
            {loading ? (
              <div className="text-center py-10 text-sm" style={{ color: 'var(--color-neutral-400)' }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm mb-1" style={{ color: 'var(--color-neutral-400)' }}>No messages yet</p>
                <p className="text-xs" style={{ color: 'var(--color-accent-500)' }}>Start the conversation with Bismillah 🌿</p>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((msg, i) => {
                   const showDate = i === 0 || new Date(msg.created_at).toDateString() !== new Date(messages[i-1].created_at).toDateString();
                   return (
                     <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-var(--color-neutral-400) font-medium">
                              {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        )}
                        <ChatBubble
                          message={{
                              ...msg,
                              createdAt: msg.created_at
                          }}
                          isOwn={msg.sender_id === user.id}
                        />
                     </div>
                   )
                })}
              </div>
            )}
            
            {/* Typing Indicator UI */}
            {isPartnerTyping && (
              <div className="flex items-center gap-2 mt-2 px-2 animate-pulse">
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-var(--color-neutral-400)" />
                  <div className="w-1 h-1 rounded-full bg-var(--color-neutral-400)" />
                  <div className="w-1 h-1 rounded-full bg-var(--color-neutral-400)" />
                </div>
                <span className="text-[10px] text-var(--color-neutral-400) italic">{partner?.full_name?.split(' ')[0]} is typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: 'white' }}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: '#FAFAFA' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-accent-500)' }}
            >
              <Send size={15} color="white" />
            </button>
          </form>
        </div>
      </div>
    </CandidateLayout>
  );
}
