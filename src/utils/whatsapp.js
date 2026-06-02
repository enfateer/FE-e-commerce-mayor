/** Normalisasi nomor untuk link wa.me (format Indonesia). */
export const normalizeWhatsAppDigits = (value) => {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  else if (!digits.startsWith('62')) digits = `62${digits}`;
  return digits;
};

export const getWhatsAppUrl = (value) => {
  const digits = normalizeWhatsAppDigits(value);
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}`;
};

export const formatWhatsAppDisplay = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('62')) return `+${digits}`;
  if (digits.startsWith('0')) return digits;
  return digits;
};
