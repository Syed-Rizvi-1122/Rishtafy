import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const { checkOAuthSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const user = await checkOAuthSession();
      if (user) {
        // User exists and has a role, go to dashboard
        if (user.role === 'candidate') navigate('/dashboard', { replace: true });
        else if (user.role === 'guardian') navigate('/guardian/dashboard', { replace: true });
        else navigate('/admin/dashboard', { replace: true });
      } else {
        // New user or sync failed, go to onboarding to select role
        navigate('/onboarding', { replace: true });
      }
    }
    handleCallback();
  }, [checkOAuthSession, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto mb-4"></div>
        <p className="text-neutral-600">Completing sign in...</p>
      </div>
    </div>
  );
}
