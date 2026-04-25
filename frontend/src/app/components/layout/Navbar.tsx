import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Menu, X, ChevronDown, User, LogOut, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type NavVariant = 'candidate' | 'guardian' | 'admin';

interface NavLink {
  label: string;
  to: string;
}

const navLinks: Record<NavVariant, NavLink[]> = {
  candidate: [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Find Matches', to: '/search' },
    { label: 'Requests', to: '/requests' },
    { label: 'Connections', to: '/connections' },
  ],
  guardian: [
    { label: 'Dashboard', to: '/guardian/dashboard' },
    { label: 'Edit Profile', to: '/guardian/profile/edit' },
    { label: 'Requests', to: '/guardian/requests' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Users', to: '/admin/users' },
  ],
};

export function Navbar({ variant }: { variant: NavVariant }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links = navLinks[variant];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{ backgroundColor: '#1B3B2D' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={variant === 'admin' ? '/admin/dashboard' : variant === 'guardian' ? '/guardian/dashboard' : '/dashboard'} className="flex items-center gap-2 no-underline">
            <div className="flex items-center gap-1.5">
              <Star size={18} fill="#C5A55A" color="#C5A55A" />
              <span className="font-playfair text-white text-xl tracking-wide">Rishtafy</span>
            </div>
            {variant === 'guardian' && (
              <span style={{ color: '#C5A55A' }} className="text-xs tracking-widest uppercase hidden sm:block ml-1">Guardian</span>
            )}
            {variant === 'admin' && (
              <span style={{ color: '#C5A55A' }} className="text-xs tracking-widest uppercase hidden sm:block ml-1">Admin</span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-md text-sm transition-colors no-underline ${
                  isActive(link.to)
                    ? 'text-white font-medium'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
                style={isActive(link.to) ? { backgroundColor: 'rgba(197,165,90,0.2)', color: '#C5A55A' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: 'var(--color-accent-500)', color: 'var(--color-primary-900)' }}>
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="text-sm max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  {variant === 'candidate' && (
                    <Link to="/profile/edit" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline" onClick={() => setUserMenuOpen(false)}>
                      <User size={14} />
                      Edit Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-white p-1"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 py-2">
          <div className="px-4 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm no-underline ${
                  isActive(link.to) ? 'text-white font-medium' : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
                style={isActive(link.to) ? { backgroundColor: 'rgba(197,165,90,0.2)', color: '#C5A55A' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2">
              <div className="px-3 py-2 text-white/60 text-xs">{user?.name}</div>
              {variant === 'candidate' && (
                <Link to="/profile/edit" className="block px-3 py-2.5 text-sm text-white/75 hover:text-white no-underline" onClick={() => setMobileOpen(false)}>
                  Edit Profile
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-red-300 hover:text-red-200">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
}
