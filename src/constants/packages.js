export const PACKAGE_TIERS = ['Basic', 'Gold', 'Pro'];

const TIER_INDEX = Object.fromEntries(PACKAGE_TIERS.map((name, i) => [name, i]));

export const normalizeTierName = (name) => {
  const value = String(name || '').trim().toLowerCase();
  return PACKAGE_TIERS.find((tier) => tier.toLowerCase() === value) || null;
};

export const sortPackagesByTier = (packages) => {
  if (!Array.isArray(packages)) return [];
  return [...packages].sort((a, b) => {
    const indexA = TIER_INDEX[normalizeTierName(a.name)] ?? 99;
    const indexB = TIER_INDEX[normalizeTierName(b.name)] ?? 99;
    return indexA - indexB;
  });
};

export const buildEmptyTierState = () =>
  PACKAGE_TIERS.reduce((acc, name) => {
    acc[name] = {
      name,
      id: null,
      description: '',
      price: '',
      deliveryTime: '7',
    };
    return acc;
  }, {});

export const mergePackagesIntoTiers = (packages) => {
  const state = buildEmptyTierState();
  for (const pkg of packages || []) {
    const tier = normalizeTierName(pkg.name);
    if (!tier) continue;
    state[tier] = {
      name: tier,
      id: pkg.id ?? null,
      description: pkg.description || '',
      price: String(pkg.price ?? ''),
      deliveryTime: String(pkg.deliveryTime ?? '7'),
    };
  }
  return state;
};

export const TIER_STYLES = {
  Basic: {
    badge: 'bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-200',
    border: 'border-surface-200 dark:border-surface-600',
  },
  Gold: {
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
    border: 'border-amber-300 dark:border-amber-700',
  },
  Pro: {
    badge: 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200',
    border: 'border-primary-300 dark:border-primary-700',
  },
};
