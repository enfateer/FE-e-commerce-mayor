import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { getServices } from '../../api/services';
import { adminDeleteService } from '../../api/admin';
import { getUploadUrl } from '../../utils/media';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import { HiTrash, HiSearch, HiCube } from 'react-icons/hi';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await adminDeleteService(deleteId);
      setServices(prev => prev.filter(s => s.id !== deleteId));
      toast.success('Service removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
    setDeleteId(null);
  };

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.User?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Moderate Services
        </h1>
        <span className="text-sm text-surface-500">
          {services.length} services
        </span>
      </div>

      <div className="relative mb-6 max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">
                    Service
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">
                    Seller
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">
                    Category
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex-shrink-0 overflow-hidden">
                          {s.thumbnail ? (
                            <img
                              src={getUploadUrl(s.thumbnail)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              🛠️
                            </div>
                          )}
                        </div>

                        <p className="font-medium text-surface-800 dark:text-white line-clamp-1">
                          {s.title}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {s.User?.name || s.user?.name || '-'}
                    </td>

                    <td className="px-6 py-4 text-surface-600 dark:text-surface-300">
                      {s.Category?.name || s.category?.name || '-'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => setDeleteId(s.id)}
                        >
                          <HiTrash className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={HiCube}
          title="No services found"
          description="No services match your search."
        />
      )}

      <ConfirmModal
        show={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="This will permanently remove this service from the platform."
      />
    </div>
  );
};

export default AdminServices;