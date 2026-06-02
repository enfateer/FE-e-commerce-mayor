import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { getAdminUsers, warnUser, banUser, unbanUser } from '../../api/admin';
import UserAvatar from '../../components/UserAvatar';
import StatusPill from '../../components/StatusPill';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiSearch, HiExclamation, HiBan, HiCheckCircle } from 'react-icons/hi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState({ type: null, userId: null });

  useEffect(() => {
    getAdminUsers()
      .then(res => setUsers(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async () => {
    const { type, userId } = action;
    try {
      if (type === 'warn') await warnUser(userId);
      else if (type === 'ban') await banUser(userId);
      else if (type === 'unban') await unbanUser(userId);

      toast.success(`User ${type}${type === 'ban' ? 'ned' : type === 'warn' ? 'ed' : 'ned'} successfully`);

      const res = await getAdminUsers();
      setUsers(res.data?.data || res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
    setAction({ type: null, userId: null });
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Manage Users</h1>
        <span className="text-sm text-surface-500">{users.length} total users</span>
      </div>

      <div className="relative mb-6 max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 dark:bg-surface-700">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">User</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">Warnings</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {filtered.map(u => {
                const isAdminUser = u.role === 'admin';
                return (
                <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={u.name} profilePicture={u.profilePicture} size="sm" />
                      <div>
                        <p className="font-medium text-surface-800 dark:text-white">{u.name}</p>
                        <p className="text-xs text-surface-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {u.role === 'admin' && <StatusPill label="Admin" variant="admin" />}
                      {u.isSeller && <StatusPill label="Seller" variant="seller" />}
                      {!u.isSeller && u.role !== 'admin' && <StatusPill label="Buyer" variant="buyer" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!isAdminUser && (
                      <span className={`font-semibold ${(u.warningCount || 0) >= 2 ? 'text-red-500' : 'text-surface-600 dark:text-surface-300'}`}>
                        {u.warningCount || 0}/3
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill label={u.isBanned ? 'Banned' : 'Active'} variant={u.isBanned ? 'banned' : 'active'} />
                  </td>
                  <td className="px-6 py-4">
                    {!isAdminUser && (
                      <div className="flex justify-end gap-2">
                        {!u.isBanned && (
                          <Button size="xs" color="warning" onClick={() => setAction({ type: 'warn', userId: u.id })}>
                            <HiExclamation className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {!u.isBanned ? (
                          <Button size="xs" color="failure" onClick={() => setAction({ type: 'ban', userId: u.id })}>
                            <HiBan className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <Button size="xs" color="success" onClick={() => setAction({ type: 'unban', userId: u.id })}>
                            <HiCheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        show={!!action.type}
        onClose={() => setAction({ type: null, userId: null })}
        onConfirm={handleAction}
        title={`${action.type === 'warn' ? 'Warn' : action.type === 'ban' ? 'Ban' : 'Unban'} User`}
        message={
          action.type === 'warn'
            ? 'This will send a warning to the user. 3 warnings = automatic ban.'
            : action.type === 'ban'
            ? 'This user will be banned from the platform.'
            : 'This will unban the user and restore their access.'
        }
        danger={action.type !== 'unban'}
        confirmText={action.type === 'warn' ? 'Warn' : action.type === 'ban' ? 'Ban' : 'Unban'}
      />
    </div>
  );
};

export default AdminUsers;
