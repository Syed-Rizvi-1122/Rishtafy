import { createBrowserRouter } from 'react-router';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import AuthCallback from './pages/AuthCallback';

// Candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfileEdit from './pages/candidate/ProfileEdit';
import Search from './pages/candidate/Search';
import ProfileView from './pages/candidate/ProfileView';
import Requests from './pages/candidate/Requests';
import Connections from './pages/candidate/Connections';
import Chat from './pages/candidate/Chat';

// Guardian pages
import GuardianDashboard from './pages/guardian/Dashboard';
import GuardianProfileEdit from './pages/guardian/ProfileEdit';
import GuardianRequests from './pages/guardian/Requests';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="text-center">
        <p className="font-playfair text-6xl mb-4" style={{ color: '#1B3B2D' }}>404</p>
        <p className="text-xl font-playfair mb-2" style={{ color: '#1B3B2D' }}>Page Not Found</p>
        <p className="text-sm mb-6" style={{ color: '#6B7280' }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="px-5 py-2.5 rounded-xl text-white text-sm no-underline" style={{ backgroundColor: '#1B3B2D' }}>
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  // Public routes
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/onboarding', Component: OnboardingPage },
  { path: '/auth/callback', Component: AuthCallback },

  // Candidate routes (layout embedded in each component)
  { path: '/dashboard', Component: CandidateDashboard },
  { path: '/profile/edit', Component: CandidateProfileEdit },
  { path: '/search', Component: Search },
  { path: '/profile/:userId', Component: ProfileView },
  { path: '/requests', Component: Requests },
  { path: '/connections', Component: Connections },
  { path: '/chat/:connectionId', Component: Chat },

  // Guardian routes
  { path: '/guardian/dashboard', Component: GuardianDashboard },
  { path: '/guardian/profile/edit', Component: GuardianProfileEdit },
  { path: '/guardian/requests', Component: GuardianRequests },

  // Admin routes
  { path: '/admin/dashboard', Component: AdminDashboard },
  { path: '/admin/users', Component: AdminUsers },

  { path: '*', Component: NotFound },
]);
