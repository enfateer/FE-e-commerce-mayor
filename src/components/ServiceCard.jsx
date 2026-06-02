import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUploadUrl } from '../utils/media';
import { HiUser } from 'react-icons/hi';

const hasImage = (url) => typeof url === 'string' && url.length > 0;


const getServicePrice = (service) => {
  const pkgs = service.packages || service.Packages || [];
  if (service.minPrice != null && service.minPrice !== '') {
    return Number(service.minPrice);
  }
  if (pkgs.length > 0) {
    return Math.min(...pkgs.map((p) => Number(p.price) || 0));
  }
  return Number(service.price) || 0;
};

const ServiceCard = ({ service }) => {
  const thumbnailSrc = hasImage(service.thumbnail) ? getUploadUrl(service.thumbnail) : null;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [service.id, thumbnailSrc]);

  const showThumbnail = thumbnailSrc && !imageError;

  const price = getServicePrice(service);
  const sellerName = service.user?.name || service.User?.name || service.seller?.name || 'Seller';
  const categoryName = service.category?.name || service.Category?.name;

  return (
    <Link to={`/services/${service.id}`} className="group block">
      <div className="card-hover bg-white dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm">
        <div className="relative aspect-video overflow-hidden bg-surface-100 dark:bg-surface-700">
          {showThumbnail ? (
            <img
              src={thumbnailSrc}
              alt={service.title}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-surface-300 dark:text-surface-600">🛠️</span>
            </div>
          )}
          {categoryName && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/90 text-white backdrop-blur-sm">
              {categoryName}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-surface-800 dark:text-surface-100 mb-1 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {service.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
              <HiUser className="w-3.5 h-3.5 text-primary-600 dark:text-primary-300" />
            </div>
            <span className="text-sm text-surface-500 dark:text-surface-400">{sellerName}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700">
            <span className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider">Starting at</span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {price > 0 ? `Rp ${price.toLocaleString('id-ID')}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
