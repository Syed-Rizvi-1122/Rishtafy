import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Star, Menu, X } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate('/login', { replace: true });
      else if (user.role === 'candidate') navigate('/dashboard', { replace: true });
      else if (user.role === 'guardian') navigate('/guardian/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#1B3B2D', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: Users, label: 'Manage Users', to: '/admin/users' },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
        style={{ backgroundColor: '#1B3B2D' }}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Star size={16} fill="#C5A55A" color="#C5A55A" />
            <span className="font-playfair text-white text-lg">Rishtafy</span>
          </div>
          <p className="text-xs mt-0.5 tracking-widest uppercase" style={{ color: '#C5A55A' }}>Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm no-underline transition-colors ${
                isActive(to) ? 'text-white' : 'text-white/65 hover:text-white hover:bg-white/10'
              }`}
              style={isActive(to) ? { backgroundColor: 'rgba(197,165,90,0.2)', color: '#C5A55A' } : {}}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#C5A55A', color: '#1B3B2D' }}>
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm truncate">{user.name}</p>
              <p className="text-white/40 text-xs">Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/60 hover:text-red-300 transition-colors w-full">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 shadow-sm" style={{ backgroundColor: '#1B3B2D' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu size={20} />
          </button>
          <Star size={14} fill="#C5A55A" color="#C5A55A" />
          <span className="font-playfair text-white">Rishtafy Admin</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
