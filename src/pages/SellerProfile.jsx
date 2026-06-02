import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSellerDetails } from '../api/sellers';
import { unwrapEntity } from '../utils/apiResponse';
import UserAvatar from '../components/UserAvatar';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import PageMeta from '../components/PageMeta';
import { HiStar, HiPhone, HiCube } from 'react-icons/hi';
import { formatWhatsAppDisplay, getWhatsAppUrl } from '../utils/whatsapp';

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellerDetails(id)
      .then((res) => setSeller(unwrapEntity(res)))
      .catch(() => setSeller(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!seller) return <div className="text-center py-20 text-surface-500">Seller not found</div>;

  const whatsappUrl = getWhatsAppUrl(seller.whatsappNumber);
  const services = seller.services || seller.Services || [];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <PageMeta title={`${seller.name} - Profile`} description={seller.bio || ''} />
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 flex justify-center">
            <UserAvatar name={seller.name} profilePicture={seller.profilePicture} size="xl" className="border-4 border-white/20 shadow-xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{seller.name}</h1>
          {seller.whatsappNumber && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
            >
              <HiPhone className="w-4 h-4" />
              Chat WhatsApp · {formatWhatsAppDisplay(seller.whatsappNumber)}
            </a>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Bio */}
        {seller.bio && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 mb-8">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-3">About</h2>
            <p className="text-surface-600 dark:text-surface-400">{seller.bio}</p>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6 flex items-center gap-2">
            <HiStar className="w-6 h-6 text-primary-500" /> Layanan dari {seller.name}
          </h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={HiCube}
              title="Belum ada layanan"
              description="Seller ini belum mempublikasikan layanan."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
