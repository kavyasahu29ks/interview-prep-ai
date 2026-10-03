import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workspaces/new', label: 'New Workspace' },
  { to: '/profile', label: 'Profile' }
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            InterviewPrepAI
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white')}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 md:block">
              {user?.name || 'User'}
            </span>
            <button className="button-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
};

export default Layout;
