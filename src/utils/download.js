/** Unduh file dari response axios dengan responseType blob. */
export const downloadBlobFromResponse = async (response, filename) => {
  const contentType = response.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    const text = await response.data.text();
    let message = 'Download gagal';
    try {
      const json = JSON.parse(text);
      message = json.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const blob = new Blob([response.data], {
    type: contentType || 'application/octet-stream',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  link.remove();
};

export const getExportErrorMessage = async (err, fallback = 'Export gagal') => {
  const data = err.response?.data;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const json = JSON.parse(text);
      return json.message || fallback;
    } catch {
      return fallback;
    }
  }
  return err.response?.data?.message || err.message || fallback;
};
