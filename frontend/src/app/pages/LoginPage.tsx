import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle, user, socialUser } = useAuth();
  const navigate = useNavigate();
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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
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
            <h1 className="font-playfair text-3xl mb-1" style={{ color: 'var(--color-primary-900)' }}>Welcome to Rishtafy</h1>
            <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>Sign in to find your perfect match</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-10" style={{ borderColor: 'var(--color-neutral-100)' }}>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-6 text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border font-semibold text-base transition-all hover:bg-gray-50 disabled:opacity-60 shadow-sm"
              style={{ borderColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-900)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs mt-8 leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
              By signing in, you agree to our <br />
              <span className="font-medium" style={{ color: 'var(--color-primary-900)' }}>Terms of Service</span> and <span className="font-medium" style={{ color: 'var(--color-primary-900)' }}>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}