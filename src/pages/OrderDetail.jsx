import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { getOrderById, updateOrderStatus } from '../api/orders';
import { exportOrderPdf } from '../api/exports';
import { useAuth } from '../context/AuthContext';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import PageMeta from '../components/PageMeta';
import toast from 'react-hot-toast';
import { HiDownload, HiCheck, HiX, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';
import { unwrapEntity } from '../utils/apiResponse';
import {
  getOrderService,
  getOrderPackage,
  formatOrderPrice,
  getOrderParticipantRole,
} from '../utils/order';
import { getUploadUrl } from '../utils/media';
import { downloadBlobFromResponse, getExportErrorMessage } from '../utils/download';

const PROGRESS_STEPS = ['pending', 'accepted', 'in_progress', 'delivered', 'completed'];

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      setOrder(unwrapEntity(res));
    } catch {
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      await updateOrderStatus(id, { status });
      toast.success('Status order diperbarui');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui status');
    } finally {
      setUpdating(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportOrderPdf(id);
      await downloadBlobFromResponse(res, `order-${id}.pdf`);
      toast.success('PDF berhasil diunduh');
    } catch (err) {
      toast.error(await getExportErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!order?.id) return null;

  const { isBuyer, isSeller, isAdmin } = getOrderParticipantRole(order, user);
  const orderService = getOrderService(order);
  const orderPackage = getOrderPackage(order);
  const serviceThumbnail = getUploadUrl(orderService?.thumbnail);
  const buyer = order.buyer || order.Buyer;
  const seller = order.seller || order.Seller;

  const progressIndex = PROGRESS_STEPS.indexOf(order.status);

  const showProgress = !['cancelled', 'rejected'].includes(order.status);

  const renderActions = () => {
    const buttons = [];
    const disabled = updating;

    const add = (key, element) => buttons.push({ key, element });

    // ——— Seller pada order ini ———
    if (isSeller && order.status === 'pending') {
      add('accept', (
        <Button key="accept" color="success" disabled={disabled} onClick={() => handleStatusUpdate('accepted')}>
          <HiCheck className="w-4 h-4 mr-2" /> Terima Order
        </Button>
      ));
      add('reject', (
        <Button key="reject" color="failure" disabled={disabled} onClick={() => handleStatusUpdate('rejected')}>
          <HiX className="w-4 h-4 mr-2" /> Tolak Order
        </Button>
      ));
    }

    if (isSeller && order.status === 'accepted') {
      add('start', (
        <Button key="start" color="purple" disabled={disabled} onClick={() => handleStatusUpdate('in_progress')}>
          Mulai Pengerjaan
        </Button>
      ));
    }

    if (isSeller && order.status === 'in_progress') {
      add('deliver', (
        <Button key="deliver" color="info" disabled={disabled} onClick={() => handleStatusUpdate('delivered')}>
          Tandai Sudah Dikirim
        </Button>
      ));
    }

    // ——— Buyer pada order ini ———
    if (isBuyer && order.status === 'pending') {
      add('cancel', (
        <Button key="cancel" color="failure" disabled={disabled} onClick={() => handleStatusUpdate('cancelled')}>
          Batalkan Order
        </Button>
      ));
    }

    if (isBuyer && order.status === 'delivered') {
      add('complete', (
        <Button key="complete" color="success" disabled={disabled} onClick={() => handleStatusUpdate('completed')}>
          <HiCheck className="w-4 h-4 mr-2" /> Selesaikan Order
        </Button>
      ));
    }

    if (buttons.length === 0) {
      let hint = 'Tidak ada aksi untuk status ini.';
      if (order.status === 'completed') hint = 'Order sudah selesai.';
      if (order.status === 'cancelled') hint = 'Order dibatalkan.';
      if (order.status === 'rejected') hint = 'Order ditolak seller.';
      if (isAdmin && !isBuyer && !isSeller) {
        hint = 'Admin hanya memantau — aksi dilakukan oleh buyer/seller.';
      } else if (!isBuyer && !isSeller) {
        hint = 'Kamu bukan pihak dalam order ini.';
      }
      return (
        <p className="text-sm text-surface-500 dark:text-surface-400">{hint}</p>
      );
    }

    return <div className="flex flex-wrap gap-3">{buttons.map((b) => b.element)}</div>;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageMeta title={`Order #${order.id}`} />
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-primary-500 mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Order #{order.id}</h1>
          <p className="text-sm text-surface-500">
            {new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </p>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 mt-2 text-xs text-purple-600 dark:text-purple-400">
              <HiShieldCheck className="w-3.5 h-3.5" /> Mode Admin
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Button size="sm" color="light" onClick={handleExport} disabled={exporting} title="Unduh PDF">
            <HiDownload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showProgress && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 mb-6">
          <h3 className="font-semibold text-surface-800 dark:text-white mb-4">Progress</h3>
          <div className="flex items-center justify-between">
            {PROGRESS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= progressIndex
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                  }`}
                >
                  {i < progressIndex ? <HiCheck className="w-4 h-4" /> : i + 1}
                </div>
                {i < PROGRESS_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      i < progressIndex ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {PROGRESS_STEPS.map((s) => (
              <span key={s} className="text-[10px] text-surface-400 capitalize">
                {s.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 mb-6">
        <h3 className="font-semibold text-surface-800 dark:text-white mb-4">Service Details</h3>
        <div className="flex flex-col sm:flex-row gap-5">
          {serviceThumbnail ? (
            <img
              src={serviceThumbnail}
              alt={orderService?.title || 'Service'}
              className="w-full sm:w-40 h-32 sm:h-28 object-cover rounded-xl border border-surface-200 dark:border-surface-600 shrink-0"
            />
          ) : (
            <div className="w-full sm:w-40 h-32 sm:h-28 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-3xl shrink-0">
              🛠️
            </div>
          )}
          <div className="flex-1 space-y-3 text-sm min-w-0">
            <div>
              <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Service</p>
              <p className="font-semibold text-surface-900 dark:text-white">{orderService?.title || '-'}</p>
            </div>
            <div>
              <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Package</p>
              <p className="font-medium text-surface-800 dark:text-white">{orderPackage?.name || '-'}</p>
            </div>
            <div>
              <p className="text-surface-500 text-xs uppercase tracking-wide mb-0.5">Price</p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatOrderPrice(order)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 mb-6">
        <h3 className="font-semibold text-surface-800 dark:text-white mb-4">Order Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between gap-4 sm:col-span-2">
            <span className="text-surface-500">Order ID</span>
            <span className="font-mono font-medium text-surface-800 dark:text-white">#{order.id}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Peran kamu</span>
            <span className="font-medium text-surface-800 dark:text-white text-right">
              {isAdmin ? 'Admin' : [isBuyer && 'Buyer', isSeller && 'Seller'].filter(Boolean).join(', ') || '-'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Buyer</span>
            <span className="font-medium text-surface-800 dark:text-white text-right">{buyer?.name || '-'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Seller</span>
            <span className="font-medium text-surface-800 dark:text-white text-right">{seller?.name || '-'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Created</span>
            <span className="text-surface-800 dark:text-white">
              {new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-surface-500">Updated</span>
            <span className="text-surface-800 dark:text-white">
              {new Date(order.updatedAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </span>
          </div>
        </div>
        {order.requirements?.trim() && (
          <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700">
            <p className="text-surface-500 text-xs uppercase tracking-wide mb-2">Requirements</p>
            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-line">
              {order.requirements.trim()}
            </p>
          </div>
        )}
      </div>

      {(isBuyer || isSeller) && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-surface-800 dark:text-white mb-4">Actions</h3>
          {renderActions()}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
