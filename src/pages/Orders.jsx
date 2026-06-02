import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { getOrders } from '../api/orders';
import { unwrapList } from '../utils/apiResponse';
import { exportOrderHistoryPdf } from '../api/exports';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { getOrderService, getOrderPackage, formatOrderPrice } from '../utils/order';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import PageMeta from '../components/PageMeta';
import toast from 'react-hot-toast';
import { HiDownload, HiEye, HiShoppingBag } from 'react-icons/hi';
import { downloadBlobFromResponse, getExportErrorMessage } from '../utils/download';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(unwrapList(res)))
      .catch(() => toast.error('Gagal memuat daftar order'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportOrderHistoryPdf();
      await downloadBlobFromResponse(res, 'orders-history.pdf');
      toast.success('PDF berhasil diunduh');
    } catch (err) {
      toast.error(await getExportErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <PageMeta title="My Orders" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Orders</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm">{orders.length} total orders</p>
        </div>
        <Button size="sm" color="light" onClick={handleExport} disabled={exporting}>
          <HiDownload className="w-4 h-4 mr-2" />
          {exporting ? 'Menyiapkan...' : 'Export PDF'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(order => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded">#{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <h3 className="font-semibold text-surface-800 dark:text-white">{getOrderService(order)?.title || 'Service'}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{getOrderPackage(order)?.name || 'Standard'}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {formatOrderPrice(order)}
                  </p>
                  <p className="text-xs text-surface-400">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiShoppingBag} title="No orders found" description="You don't have any orders matching this filter." />
      )}
    </div>
  );
};

export default Orders;
