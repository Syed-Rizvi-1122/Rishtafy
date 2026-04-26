import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, signInWithGoogle, user, socialUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in or needs to finish social registration
  useEffect(() => {
    if (user) {
      if (user.role === 'candidate') navigate('/dashboard', { replace: true });
      else if (user.role === 'guardian') navigate('/guardian/dashboard', { replace: true });
      else navigate('/admin/dashboard', { replace: true });
    } else if (socialUser) {
      // First time social login - redirect to register to pick role/name
      navigate('/register', { replace: true });
    }
  }, [user, socialUser, navigate]);

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

  const handleGoogleSignIn = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || 'Google sign in failed.');
    }
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--color-neutral-100)' }}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition-all hover:bg-gray-50 disabled:opacity-60"
              style={{ borderColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-900)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

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