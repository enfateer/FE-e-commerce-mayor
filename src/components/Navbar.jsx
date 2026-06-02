import { Link, useNavigate } from 'react-router-dom';



import { useAuth } from '../context/AuthContext';
import { HiBell, HiMenu, HiX, HiSearch } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { getNotifications } from '../api/notifications';
import { getProfilePictureUrl } from '../utils/media';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getNotifications()
        .then(res => {
          const notifs = res.data?.data || res.data || [];
          const unread = Array.isArray(notifs) ? notifs.filter(n => !n.isRead).length : 0;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const profilePic = getProfilePictureUrl(user?.profilePicture);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl shadow-lg shadow-surface-900/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-black text-sm">O</span>
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white">
              ORV<span className="gradient-text">IX</span>
            </span>
          </Link>

          {/* desktop navbar */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
              Home
            </Link>
            <Link to="/services" className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
              Services
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                Orders
              </Link>
            )}
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block" />


            {isAuthenticated ? (
              <>
                {/* notifications */}
                <Link to="/notifications" className="relative p-2.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
                  <HiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown (custom, avoid flowbite runtime undefined) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 transition-colors"
                  >
                    {profilePic ? (
                      <img src={profilePic} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-400 text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {mobileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                        <div className="text-sm font-semibold text-surface-900 dark:text-white">{user?.name}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-300 truncate">{user?.email}</div>
                      </div>

                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate('/dashboard');
                        }}
                      >
                        Dashboard
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800"
                        onClick={() => {
                          setMobileOpen(false);
                          navigate('/profile');
                        }}
                      >
                        Profile
                      </button>
                      {isSeller && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800"
                          onClick={() => {
                            setMobileOpen(false);
                            navigate('/seller/dashboard');
                          }}
                        >
                          Seller Panel
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-surface-50 dark:hover:bg-surface-800"
                          onClick={() => {
                            setMobileOpen(false);
                            navigate('/admin/users');
                          }}
                        >
                          Admin Panel
                        </button>
                      )}

                      <div className="border-t border-surface-200 dark:border-surface-700" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={async () => {
                          setMobileOpen(false);
                          await handleLogout();
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-200 dark:border-surface-700 py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">Home</Link>
              <Link to="/services" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">Services</Link>
              {isAuthenticated && (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">Orders</Link>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-surface-700 dark:text-surface-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg">Dashboard</Link>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-3 px-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-medium border border-surface-200 dark:border-surface-600 rounded-xl text-surface-700 dark:text-surface-200">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
