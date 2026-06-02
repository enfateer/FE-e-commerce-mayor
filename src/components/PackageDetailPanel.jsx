import { HiClock, HiCheck } from 'react-icons/hi';
import { getPackageDetailLines } from '../utils/package';

const PackageDetailPanel = ({ pkg, serviceTitle, formatPrice }) => {
  const detailLines = getPackageDetailLines(pkg);
  const description = pkg?.description?.trim() || '';
  const descLines = description.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const showKeteranganBox = description && descLines.length <= 1;
  const showDetailList = detailLines.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">{pkg.name}</h3>
        <span className="text-2xl font-black text-primary-600 dark:text-primary-400 shrink-0">
          {formatPrice(pkg.price)}
        </span>
      </div>

      {showKeteranganBox && (
        <div className="rounded-xl bg-surface-50 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
            Keterangan package
          </p>
          <p className="text-sm text-surface-700 dark:text-surface-200 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {showDetailList ? (
        <div className="rounded-xl bg-surface-50 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
            {descLines.length > 1 ? 'Keterangan & detail package' : 'Detail yang termasuk'}
          </p>
          <ul className="space-y-2">
            {detailLines.map((line, index) => (
              <li
                key={`${pkg.id}-detail-${index}`}
                className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-200"
              >
                <HiCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !showKeteranganBox && (
          <div className="rounded-xl bg-surface-50 dark:bg-surface-700/60 border border-dashed border-surface-300 dark:border-surface-600 p-4">
            <p className="text-sm text-surface-500 dark:text-surface-400 italic">
              Belum ada keterangan atau detail package. Seller dapat menambahkannya saat edit service.
            </p>
          </div>
        )
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        {pkg.deliveryTime != null && (
          <span className="inline-flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 px-3 py-1.5 rounded-lg">
            <HiClock className="w-4 h-4 text-surface-400" />
            {pkg.deliveryTime} hari pengerjaan
          </span>
        )}
      </div>

      {serviceTitle && (
        <p className="text-xs text-surface-500 dark:text-surface-400 border-t border-surface-200 dark:border-surface-600 pt-3">
          Bagian dari layanan: <span className="font-medium text-surface-700 dark:text-surface-200">{serviceTitle}</span>
        </p>
      )}
    </div>
  );
};

export default PackageDetailPanel;
