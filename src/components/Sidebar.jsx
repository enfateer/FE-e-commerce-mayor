import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiChartPie, HiCollection, HiUsers,
  HiDocumentReport, HiCog, HiShieldCheck, HiX,
  HiShoppingBag, HiCube, HiBell
} from 'react-icons/hi';

const SidebarComponent = ({ isOpen, onClose }) => {
  const { isSeller, isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
    }`;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 z-40 w-72 h-screen pt-20 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-2 lg:hidden">
          <span className="font-semibold text-surface-800 dark:text-white">Menu</span>
          <button onClick={onClose} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-1 overflow-y-auto h-full pb-24">
          {/* Seller Menu */}
          {isSeller && (
            <div className="mb-6">
              <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">Seller</p>
              <NavLink to="/seller/dashboard" className={linkClass} onClick={onClose}>
                <HiChartPie className="w-5 h-5" /> Dashboard
              </NavLink>
              <NavLink to="/seller/services" className={linkClass} onClick={onClose}>
                <HiCube className="w-5 h-5" /> My Services
              </NavLink>
            </div>
          )}

          {/* Admin Menu */}
          {isAdmin && (
            <div className="mb-6">
              <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">Admin</p>
              <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
                <HiUsers className="w-5 h-5" /> Users
              </NavLink>
              <NavLink to="/admin/sellers" className={linkClass} onClick={onClose}>
                <HiShieldCheck className="w-5 h-5" /> Sellers
              </NavLink>
              <NavLink to="/admin/reports" className={linkClass} onClick={onClose}>
                <HiDocumentReport className="w-5 h-5" /> Reports
              </NavLink>
              <NavLink to="/admin/notifications" className={linkClass} onClick={onClose}>
                <HiBell className="w-5 h-5" /> Notifications
              </NavLink>
              <NavLink to="/admin/services" className={linkClass} onClick={onClose}>
                <HiCube className="w-5 h-5" /> Services
              </NavLink>
            </div>
          )}

          {/* General */}
          <div>
            <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">General</p>
            <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
              <HiChartPie className="w-5 h-5" /> Overview
            </NavLink>
            <NavLink to="/orders" className={linkClass} onClick={onClose}>
              <HiShoppingBag className="w-5 h-5" /> My Orders
            </NavLink>
            <NavLink to="/notifications" className={linkClass} onClick={onClose}>
              <HiCollection className="w-5 h-5" /> Notifications
            </NavLink>
            <NavLink to="/profile" className={linkClass} onClick={onClose}>
              <HiCog className="w-5 h-5" /> Profile
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;
