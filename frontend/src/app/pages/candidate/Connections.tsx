import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { MessageCircle, MapPin, GraduationCap, Users } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { useAuth } from '../../context/AuthContext';

export default function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchConnections();
  }, [user]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/connections/${user?.id}`);
      const data = await response.json();
      if (response.ok) {
        setConnections(data);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: 'var(--color-primary-900)' }}>My Connections</h1>
          <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>
            {connections.length > 0
              ? `You have ${connections.length} active connection${connections.length > 1 ? 's' : ''}. Photos are now visible.`
              : 'Accept interest requests to create connections.'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-var(--color-neutral-400)">Loading connections...</div>
        ) : connections.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed flex flex-col items-center" style={{ borderColor: 'var(--color-neutral-200)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-accent-50)' }}>
              <Users size={32} color="var(--color-primary-900)" className="opacity-20" />
            </div>
            <p className="font-playfair text-2xl mb-3" style={{ color: 'var(--color-primary-900)' }}>Your circle is ready to grow</p>
            <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
              When you and another candidate mutually accept interest, your secure connection will appear here.
            </p>
            <Link to="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-white font-medium no-underline shadow-md transition-all hover:scale-105" style={{ backgroundColor: 'var(--color-primary-900)' }}>
              Explore Profiles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map(conn => {
              const profile = conn.partner;
              if (!profile) return null;
              return (
                <div key={conn.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--color-neutral-100)' }}>
                  <div className="flex items-center gap-4 p-5">
                    {/* Unblurred photo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                      {profile.photo_path ? (
                        <img src={profile.photo_path} alt={profile.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-playfair text-xl" style={{ backgroundColor: 'var(--color-primary-900)', color: 'var(--color-accent-500)' }}>
                          {profile.full_name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair text-base mb-0.5" style={{ color: 'var(--color-primary-900)' }}>
                        {profile.full_name}, {profile.age}
                      </h3>
                      <div className="flex items-center gap-3 text-xs flex-wrap mb-2" style={{ color: 'var(--color-neutral-400)' }}>
                        <span className="flex items-center gap-1"><MapPin size={11} />{profile.city}</span>
                        <span className="flex items-center gap-1"><GraduationCap size={11} />{profile.profession}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>
                        Connected {new Date(conn.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/chat/${conn.id}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary-900)' }}
                      >
                        <MessageCircle size={14} />
                        Chat
                      </button>
                      <Link
                        to={`/profile/${profile.user_id}`}
                        className="flex items-center justify-center px-4 py-2 rounded-xl text-xs border no-underline transition-all"
                        style={{ borderColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-400)' }}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 border-t" style={{ backgroundColor: '#FAFAFA', borderColor: 'var(--color-neutral-100)' }}>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      ✅ Photos unblurred · Chat enabled · Family meeting can be arranged
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
