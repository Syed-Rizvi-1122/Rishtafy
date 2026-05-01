import { useState } from 'react';
import { CheckCircle, Upload, User, BookOpen, MessageSquare, Camera, Heart } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { useAuth } from '../../context/AuthContext';
import { getProfileByUserId } from '../../lib/mockData';

const sections = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'education', label: 'Education & Career', icon: BookOpen },
  { id: 'about', label: 'About Me', icon: MessageSquare },
  { id: 'photo', label: 'Profile Photo', icon: Camera },
  { id: 'preferences', label: 'Partner Preferences', icon: Heart },
];

export default function ProfileEdit() {
  const { user } = useAuth();
  const existingProfile = user ? getProfileByUserId(user.id) : null;
  const [activeSection, setActiveSection] = useState('basic');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: existingProfile?.name || user?.name || '',
    age: existingProfile?.age?.toString() || '',
    gender: existingProfile?.gender || 'male',
    city: existingProfile?.city || '',
    education: existingProfile?.education || '',
    profession: existingProfile?.profession || '',
    religiousValues: existingProfile?.religiousValues || '',
    aboutMe: existingProfile?.aboutMe || '',
    partnerAgeMin: existingProfile?.partnerAgeMin?.toString() || '22',
    partnerAgeMax: existingProfile?.partnerAgeMax?.toString() || '30',
    partnerCity: existingProfile?.partnerCity || 'Any',
    partnerEducation: existingProfile?.partnerEducation || 'Any',
  });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(`http://127.0.0.1:3001/api/profiles/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save profile.');
      }
    } catch (err) {
      alert('Could not connect to server.');
    }
  };

  const labelClass = "block text-sm mb-1.5 font-medium";
  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all";
  const inputStyle = { borderColor: '#E5E1D8', backgroundColor: 'white' };
  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#1B3B2D';
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => e.target.style.borderColor = '#E5E1D8';

  const cityOptions = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Quetta', 'Peshawar', 'Multan', 'Any'];
  const educationOptions = ["Matriculation", "Intermediate", "Bachelor's", "Master's", "PhD", "MBBS", "PharmD", "Any"];

  // Compute completion
  const fields = [form.name, form.age, form.city, form.education, form.profession, form.aboutMe, form.religiousValues];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <div className="space-y-5">
            <h3 className="font-playfair text-lg" style={{ color: '#1B3B2D' }}>Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={{ color: '#374151' }}>Full Name *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="age" className={labelClass} style={{ color: '#374151' }}>Age *</label>
                <input id="age" type="number" value={form.age} onChange={e => update('age', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} placeholder="Your age" min="18" max="60" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className={labelClass} style={{ color: '#374151' }}>Gender *</label>
                <select id="gender" value={form.gender} onChange={e => update('gender', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="city" className={labelClass} style={{ color: '#374151' }}>City *</label>
                <select id="city" value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}>
                  <option value="">Select city</option>
                  {cityOptions.filter(c => c !== 'Any').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-5">
            <h3 className="font-playfair text-lg" style={{ color: '#1B3B2D' }}>Education & Career</h3>
            <div>
              <label className={labelClass} style={{ color: '#374151' }}>Highest Education *</label>
              <select value={form.education} onChange={e => update('education', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}>
                <option value="">Select education level</option>
                {educationOptions.filter(e => e !== 'Any').map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#374151' }}>Profession / Occupation *</label>
              <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} placeholder="e.g. Software Engineer, Doctor" />
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-5">
            <h3 className="font-playfair text-lg" style={{ color: '#1B3B2D' }}>About Me</h3>
            <div>
              <label className={labelClass} style={{ color: '#374151' }}>About Yourself *</label>
              <textarea
                value={form.aboutMe}
                onChange={e => update('aboutMe', e.target.value)}
                rows={5}
                placeholder="Write a brief introduction about yourself, your personality, your family background and what you're looking for..."
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none"
                style={inputStyle}
                onFocus={focusHandler as any}
                onBlur={blurHandler as any}
              />
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{form.aboutMe.length}/500 characters</p>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#374151' }}>Religious Values *</label>
              <textarea
                value={form.religiousValues}
                onChange={e => update('religiousValues', e.target.value)}
                rows={3}
                placeholder="Describe your Islamic practice level, values, and what you look for in a partner religiously..."
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none"
                style={inputStyle}
                onFocus={focusHandler as any}
                onBlur={blurHandler as any}
              />
            </div>
          </div>
        );
      case 'photo':
        return (
          <div className="space-y-5">
            <h3 className="font-playfair text-lg" style={{ color: '#1B3B2D' }}>Profile Photo</h3>
            <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: 'rgba(197,165,90,0.08)', color: '#92400E', border: '1px solid rgba(197,165,90,0.3)' }}>
              🔒 Your photo will be blurred for all users until a mutual connection is accepted. This protects your privacy.
            </div>
            <div
              className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors hover:border-opacity-80"
              style={{ borderColor: '#E5E1D8' }}
            >
              {existingProfile?.photoUrl ? (
                <div className="space-y-3">
                  <img src={existingProfile.photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover mx-auto border-4" style={{ borderColor: '#E5E1D8' }} />
                  <p className="text-sm" style={{ color: '#6B7280' }}>Photo uploaded</p>
                  <label className="cursor-pointer">
                    <span className="text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#1B3B2D', color: 'white' }}>
                      <Upload size={14} /> Change Photo
                    </span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#F3F4F6' }}>
                    <Camera size={24} color="#9CA3AF" />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#374151' }}>Upload your photo</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>PNG, JPG up to 5MB. Will be blurred until connected.</p>
                  <label className="cursor-pointer">
                    <span className="text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2" style={{ backgroundColor: '#1B3B2D', color: 'white' }}>
                      <Upload size={14} /> Choose Photo
                    </span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-5">
            <h3 className="font-playfair text-lg" style={{ color: '#1B3B2D' }}>Partner Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={{ color: '#374151' }}>Partner Age Min</label>
                <input type="number" value={form.partnerAgeMin} onChange={e => update('partnerAgeMin', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} min="18" max="60" />
              </div>
              <div>
                <label className={labelClass} style={{ color: '#374151' }}>Partner Age Max</label>
                <input type="number" value={form.partnerAgeMax} onChange={e => update('partnerAgeMax', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} min="18" max="70" />
              </div>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#374151' }}>Preferred City</label>
              <select value={form.partnerCity} onChange={e => update('partnerCity', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}>
                {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#374151' }}>Preferred Education</label>
              <select value={form.partnerEducation} onChange={e => update('partnerEducation', e.target.value)} className={inputClass} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}>
                {educationOptions.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl mb-1" style={{ color: '#1B3B2D' }}>Edit Profile</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>Complete your profile to attract better matches.</p>
        </div>

        {/* Completion bar */}
        <div className="bg-white rounded-xl border p-4 mb-6 flex items-center gap-4 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium" style={{ color: '#374151' }}>Profile Completion</span>
              <span className="text-sm font-semibold" style={{ color: '#C5A55A' }}>{completion}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completion}%`, backgroundColor: '#C5A55A' }} />
            </div>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 text-sm" style={{ color: '#16A34A' }}>
              <CheckCircle size={16} />
              Saved!
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Section nav */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border p-3 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all mb-1"
                  style={activeSection === id
                    ? { backgroundColor: '#1B3B2D', color: '#C5A55A' }
                    : { color: '#6B7280' }
                  }
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Section content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave}>
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: '#E5E1D8' }}>
                {renderSection()}
                <div className="flex justify-end mt-6 pt-5 border-t" style={{ borderColor: '#E5E1D8' }}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: '#C5A55A' }}
                  >
                    <CheckCircle size={15} />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
