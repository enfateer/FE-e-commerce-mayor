import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminReports } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiUsers, HiCube, HiShoppingBag, HiTrendingUp, HiChartBar, HiShieldCheck } from 'react-icons/hi';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminReports()
      .then(res => setReports(res.data?.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const stats = [
    { label: 'Total Users', value: reports?.totalUsers || 0, icon: HiUsers, color: 'from-primary-500 to-primary-600' },
    { label: 'Total Sellers', value: reports?.totalSellers || 0, icon: HiChartBar, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Services', value: reports?.totalServices || 0, icon: HiCube, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Orders', value: reports?.totalOrders || 0, icon: HiShoppingBag, color: 'from-orange-500 to-red-500' },
    { label: 'Completed Orders', value: reports?.completedOrders || 0, icon: HiTrendingUp, color: 'from-teal-500 to-green-500' },
    { label: 'Pending Orders', value: reports?.pendingOrders || 0, icon: HiShoppingBag, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Platform Reports</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Overview of platform-wide statistics.</p>
      </div>

      {(reports?.totalBuyers || 0) > 0 && (
        <div className="mb-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Program Become Seller</p>
              <h2 className="text-xl font-bold mb-2">
                {reports.totalBuyers} buyer belum menjadi seller
              </h2>
              <p className="text-primary-100 text-sm max-w-xl">
                Promosikan fitur Become Seller di halaman profil agar lebih banyak user menawarkan layanan di ORVIX.
              </p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors shrink-0"
            >
              <HiShieldCheck className="w-5 h-5 mr-2" />
              Kelola Users
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 card-hover">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg mb-4`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Order Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: 'Pending', value: reports?.pendingOrders || 0, color: 'bg-yellow-500' },
              { label: 'In Progress', value: reports?.inProgressOrders || 0, color: 'bg-blue-500' },
              { label: 'Completed', value: reports?.completedOrders || 0, color: 'bg-green-500' },
              { label: 'Cancelled', value: reports?.cancelledOrders || 0, color: 'bg-red-500' },
            ].map((item, i) => {
              const total = reports?.totalOrders || 1;
              const pct = Math.round((item.value / total) * 100) || 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-600 dark:text-surface-300">{item.label}</span>
                    <span className="font-medium text-surface-800 dark:text-white">{item.value} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <p className="text-sm text-surface-500 dark:text-surface-400">Banned Users</p>
              <p className="text-2xl font-bold text-red-500">{reports?.bannedUsers || 0}</p>
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <p className="text-sm text-surface-500 dark:text-surface-400">Warned Users</p>
              <p className="text-2xl font-bold text-amber-500">{reports?.warnedUsers || 0}</p>
            </div>
            <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
              <p className="text-sm text-surface-500 dark:text-surface-400">Active Services</p>
              <p className="text-2xl font-bold text-primary-500">{reports?.totalServices || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
