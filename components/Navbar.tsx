
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME, APP_ROUTES } from '../constants';
import { LogOut, UserCircle, LayoutDashboard, BookOpenCheck, MessageSquare, Edit3, Settings, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.HOME);
  };

  return (
    <nav className="bg-brand-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to={user ? APP_ROUTES.DASHBOARD : APP_ROUTES.HOME} className="flex-shrink-0 text-2xl font-bold text-brand-light-blue hover:text-white transition-colors">
              {APP_NAME}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user ? (
                <>
                  <NavLink to={APP_ROUTES.DASHBOARD} icon={<LayoutDashboard size={18}/>} text="Dashboard" />
                  <NavLink to={APP_ROUTES.CURRICULUM_SELECT} icon={<BookOpenCheck size={18}/>} text="Curriculum" />
                  <NavLink to={APP_ROUTES.TUTOR} icon={<MessageSquare size={18}/>} text="AI Tutor" />
                  <NavLink to={APP_ROUTES.ASSESSMENT} icon={<Edit3 size={18}/>} text="Assessments" />
                  <NavLink to={APP_ROUTES.PROFILE} icon={<UserCircle size={18}/>} text="Profile" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-brand-slate-medium hover:bg-brand-slate-dark hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to={APP_ROUTES.HOME} text="Home" />
                  {/* <NavLink to="/features" text="Features" />
                  <NavLink to="/pricing" text="Pricing" /> */}
                  <NavLink to={APP_ROUTES.AUTH} text="Login / Sign Up" className="bg-brand-light-blue text-brand-navy hover:bg-opacity-80" />
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            {/* Mobile menu button can be added here if needed */}
            {user && (
               <button
                onClick={handleLogout}
                className="text-brand-slate-medium hover:text-white p-2 rounded-md text-sm font-medium transition-colors"
                aria-label="Logout"
              >
                <LogOut size={24} />
              </button>
            )}
             {!user && (
                <Link to={APP_ROUTES.AUTH} className="text-brand-slate-medium hover:text-white bg-brand-light-blue text-brand-navy px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, text, icon, className }) => (
  <Link
    to={to}
    className={`flex items-center text-brand-slate-medium hover:bg-brand-slate-dark hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${className || ''}`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {text}
  </Link>
);


export default Navbar;
