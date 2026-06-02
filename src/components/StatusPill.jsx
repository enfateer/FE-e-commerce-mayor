const variants = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800',
  banned: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border border-red-200 dark:border-red-800',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-200 dark:border-purple-800',
  seller: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200 border border-sky-200 dark:border-sky-800',
  buyer: 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-600',
};

const StatusPill = ({ label, variant = 'buyer' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant] || variants.buyer}`}>
    {label}
  </span>
);

export default StatusPill;
