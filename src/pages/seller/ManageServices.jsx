import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { getServices, deleteService } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { getUploadUrl } from '../../utils/media';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiCube, HiEye } from 'react-icons/hi';

const ManageServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getServices()
      .then(res => {
        const all = res.data?.data || res.data || [];
        setServices(all.filter(s => s.userId === user?.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async () => {
    try {
      await deleteService(deleteId);
      setServices(prev => prev.filter(s => s.id !== deleteId));
      toast.success('Service deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Services</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">{services.length} services</p>
        </div>
        <Link to="/seller/services/new">
          <Button className="bg-gradient-to-r from-primary-500 to-primary-600">
            <HiPlus className="w-4 h-4 mr-2" /> New Service
          </Button>
        </Link>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <div key={service.id} className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden card-hover">
              <div className="flex">
                <div className="w-32 h-32 bg-surface-100 dark:bg-surface-700 flex-shrink-0">
                  {service.thumbnail ? (
                    <img src={getUploadUrl(service.thumbnail)} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🛠️</div>
                  )}
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-surface-800 dark:text-white line-clamp-1">{service.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mt-1">{service.description}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                      Basic · Gold · Pro
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Link to={`/services/${service.id}`} title="Lihat di marketplace">
                      <Button size="xs" color="light"><HiEye className="w-3.5 h-3.5" /></Button>
                    </Link>
                    <Link to={`/seller/services/${service.id}/edit`} title="Edit service & packages">
                      <Button size="xs" color="purple"><HiPencil className="w-3.5 h-3.5" /></Button>
                    </Link>
                    <Button size="xs" color="failure" onClick={() => setDeleteId(service.id)} title="Hapus service">
                      <HiTrash className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiCube} title="No services yet" description="Create your first service to start selling." />
      )}

      <ConfirmModal
        show={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure? This will permanently delete this service and all its packages."
      />
    </div>
  );
};

export default ManageServices;
