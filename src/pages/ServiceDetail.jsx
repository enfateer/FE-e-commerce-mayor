import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { getServiceById } from '../api/services';
import { getPackages } from '../api/packages';
import { createOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { getUploadUrl } from '../utils/media';
import LoadingSpinner from '../components/LoadingSpinner';
import PageMeta from '../components/PageMeta';
import toast from 'react-hot-toast';
import { HiClock, HiCheck, HiShoppingCart } from 'react-icons/hi';
import PackageDetailPanel from '../components/PackageDetailPanel';
import { getPackageDetailLines } from '../utils/package';
import { unwrapEntity, unwrapList } from '../utils/apiResponse';
import { sortPackagesByTier } from '../constants/packages';

const ServiceDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await getServiceById(id);
        const svc = unwrapEntity(serviceRes);
        if (!svc?.id) {
          throw new Error('Service not found');
        }

        setService(svc);

        let pkgs = Array.isArray(svc.packages) ? svc.packages : [];
        if (pkgs.length === 0) {
          try {
            const packagesRes = await getPackages(id);
            pkgs = unwrapList(packagesRes);
          } catch {
            pkgs = [];
          }
        }

        const sorted = sortPackagesByTier(pkgs);
        setPackages(sorted);
        if (sorted.length > 0) setSelectedPkg(sorted[0]);
      } catch {
        toast.error('Service not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedPkg) {
      toast.error('Please select a package');
      return;
    }
    setOrdering(true);
    try {
      await createOrder({ serviceId: Number(id), packageId: selectedPkg.id });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!service?.id) return null;

  const thumbnail = getUploadUrl(service.thumbnail);
  const categoryName = service.category?.name || service.Category?.name;
  const sellerName = service.user?.name || service.User?.name || 'Seller';
  const sellerId = service.userId || service.user?.id || service.User?.id;

  const formatPrice = (v) => {
    const n = typeof v === 'string' ? Number(v) : v;
    if (n === null || n === undefined || Number.isNaN(n)) return 'Rp 0';
    return `Rp ${Number(n).toLocaleString('id-ID')}`;
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <PageMeta title={service.title} description={service.description} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-800 aspect-video shadow-lg">
              {thumbnail ? (
                <img src={thumbnail} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🛠️</div>
              )}
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
              {categoryName && (
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                  {categoryName}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-4">{service.title}</h1>

              {sellerId && (
                <Link
                  to={`/sellers/${sellerId}`}
                  className="inline-flex items-center gap-2 mb-6 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                >
                  Seller: {sellerName}
                </Link>
              )}

              <div className="prose prose-surface dark:prose-invert max-w-none mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-surface-600 dark:text-surface-300 whitespace-pre-line">{service.description || 'No description provided.'}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Packages &amp; what&apos;s included</h3>
                {packages.length > 0 ? (
                  <div className="space-y-4">
                    {packages.map((pkg) => {
                      const previewLines = getPackageDetailLines(pkg).slice(0, 3);
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPkg(pkg)}
                          className={`w-full text-left p-5 rounded-xl border transition-colors ${
                            selectedPkg?.id === pkg.id
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 ring-1 ring-primary-500/30'
                              : 'border-surface-200 dark:border-surface-600 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                            <h4 className="font-bold text-surface-900 dark:text-white">{pkg.name}</h4>
                            <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                              {formatPrice(pkg.price)}
                            </span>
                          </div>
                          {pkg.description?.trim() ? (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-3 whitespace-pre-line">
                              {pkg.description.trim()}
                            </p>
                          ) : (
                            <p className="text-sm text-surface-500 italic mb-3">Belum ada keterangan</p>
                          )}
                          {previewLines.length > 0 && (
                            <ul className="space-y-1.5 text-sm text-surface-600 dark:text-surface-300 mb-3">
                              {previewLines.map((line, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <HiCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="line-clamp-1">{line}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs text-surface-500">
                            {pkg.deliveryTime != null && (
                              <span className="flex items-center gap-1">
                                <HiClock className="w-3.5 h-3.5" />
                                {pkg.deliveryTime} hari
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-surface-500 dark:text-surface-400">Belum ada package untuk service ini.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden sticky top-24">
              {packages.length > 0 ? (
                <>
                  <div className="flex border-b border-surface-200 dark:border-surface-700 overflow-x-auto">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPkg(pkg)}
                        className={`flex-1 min-w-[100px] py-4 px-2 text-sm font-semibold text-center transition-all ${
                          selectedPkg?.id === pkg.id
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                            : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                        }`}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>

                  {selectedPkg && (
                    <div className="p-6 space-y-6">
                      <PackageDetailPanel
                        pkg={selectedPkg}
                        serviceTitle={service.title}
                        formatPrice={formatPrice}
                      />
                      <Button
                        onClick={handleOrder}
                        disabled={ordering}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 font-semibold"
                        size="lg"
                      >
                        {ordering ? <Spinner size="sm" className="mr-2" /> : <HiShoppingCart className="w-5 h-5 mr-2" />}
                        {ordering ? 'Ordering...' : 'Order Now'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-surface-500 dark:text-surface-400">No packages available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
