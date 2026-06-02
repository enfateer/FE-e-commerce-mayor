/** Ambil payload `data` dari response API { status, message, data }. */
export const unwrapData = (res) => {
  const body = res?.data;
  if (body && typeof body === 'object' && 'data' in body && body.data !== undefined) {
    return body.data;
  }
  return body;
};

/** Pastikan hasil berupa array (list). */
export const unwrapList = (res) => {
  const data = unwrapData(res);
  return Array.isArray(data) ? data : [];
};

/** Ambil object service dari response detail. */
export const unwrapEntity = (res) => {
  const data = unwrapData(res);
  return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
};
