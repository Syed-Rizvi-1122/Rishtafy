import { Link, useNavigate } from 'react-router';
import { MessageCircle, MapPin, GraduationCap, Users } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { useAuth } from '../../context/AuthContext';
import { getConnectionsForUser } from '../../lib/mockData';

export default function Connections() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const connections = getConnectionsForUser(user.id);

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>My Connections</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {connections.length > 0
              ? `You have ${connections.length} active connection${connections.length > 1 ? 's' : ''}. Photos are now visible.`
              : 'Accept interest requests to create connections.'}
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(27,59,45,0.07)' }}>
              <Users size={24} color="#9CA3AF" />
            </div>
            <p className="font-playfair text-xl mb-2" style={{ color: '#1B3B2D' }}>No connections yet</p>
            <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
              When you and another candidate mutually accept interest, you'll be connected here.
            </p>
            <Link to="/search" className="inline-block px-5 py-2.5 rounded-xl text-sm text-white font-medium no-underline" style={{ backgroundColor: '#1B3B2D' }}>
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map(conn => {
              const profile = conn.connectedProfile;
              if (!profile) return null;
              return (
                <div key={conn.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#E5E1D8' }}>
                  <div className="flex items-center gap-4 p-5">
                    {/* Unblurred photo */}
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                      {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-playfair text-xl" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
                          {profile.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-playfair text-base mb-0.5" style={{ color: '#1B3B2D' }}>
                        {profile.name}, {profile.age}
                      </h3>
                      <div className="flex items-center gap-3 text-xs flex-wrap mb-2" style={{ color: '#6B7280' }}>
                        <span className="flex items-center gap-1"><MapPin size={11} />{profile.city}</span>
                        <span className="flex items-center gap-1"><GraduationCap size={11} />{profile.profession}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>
                        Connected {new Date(conn.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/chat/${conn.id}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#1B3B2D' }}
                      >
                        <MessageCircle size={14} />
                        Chat
                      </button>
                      <Link
                        to={`/profile/${profile.userId}`}
                        className="flex items-center justify-center px-4 py-2 rounded-xl text-xs border no-underline transition-all"
                        style={{ borderColor: '#E5E1D8', color: '#6B7280' }}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                  <div className="px-5 py-2.5 border-t" style={{ backgroundColor: '#FAFAFA', borderColor: '#E5E1D8' }}>
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
