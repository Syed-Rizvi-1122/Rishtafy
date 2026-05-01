import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Star, CheckCircle, Mail, User } from 'lucide-react';
import { useAuth, supabase } from '../context/AuthContext';
import { Role } from '../types';

export default function OnboardingPage() {
  const { user: existingUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('candidate');
  const [name, setName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supabaseUser, setSupabaseUser] = useState<any>(null);

  useEffect(() => {
    // If user already has a role, they shouldn't be here
    if (existingUser?.role) {
      if (existingUser.role === 'candidate') navigate('/dashboard', { replace: true });
      else if (existingUser.role === 'guardian') navigate('/guardian/dashboard', { replace: true });
      return;
    }

    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      setSupabaseUser(session.user);
      setName(session.user.user_metadata.full_name || '');
    }
    getSession();
  }, [existingUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:3001/api/auth/oauth-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: supabaseUser.id,
          email: supabaseUser.email,
          full_name: name,
          role,
          candidateEmail: role === 'guardian' ? candidateEmail : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('rishtafy_user', JSON.stringify(data.user));
        updateProfile();
        if (role === 'candidate') navigate('/profile/edit');
        else navigate('/guardian/dashboard');
      } else {
        setError(data.error || 'Failed to complete profile');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!supabaseUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="h-14 bg-primary-900 flex items-center px-6">
        <div className="flex items-center gap-2">
          <Star size={16} fill="var(--color-accent-500)" color="var(--color-accent-500)" />
          <span className="font-playfair text-white text-lg">Rishtafy</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl mb-1 text-primary-900">Complete Your Profile</h1>
            <p className="text-sm text-neutral-400">Just one more step to join Rishtafy</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-sm mb-3 text-neutral-700 font-medium">I am a:</p>
                <div className="grid grid-cols-2 gap-3">
                  {(['candidate', 'guardian'] as Role[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                        role === r 
                        ? 'border-primary-900 bg-primary-50 text-primary-900' 
                        : 'border-neutral-100 text-neutral-400 hover:border-neutral-200'
                      }`}
                    >
                      {role === r && <CheckCircle size={14} />}
                      {r === 'candidate' ? '🧑 Candidate' : '👩‍👧 Guardian'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1.5 text-neutral-700">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-100 bg-neutral-50 text-sm outline-none focus:border-primary-900 transition-all"
                    />
                  </div>
                </div>

                {role === 'guardian' && (
                  <div>
                    <label className="block text-sm mb-1.5 text-neutral-700">Candidate's Email (to link)</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        value={candidateEmail}
                        onChange={e => setCandidateEmail(e.target.value)}
                        required
                        placeholder="candidate@email.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-100 bg-neutral-50 text-sm outline-none focus:border-primary-900 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-accent-500 text-white font-medium text-sm transition-all hover:opacity-90 disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Finish Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
