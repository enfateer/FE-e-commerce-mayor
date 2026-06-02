import { UPLOADS_BASE } from '../api/axios';

const API_ORIGIN = UPLOADS_BASE.replace(/\/api\/uploads\/?$/i, '');

export const isFullUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);

export const getUploadUrl = (path) => {
  if (!path) return null;
  const value = String(path).trim().replace(/\\/g, '/');
  if (isFullUrl(value)) return value;
  if (value.startsWith('/api/uploads/')) {
    return `${API_ORIGIN}${value}`;
  }
  // Data lama kadang tersimpan sebagai URL penuh tanpa skema terdeteksi
  if (value.includes('localhost:') || value.startsWith('//')) {
    return value.startsWith('//') ? `http:${value}` : value.startsWith('http') ? value : `http://${value.replace(/^https?:\/\//, '')}`;
  }
  // Ambil path relatif setelah folder uploads (termasuk path absolut Windows)
  // Contoh nilai dari backend:
  // - uploads/services/thumbnail-xxx.jpg
  // - /uploads/services/thumbnail-xxx.jpg
  // - C:/.../uploads/services/thumbnail-xxx.jpg
  // - services/thumbnail-xxx.jpg
  const normalized = (() => {
    const v = value;

    // buang apapun yang sebelum /uploads/... (termasuk path absolut windows)
    const uploadsMatch = v.match(/(?:^|\/)uploads\/(.+)$/i);
    if (uploadsMatch) return uploadsMatch[1];

    // jika belum ada kata uploads, hapus slash awal saja
    return v.replace(/^\/+/, '').replace(/^uploads\//i, '');
  })();

  return `${UPLOADS_BASE}${normalized}`;

};

export const getProfilePictureUrl = (profilePicture) => getUploadUrl(profilePicture);
