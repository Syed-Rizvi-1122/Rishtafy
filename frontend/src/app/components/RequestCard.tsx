import { Link } from 'react-router';
import { MapPin, GraduationCap, BadgeCheck, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { InterestRequest, RequestStatus } from '../types';

interface RequestCardProps {
  request: InterestRequest;
  type: 'sent' | 'received';
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7', icon: Clock },
  approved_by_guardian: { label: 'Awaiting Your Response', color: '#1D4ED8', bg: '#DBEAFE', icon: Eye },
  accepted: { label: 'Accepted', color: '#166534', bg: '#DCFCE7', icon: CheckCircle },
  declined: { label: 'Declined', color: '#991B1B', bg: '#FEE2E2', icon: XCircle },
};

export function RequestCard({ request, type, onAccept, onDecline }: RequestCardProps) {
  const profile = type === 'sent' ? request.receiverProfile : request.senderProfile;
  if (!profile) return null;

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
      <div className="flex items-start gap-4">
        {/* Photo */}
        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-100">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className={`w-full h-full object-cover ${request.status !== 'accepted' && type === 'sent' ? 'blur-md' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-playfair text-lg" style={{ backgroundColor: '#1B3B2D', color: '#C5A55A' }}>
              {profile.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-medium text-sm" style={{ color: '#1B3B2D' }}>
              {profile.name}, {profile.age}
            </h4>
            {profile.isVerified && <BadgeCheck size={14} fill="#16A34A" color="#16A34A" />}
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap mb-2" style={{ color: '#6B7280' }}>
            <span className="flex items-center gap-1"><MapPin size={11} />{profile.city}</span>
            <span className="flex items-center gap-1"><GraduationCap size={11} />{profile.profession}</span>
          </div>
          {!request.guardianReviewed && type === 'sent' && (
            <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>⏳ Awaiting guardian review</p>
          )}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: status.bg, color: status.color }}>
              <StatusIcon size={11} />
              {status.label}
            </span>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>
              {new Date(request.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions for received requests */}
      {type === 'received' && (request.status === 'pending' || request.status === 'approved_by_guardian') && onAccept && onDecline && (
        <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: '#E5E1D8' }}>
          <button
            onClick={() => onAccept(request.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors text-white"
            style={{ backgroundColor: '#1B3B2D' }}
          >
            Accept
          </button>
          <button
            onClick={() => onDecline(request.id)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors border"
            style={{ color: '#DC2626', borderColor: '#DC2626' }}
          >
            Decline
          </button>
          <Link
            to={`/profile/${profile.userId}`}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-center border transition-colors no-underline"
            style={{ color: '#1B3B2D', borderColor: '#E5E1D8' }}
          >
            View Profile
          </Link>
        </div>
      )}
    </div>
  );
}
