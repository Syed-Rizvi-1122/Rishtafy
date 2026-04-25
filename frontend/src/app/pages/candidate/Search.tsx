import { useState, useEffect } from 'react';
import { SlidersHorizontal, Search as SearchIcon, X } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { ProfileCard } from '../../components/ProfileCard';
import { useAuth } from '../../context/AuthContext';

export default function Search() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ ageMin: '', ageMax: '', city: '', education: '' });
  const [applied, setApplied] = useState({ ageMin: '', ageMax: '', city: '', education: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/profiles');
      const data = await response.json();
      if (response.ok) {
        console.log(`[Search Telemetry] Received ${data.length} profiles from API`);
        console.log(`[Search Telemetry] Profile Names: ${data.map((p: any) => p.full_name).join(', ')}`);
        setProfiles(data);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async (receiverId: string) => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3001/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: receiverId
        })
      });
      if (response.ok) {
        alert('Interest request sent successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send interest.');
      }
    } catch (err) {
      alert('Could not connect to server.');
    }
  };

  const updateFilter = (field: string, value: string) => setFilters(f => ({ ...f, [field]: value }));

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ ...filters });
  };

  const clearFilters = () => {
    setFilters({ ageMin: '', ageMax: '', city: '', education: '' });
    setApplied({ ageMin: '', ageMax: '', city: '', education: '' });
  };

  const results = profiles.filter(p => {
    if (p.user_id === user?.id) return false;
    if (applied.ageMin && p.age < parseInt(applied.ageMin)) return false;
    if (applied.ageMax && p.age > parseInt(applied.ageMax)) return false;
    if (applied.city && applied.city !== 'Any' && p.city !== applied.city) return false;
    if (applied.education && applied.education !== 'Any' && !p.education?.toLowerCase().includes(applied.education.toLowerCase())) return false;
    return true;
  });

  const cityOptions = ['Any', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Quetta'];
  const educationOptions = ['Any', "Bachelor's", "Master's", "MBBS", "PharmD", "PhD"];

  const hasFilters = Object.values(applied).some(Boolean);

  const inputClass = "px-3 py-2 rounded-lg border text-sm outline-none transition-all";
  const inputStyle = { borderColor: 'var(--color-neutral-100)', backgroundColor: 'white' };

  return (
    <CandidateLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-playfair text-2xl mb-1" style={{ color: 'var(--color-primary-900)' }}>Find Matches</h1>
            <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>Browse verified profiles. Photos are blurred until connected.</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
            style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: showFilters ? 'var(--color-primary-900)' : 'white', color: showFilters ? 'white' : '#374151' }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent-500)' }} />}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl border p-5 mb-6 shadow-sm" style={{ borderColor: 'var(--color-neutral-100)' }}>
            <form onSubmit={applyFilters}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: '#374151' }}>Age Min</label>
                  <input
                    type="number"
                    value={filters.ageMin}
                    onChange={e => updateFilter('ageMin', e.target.value)}
                    placeholder="18"
                    className={`${inputClass} w-full`}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: '#374151' }}>Age Max</label>
                  <input
                    type="number"
                    value={filters.ageMax}
                    onChange={e => updateFilter('ageMax', e.target.value)}
                    placeholder="50"
                    className={`${inputClass} w-full`}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: '#374151' }}>City</label>
                  <select
                    value={filters.city}
                    onChange={e => updateFilter('city', e.target.value)}
                    className={`${inputClass} w-full`}
                    style={inputStyle}
                  >
                    {cityOptions.map(c => <option key={c} value={c === 'Any' ? '' : c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: '#374151' }}>Education</label>
                  <select
                    value={filters.education}
                    onChange={e => updateFilter('education', e.target.value)}
                    className={`${inputClass} w-full`}
                    style={inputStyle}
                  >
                    {educationOptions.map(e => <option key={e} value={e === 'Any' ? '' : e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--color-primary-900)' }}>
                <SearchIcon size={14} /> Apply Filters
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>
            {loading ? 'Searching...' : `${results.length} profile${results.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading profiles...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={{
                  id: profile.id,
                  userId: profile.user_id,
                  name: profile.full_name,
                  age: profile.age,
                  city: profile.city,
                  education: profile.education,
                  profession: profile.profession,
                  photoUrl: profile.photo_path
                }}
                isConnected={false}
                onSendInterest={handleSendInterest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon size={24} className="mx-auto mb-4 opacity-20" />
            <p className="font-playfair text-xl mb-2">No profiles found</p>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
