import { Link } from 'react-router';
import { MapPin, GraduationCap, BadgeCheck } from 'lucide-react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  isConnected?: boolean;
  onSendInterest?: (userId: string) => void;
}

export function ProfileCard({ profile, isConnected = false, onSendInterest }: ProfileCardProps) {
  return (
    <Link
      to={`/profile/${profile.userId}`}
      className="no-underline group profile-card"
    >
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5" style={{ borderColor: 'var(--color-neutral-100)' }}>
        {/* Photo */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={isConnected ? profile.name : 'Profile photo'}
              className={`w-full h-full object-cover transition-all duration-300 ${!isConnected ? 'blur-xl scale-110' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-playfair" style={{ backgroundColor: 'var(--color-primary-900)', color: 'var(--color-accent-500)' }}>
              {profile.name?.charAt(0)}
            </div>
          )}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 rounded-full px-3 py-1.5">
                <p className="text-white text-xs">🔒 Photo blurred</p>
              </div>
            </div>
          )}
          {profile.isVerified && (
            <div className="absolute top-2 right-2">
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/90 font-medium" style={{ color: 'var(--color-primary-900)' }}>
                <BadgeCheck size={12} fill="#16A34A" color="#16A34A" />
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-playfair text-base" style={{ color: 'var(--color-primary-900)' }}>
              {profile.name}, {profile.age}
            </h3>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-neutral-400)' }}>
              <MapPin size={13} />
              <span>{profile.city}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-neutral-400)' }}>
              <GraduationCap size={13} />
              <span className="truncate">{profile.education}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-neutral-100)' }}>
            <span
              className="inline-block text-xs px-3 py-1 rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(197,165,90,0.12)', color: 'var(--color-accent-500)' }}
            >
              View Profile →
            </span>
            {!isConnected && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSendInterest?.(profile.userId);
                }}
                className="text-xs font-medium px-3 py-1 rounded-full text-white transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--color-primary-900)' }}
              >
                Send Interest
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
