import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../api/orders';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { getOrderService, getOrderPackage, getOrderPrice } from '../utils/order';
import PageMeta from '../components/PageMeta';
import { HiShoppingBag, HiCurrencyDollar, HiClock, HiCheckCircle, HiArrowRight, HiUser } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentOrders = orders.slice(0, 5);
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    inProgress: orders.filter(o => ['accepted', 'in_progress', 'delivered'].includes(o.status)).length,
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <PageMeta title="Dashboard" />
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Welcome back, <span className="gradient-text">{user?.name || 'User'}</span> 
        </h1>
        <p className="text-surface-500 dark:text-surface-400">Here's an overview of your recent activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: stats.total, icon: HiShoppingBag, color: 'from-primary-500 to-primary-600' },
          { label: 'Pending', value: stats.pending, icon: HiClock, color: 'from-yellow-500 to-orange-500' },
          { label: 'In Progress', value: stats.inProgress, icon: HiCurrencyDollar, color: 'from-blue-500 to-cyan-500' },
          { label: 'Completed', value: stats.completed, icon: HiCheckCircle, color: 'from-green-500 to-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/services" className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl flex items-center gap-3 hover:shadow-lg transition-all">
          <HiShoppingBag className="w-8 h-8 text-primary-500" />
          <div>
            <p className="font-semibold text-surface-900 dark:text-white">Browse Services</p>
            <p className="text-xs text-surface-500">Find new services</p>
          </div>
        </Link>
        <Link to="/orders" className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center gap-3 hover:shadow-lg transition-all">
          <HiClock className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-semibold text-surface-900 dark:text-white">View Orders</p>
            <p className="text-xs text-surface-500">Track your orders</p>
          </div>
        </Link>
        <Link to="/profile" className="p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-2xl flex items-center gap-3 hover:shadow-lg transition-all">
          <HiUser className="w-8 h-8 text-accent-500" />
          <div>
            <p className="font-semibold text-surface-900 dark:text-white">My Profile</p>
            <p className="text-xs text-surface-500">Manage your account</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recent Orders</h2>
          <Link to="/orders" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            View all <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {recentOrders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <div>
                  <p className="font-medium text-surface-800 dark:text-white">{getOrderService(order)?.title || `Order #${order.id}`}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {getOrderPackage(order)?.name || '-'}
                    {getOrderPrice(order) > 0 && (
                      <span className="ml-2 font-semibold text-primary-600 dark:text-primary-400">
                        · {`Rp ${getOrderPrice(order).toLocaleString('id-ID')}`}
                      </span>
                    )}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-surface-500 dark:text-surface-400">
            No orders yet.{' '}
            <Link to="/services" className="text-primary-500 hover:underline">Browse services</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
