import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useTheme } from '../contexts/useTheme';
import SearchSidebar from './SearchSidebar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-light-card dark:bg-dark-card shadow-sm border-b border-light-border dark:border-dark-border relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1
            onClick={() => navigate('/')}
            className="font-pixel text-sm text-primary cursor-pointer hover:text-primary-hover transition"
          >
            CourseSphere
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center rounded-lg hover:bg-[#F1f5F9] dark:hover:bg-[#1E293B] transition"
              title="Search courses"
            >
              <img src="/search-icon.png" alt="Search" className="w-7 h-7" />
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center relative group rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition"
            >
              {isDark ? (
                <img src="/sun-icon.png" alt="Light mode" className="w-7 h-7 relative top-[1px]" />
              ) : (
                <img src="/moon-icon.png" alt="Dark mode" className="w-7 h-7 relative top-[4px]" />
              )}
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none ${
                    isDark
                      ? 'bg-white text-black border border-gray-200'
                      : 'bg-[#020516] text-[#DBDDE3] border border-gray-700'
                  }`}>
                    Alterar Tema
                </div>
            </button>
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Hello, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-danger hover:text-danger-hover transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}