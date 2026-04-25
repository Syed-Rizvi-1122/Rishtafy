import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: boolean;
}

export function StatsCard({ icon: Icon, label, value, sublabel, accent = false }: StatsCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4 shadow-sm border"
      style={{
        backgroundColor: accent ? '#1B3B2D' : 'white',
        borderColor: accent ? 'transparent' : '#E5E1D8',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: accent ? 'rgba(197,165,90,0.2)' : 'rgba(27,59,45,0.08)' }}
      >
        <Icon size={22} color={accent ? '#C5A55A' : '#1B3B2D'} />
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none mb-1" style={{ color: accent ? 'white' : '#1B3B2D' }}>
          {value}
        </p>
        <p className="text-sm" style={{ color: accent ? 'rgba(255,255,255,0.7)' : '#6B7280' }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5" style={{ color: accent ? '#C5A55A' : '#9CA3AF' }}>{sublabel}</p>}
      </div>
    </div>
  );
}
