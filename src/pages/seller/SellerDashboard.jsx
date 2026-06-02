import { useState, useEffect } from 'react';
import { getSellerDashboard } from '../../api/sellers';
import { getOrders } from '../../api/orders';
import { exportSellerOrdersExcel } from '../../api/exports';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { getOrderService, formatOrderPrice } from '../../utils/order';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { downloadBlobFromResponse, getExportErrorMessage } from '../../utils/download';
import PageMeta from '../../components/PageMeta';
import { HiShoppingBag, HiClock, HiCheckCircle, HiDownload } from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          getSellerDashboard(),
          getOrders(),
        ]);
        setStats(statsRes.data?.data || statsRes.data);
        setOrders((ordersRes.data?.data || ordersRes.data || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await exportSellerOrdersExcel();
      await downloadBlobFromResponse(res, 'seller-orders.xlsx');
      toast.success('Excel berhasil diunduh');
    } catch (err) {
      toast.error(await getExportErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: HiShoppingBag, color: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
    { label: 'Pending', value: stats?.pendingOrders ?? stats?.pendingCount ?? stats?.pending ?? 0, icon: HiClock, color: 'from-yellow-500 to-orange-500', shadow: 'shadow-yellow-500/20' },
    { label: 'Completed', value: stats?.completedOrders ?? stats?.completedCount ?? stats?.completed ?? 0, icon: HiCheckCircle, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: 'Cancelled', value: stats?.cancelledOrders ?? 0, icon: HiShoppingBag, color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/20' },
  ];

  return (
    <div className="animate-fade-in">
      <PageMeta title="Seller Dashboard" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Seller Dashboard</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Kelola pesanan dan layanan Anda.</p>
        </div>
        <Button size="sm" color="light" onClick={handleExportExcel} disabled={exporting}>
          <HiDownload className="w-4 h-4 mr-2" />
          {exporting ? 'Menyiapkan...' : 'Export Excel'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 card-hover">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-lg ${stat.shadow}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Recent Orders</h2>
          <Link to="/orders" className="text-sm font-medium text-primary-500 hover:underline">View all</Link>
        </div>
        {orders.length > 0 ? (
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                <div>
                  <p className="font-medium text-surface-800 dark:text-white">
                    {getOrderService(order)?.title || `Order #${order.id}`}
                  </p>
                  <p className="text-xs text-surface-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {formatOrderPrice(order)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-surface-500">No orders yet.</div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
