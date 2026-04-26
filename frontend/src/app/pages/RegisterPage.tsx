import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User, Eye, EyeOff, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export default function RegisterPage() {
  const { register, socialUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: socialUser?.user_metadata?.full_name || '', 
    email: socialUser?.email || '', 
    password: '', 
    confirmPassword: '', 
    candidateEmail: '' 
  });
  const [role, setRole] = useState<Role>('candidate');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill if socialUser changes (e.g., after redirect)
  useEffect(() => {
    if (socialUser) {
      setForm(f => ({
        ...f,
        name: socialUser.user_metadata?.full_name || f.name,
        email: socialUser.email || f.email
      }));
    }
  }, [socialUser]);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Only validate passwords for non-social registration
    if (!socialUser) {
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
      if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    }

    setLoading(true);
    const result = await register(
      form.name, 
      form.email, 
      socialUser ? null : form.password, 
      role, 
      form.candidateEmail
    );
    setLoading(false);
    
    if (result.success) {
      if (role === 'candidate') navigate('/profile/edit');
      else navigate('/guardian/dashboard');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all";
  const inputStyle = { borderColor: 'var(--color-neutral-100)', backgroundColor: '#FAFAFA' };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <header style={{ backgroundColor: 'var(--color-primary-900)' }} className="h-14 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <Star size={16} fill="var(--color-accent-500)" color="var(--color-accent-500)" />
          <span className="font-playfair text-white text-lg">Rishtafy</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-primary-900)' }}>
              <Star size={22} fill="var(--color-accent-500)" color="var(--color-accent-500)" />
            </div>
            <h1 className="font-playfair text-3xl mb-1" style={{ color: 'var(--color-primary-900)' }}>
              {socialUser ? 'Complete Your Profile' : 'Create Account'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>
              {socialUser 
                ? 'Just one more step to join the community' 
                : 'Join Rishtafy to find your perfect match'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-neutral-100)' }}>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Role Selector */}
            <div className="mb-6">
              <p className="text-sm mb-2" style={{ color: '#374151' }}>I am registering as:</p>
              <div className="grid grid-cols-2 gap-3">
                {(['candidate', 'guardian'] as Role[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all"
                    style={role === r
                      ? { borderColor: 'var(--color-primary-900)', backgroundColor: 'rgba(27,59,45,0.06)', color: 'var(--color-primary-900)' }
                      : { borderColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-400)' }
                    }
                  >
                    {role === r && <CheckCircle size={14} color="var(--color-primary-900)" />}
                    {r === 'candidate' ? '🧑 Candidate' : '👩‍👧 Guardian'}
                  </button>
                ))}
              </div>
              {role === 'guardian' && (
                <div className="mt-3 p-3 rounded-lg text-xs" style={{ backgroundColor: 'rgba(197,165,90,0.1)', color: '#92400E' }}>
                  As a guardian, you will manage your candidate's profile and review incoming interest requests on their behalf.
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#374151' }}>Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                    placeholder="Your full name"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#374151' }}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    required
                    readOnly={!!socialUser}
                    placeholder="your@email.com"
                    className={inputClass}
                    style={{ ...inputStyle, opacity: socialUser ? 0.7 : 1 }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                  />
                </div>
              </div>
              {role === 'guardian' && (
                <div>
                  <label className="block text-sm mb-1.5" style={{ color: '#374151' }}>Candidate's Email (to link)</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                    <input
                      type="email"
                      value={form.candidateEmail}
                      onChange={e => update('candidateEmail', e.target.value)}
                      required={role === 'guardian'}
                      placeholder="candidate@email.com"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                    />
                  </div>
                </div>
              )}
              
              {!socialUser && (
                <>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#374151' }}>Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={form.password}
                        onChange={e => update('password', e.target.value)}
                        required
                        placeholder="Min. 8 characters"
                        className={`${inputClass} pr-10`}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                      />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }}>
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1.5" style={{ color: '#374151' }}>Confirm Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={e => update('confirmPassword', e.target.value)}
                        required
                        placeholder="Re-enter password"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                style={{ backgroundColor: 'var(--color-accent-500)' }}
              >
                {loading 
                  ? (socialUser ? 'Completing Profile...' : 'Creating Account...') 
                  : (socialUser ? 'Complete Registration' : 'Create Account')}
              </button>
            </form>


            <p className="text-center text-sm mt-5" style={{ color: 'var(--color-neutral-400)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-medium no-underline" style={{ color: 'var(--color-accent-500)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
