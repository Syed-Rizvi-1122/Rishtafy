import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MapPin, GraduationCap, Briefcase, Heart, BookOpen, BadgeCheck, Send, ArrowLeft, MessageCircle, Lock } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { useAuth } from '../../context/AuthContext';
import { getProfileByUserId, isConnected, getSentRequests, getConnectionsForUser } from '../../lib/mockData';

export default function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);

  const profile = userId ? getProfileByUserId(userId) : null;
  if (!profile || !user) return null;

  const connected = isConnected(user.id, userId!);
  const sentRequests = getSentRequests(user.id);
  const connections = getConnectionsForUser(user.id);
  const alreadySent = sentRequests.some(r => r.receiverId === userId);
  const connection = connections.find(c => c.connectedProfile?.userId === userId);

  const handleSendInterest = () => {
    setRequestSent(true);
  };

  const handleChat = () => {
    if (connection) navigate(`/chat/${connection.id}`);
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm mb-6 transition-colors"
          style={{ color: '#6B7280' }}
        >
          <ArrowLeft size={15} />
          Back to Search
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Photo + Status */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border overflow-hidden shadow-sm sticky top-20" style={{ borderColor: '#E5E1D8' }}>
              <div className="relative h-64 overflow-hidden">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={connected ? profile.name : 'Profile photo'}
                    className={`w-full h-full object-cover transition-all duration-500 ${!connected ? 'blur-xl scale-110' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-playfair" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
                    {profile.name.charAt(0)}
                  </div>
                )}
                {!connected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                    <Lock size={22} color="white" className="mb-2" />
                    <p className="text-white text-sm font-medium">Photo Hidden</p>
                    <p className="text-white/70 text-xs mt-1">Connect to reveal</p>
                  </div>
                )}
                {profile.isVerified && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/95 font-medium" style={{ color: '#166534' }}>
                      <BadgeCheck size={12} fill="#16A34A" color="#16A34A" />
                      Verified
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h2 className="font-playfair text-xl mb-1" style={{ color: '#1B3B2D' }}>{profile.name}</h2>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{profile.age} years old • {profile.gender === 'male' ? '♂' : '♀'}</p>

                {connected ? (
                  <button
                    onClick={handleChat}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: '#1B3B2D' }}
                  >
                    <MessageCircle size={15} />
                    Open Chat
                  </button>
                ) : alreadySent || requestSent ? (
                  <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    <Send size={15} />
                    Interest Sent
                  </div>
                ) : (
                  <button
                    onClick={handleSendInterest}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: '#C5A55A' }}
                  >
                    <Heart size={15} />
                    Send Interest
                  </button>
                )}

                {!connected && !alreadySent && !requestSent && (
                  <p className="text-xs text-center mt-2" style={{ color: '#9CA3AF' }}>
                    Guardian will be notified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Profile Details */}
          <div className="md:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C5A55A' }}>Profile Details</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: 'City', value: profile.city },
                  { icon: GraduationCap, label: 'Education', value: profile.education },
                  { icon: Briefcase, label: 'Profession', value: profile.profession },
                  { icon: Heart, label: 'Age', value: `${profile.age} years` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(27,59,45,0.07)' }}>
                      <Icon size={14} color="#1B3B2D" />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{label}</p>
                      <p className="text-sm font-medium" style={{ color: '#374151' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={15} color="#C5A55A" />
                <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A55A' }}>About Me</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{profile.aboutMe}</p>
            </div>

            {/* Religious Values */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={15} color="#C5A55A" />
                <p className="text-xs tracking-widest uppercase" style={{ color: '#C5A55A' }}>Religious Values</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{profile.religiousValues}</p>
            </div>

            {/* Partner Preferences */}
            <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C5A55A' }}>Looking For</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                  <p className="text-xs mb-0.5" style={{ color: '#9CA3AF' }}>Age Range</p>
                  <p className="text-sm font-medium" style={{ color: '#374151' }}>{profile.partnerAgeMin} – {profile.partnerAgeMax} yrs</p>
                </div>
                <div className="px-3 py-2.5 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                  <p className="text-xs mb-0.5" style={{ color: '#9CA3AF' }}>City</p>
                  <p className="text-sm font-medium" style={{ color: '#374151' }}>{profile.partnerCity}</p>
                </div>
                <div className="px-3 py-2.5 rounded-lg col-span-2" style={{ backgroundColor: '#F9FAFB' }}>
                  <p className="text-xs mb-0.5" style={{ color: '#9CA3AF' }}>Education</p>
                  <p className="text-sm font-medium" style={{ color: '#374151' }}>{profile.partnerEducation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
