import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notifications';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { HiBell, HiCheckCircle, HiExclamation, HiInformationCircle } from 'react-icons/hi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    getNotifications()
      .then(res => setNotifications(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {
      toast.error('Failed');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-surface-500">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button size="sm" color="light" onClick={handleMarkAll}>
            <HiCheckCircle className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.isRead
                  ? 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700'
                  : 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center ${
                  notif.type === 'warning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500'
                    : 'bg-primary-100 dark:bg-primary-900/30 text-primary-500'
                }`}>
                  {notif.type === 'warning' ? <HiExclamation className="w-5 h-5" /> : <HiInformationCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notif.isRead ? 'text-surface-600 dark:text-surface-400' : 'text-surface-800 dark:text-white font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-surface-400 mt-1">{new Date(notif.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse mt-1.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiBell} title="No notifications" description="You're all caught up!" />
      )}
    </div>
  );
};

export default Notifications;
