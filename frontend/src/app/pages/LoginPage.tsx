import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'candidate') navigate('/dashboard', { replace: true });
      else if (user.role === 'guardian') navigate('/guardian/dashboard', { replace: true });
      else navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed.');
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setLoading(true);
    const result = await login(demoEmail, 'password123');
    setLoading(false);
    if (!result.success) setError(result.error || 'Login failed.');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      {/* Top Bar */}
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
            <h1 className="font-playfair text-3xl mb-1" style={{ color: 'var(--color-primary-900)' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>Sign in to your Rishtafy account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8" style={{ borderColor: 'var(--color-neutral-100)' }}>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--color-neutral-900)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-neutral-400)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
                    style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: '#FAFAFA' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--color-neutral-900)' }}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-neutral-400)' }} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm outline-none transition-all"
                    style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: '#FAFAFA' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary-900)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-neutral-100)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-neutral-400)' }}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-primary-900)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--color-neutral-400)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-medium no-underline" style={{ color: 'var(--color-accent-500)' }}>
                Register here
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 bg-white rounded-2xl border p-5" style={{ borderColor: 'var(--color-neutral-100)' }}>
            <p className="text-xs font-medium mb-3 text-center tracking-wider uppercase" style={{ color: 'var(--color-neutral-400)' }}>Quick Demo Access</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: '🧑 Candidate (Farhan)', email: 'candidate@demo.com', role: 'Candidate view' },
                { label: '👩 Candidate (Amna)', email: 'female@demo.com', role: 'Female candidate' },
                { label: '👩‍👧 Guardian (Mrs. Nadia)', email: 'guardian@demo.com', role: 'Guardian view' },
                { label: '🛡️ Admin', email: 'admin@demo.com', role: 'Admin panel' },
              ].map(({ label, email: demoEmail, role }) => (
                <button
                  key={demoEmail}
                  onClick={() => quickLogin(demoEmail)}
                  disabled={loading}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all hover:border-opacity-60 text-sm disabled:opacity-50"
                  style={{ borderColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-900)' }}
                >
                  <span>{label}</span>
                  <span className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{role}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--color-neutral-400)' }}>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}