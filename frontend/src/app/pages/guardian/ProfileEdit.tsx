import { useState } from 'react';
import { CheckCircle, Upload, Camera } from 'lucide-react';
import { GuardianLayout } from '../../components/layout/GuardianLayout';
import { useAuth } from '../../context/AuthContext';
import { getCandidateForGuardian, getProfileByUserId } from '../../lib/mockData';

export default function GuardianProfileEdit() {
  const { user } = useAuth();
  const candidateId = user ? getCandidateForGuardian(user.id) : undefined;
  const candidateProfile = candidateId ? getProfileByUserId(candidateId) : null;

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: candidateProfile?.name || '',
    age: candidateProfile?.age?.toString() || '',
    city: candidateProfile?.city || '',
    education: candidateProfile?.education || '',
    profession: candidateProfile?.profession || '',
    religiousValues: candidateProfile?.religiousValues || '',
    aboutMe: candidateProfile?.aboutMe || '',
    partnerAgeMin: candidateProfile?.partnerAgeMin?.toString() || '22',
    partnerAgeMax: candidateProfile?.partnerAgeMax?.toString() || '32',
    partnerCity: candidateProfile?.partnerCity || 'Any',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all";
  const inputStyle = { borderColor: '#E5E1D8', backgroundColor: 'white' };
  const labelClass = "block text-sm mb-1.5 font-medium";
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#1B3B2D';
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#E5E1D8';

  const cityOptions = ['Any', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Quetta', 'Peshawar', 'Multan'];

  if (!candidateProfile) {
    return (
      <GuardianLayout>
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="font-playfair text-xl mb-3" style={{ color: '#1B3B2D' }}>No candidate linked</p>
          <p className="text-sm" style={{ color: '#6B7280' }}>Your account is not yet linked to a candidate profile.</p>
        </div>
      </GuardianLayout>
    );
  }

  return (
    <GuardianLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#C5A55A' }}>Guardian Panel</p>
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>Edit Candidate Profile</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            You are editing the profile for: <span className="font-medium" style={{ color: '#1B3B2D' }}>{candidateProfile.name}</span>
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <h3 className="font-playfair text-lg mb-5" style={{ color: '#1B3B2D' }}>Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Full Name</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Age</label>
                  <input type="number" value={form.age} onChange={e => update('age', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur} min="18" max="60" />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>City</label>
                  <select value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur}>
                    {cityOptions.filter(c => c !== 'Any').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Profession</label>
                  <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <h3 className="font-playfair text-lg mb-5" style={{ color: '#1B3B2D' }}>About & Values</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>About the Candidate</label>
                  <textarea
                    value={form.aboutMe}
                    onChange={e => update('aboutMe', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={focus as any}
                    onBlur={blur as any}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Religious Values</label>
                  <textarea
                    value={form.religiousValues}
                    onChange={e => update('religiousValues', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={focus as any}
                    onBlur={blur as any}
                  />
                </div>
              </div>
            </div>

            {/* Partner Preferences */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <h3 className="font-playfair text-lg mb-5" style={{ color: '#1B3B2D' }}>Partner Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Min Age</label>
                  <input type="number" value={form.partnerAgeMin} onChange={e => update('partnerAgeMin', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur} min="18" />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Max Age</label>
                  <input type="number" value={form.partnerAgeMax} onChange={e => update('partnerAgeMax', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur} min="18" />
                </div>
                <div>
                  <label className={labelClass} style={{ color: '#374151' }}>Preferred City</label>
                  <select value={form.partnerCity} onChange={e => update('partnerCity', e.target.value)} className={inputClass} style={inputStyle} onFocus={focus} onBlur={blur}>
                    {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              <h3 className="font-playfair text-lg mb-4" style={{ color: '#1B3B2D' }}>Profile Photo</h3>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                  {candidateProfile.photoUrl ? (
                    <img src={candidateProfile.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1B3B2D' }}>
                      <Camera size={22} color="#C5A55A" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <span className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#1B3B2D', color: 'white' }}>
                      <Upload size={14} />
                      Upload New Photo
                    </span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                  <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>Photo will be blurred until connection is accepted.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: '#C5A55A' }}
              >
                <CheckCircle size={15} />
                {saved ? 'Saved!' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </GuardianLayout>
  );
}
