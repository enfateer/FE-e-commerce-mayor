import { useState, useEffect } from 'react';
import { getAdminNotifications } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { HiBell } from 'react-icons/hi';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminNotifications()
      .then(res => setNotifications(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Platform Notifications</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Notifikasi yang dikirim ke user (peringatan, ban, unban, dll).
        </p>
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 divide-y divide-surface-100 dark:divide-surface-700">
          {notifications.map((n) => (
            <div key={n.id} className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                <HiBell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold text-surface-800 dark:text-white">
                    {n.user?.name || 'User'}
                  </p>
                  <span className="text-xs text-surface-500">{n.user?.email}</span>
                  {!n.isRead && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                      Unread
                    </span>
                  )}
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-300">{n.message}</p>
                <p className="text-xs text-surface-400 mt-2">
                  {new Date(n.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HiBell}
          title="Belum ada notifikasi"
          description="Notifikasi akan muncul saat admin memberi peringatan, ban, atau unban user."
        />
      )}
    </div>
  );
};

export default AdminNotifications;
