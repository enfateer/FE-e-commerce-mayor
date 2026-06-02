/** Ambil baris detail package dari description dan/atau features (JSON array). */
export const getPackageDetailLines = (pkg) => {
  if (!pkg) return [];

  const lines = [];

  if (pkg.description?.trim()) {
    pkg.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => lines.push(line));
  }

  let features = pkg.features;
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features);
    } catch {
      features = null;
    }
  }

  if (Array.isArray(features)) {
    features
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter(Boolean)
      .forEach((item) => {
        if (!lines.includes(item)) lines.push(item);
      });
  }

  return lines;
};

export const getPackageSummary = (pkg) => {
  const lines = getPackageDetailLines(pkg);
  if (lines.length > 0) return lines.join(' · ');
  return pkg.description?.trim() || '';
};
