import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import SidebarComponent from '../components/Sidebar';
import { HiMenuAlt2 } from 'react-icons/hi';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Navbar />
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 left-6 z-30 lg:hidden w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all"
      >
        <HiMenuAlt2 className="w-6 h-6" />
      </button>

      <main className="lg:ml-72 pt-20 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
