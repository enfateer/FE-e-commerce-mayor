import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Label, Textarea, Button, FileInput, Spinner, Select } from 'flowbite-react';
import { createService, updateService, getServiceById } from '../../api/services';
import { getCategories } from '../../api/categories';
import { getPackages, createPackage, updatePackage } from '../../api/packages';
import { getUploadUrl } from '../../utils/media';
import { unwrapEntity, unwrapList } from '../../utils/apiResponse';
import {
  PACKAGE_TIERS,
  buildEmptyTierState,
  mergePackagesIntoTiers,
  TIER_STYLES,
} from '../../constants/packages';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiSave } from 'react-icons/hi';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ title: '', description: '', categoryId: '' });
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tiers, setTiers] = useState(buildEmptyTierState);
  const [savingTier, setSavingTier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data?.data || res.data || []))
      .catch(() => {});

    if (isEdit) {
      setLoading(true);
      Promise.all([getServiceById(id), getPackages(id)])
        .then(([serviceRes, pkgRes]) => {
          const svc = unwrapEntity(serviceRes);
          if (!svc?.id) throw new Error('Service not found');
          setForm({
            title: svc.title || '',
            description: svc.description || '',
            categoryId: String(svc.categoryId || svc.category?.id || ''),
          });
          setExistingThumbnail(svc.thumbnail || null);
          const loaded = unwrapList(pkgRes);
          const fromService = Array.isArray(svc.packages) ? svc.packages : [];
          setTiers(mergePackagesIntoTiers(loaded.length > 0 ? loaded : fromService));
        })
        .catch(() => toast.error('Failed to load service'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const getErrorMessage = (err) => {
    const detail = err.response?.data?.data;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d.message || `${d.field} tidak valid`).join('. ');
    }
    return err.response?.data?.message || 'Save failed';
  };

  const updateTierField = (tierName, field, value) => {
    setTiers((prev) => ({
      ...prev,
      [tierName]: { ...prev[tierName], [field]: value },
    }));
  };

  const buildTierPayload = (tierName) => {
    const tier = tiers[tierName];
    return {
      name: tierName,
      description: tier.description.trim(),
      price: Number(tier.price),
      deliveryTime: Number(tier.deliveryTime) || 7,
    };
  };

  const validateTier = (tierName) => {
    const tier = tiers[tierName];
    if (!tier.price || Number(tier.price) <= 0) {
      toast.error(`Harga ${tierName} wajib diisi`);
      return false;
    }
    return true;
  };

  const handleSaveTier = async (tierName) => {
    if (!validateTier(tierName)) return;

    const payload = buildTierPayload(tierName);
    const tier = tiers[tierName];

    if (!isEdit) {
      toast.success(`Data ${tierName} siap disimpan bersama service`);
      return;
    }

    setSavingTier(tierName);
    try {
      if (tier.id) {
        const res = await updatePackage(tier.id, payload);
        const updated = unwrapEntity(res) || res.data?.data || res.data;
        setTiers((prev) => ({
          ...prev,
          [tierName]: {
            ...prev[tierName],
            ...updated,
            name: tierName,
            price: String(updated?.price ?? prev[tierName].price),
            deliveryTime: String(updated?.deliveryTime ?? prev[tierName].deliveryTime),
          },
        }));
        toast.success(`Package ${tierName} diperbarui`);
      } else {
        const res = await createPackage(id, payload);
        const created = unwrapEntity(res) || res.data?.data || res.data;
        setTiers((prev) => ({
          ...prev,
          [tierName]: {
            ...prev[tierName],
            id: created?.id ?? null,
            name: tierName,
            price: String(created?.price ?? prev[tierName].price),
            deliveryTime: String(created?.deliveryTime ?? prev[tierName].deliveryTime),
          },
        }));
        toast.success(`Package ${tierName} ditambahkan`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingTier(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.error('Pilih kategori terlebih dahulu');
      return;
    }
    if (form.title.trim().length < 5) {
      toast.error('Judul minimal 5 karakter');
      return;
    }
    if (form.description.trim().length < 10) {
      toast.error('Deskripsi minimal 10 karakter');
      return;
    }

    if (!isEdit) {
      for (const tierName of PACKAGE_TIERS) {
        if (!validateTier(tierName)) return;
      }
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('categoryId', String(form.categoryId));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      if (isEdit) {
        await updateService(id, formData);
        toast.success('Data service berhasil diperbarui!');
        setThumbnail(null);
      } else {
        const res = await createService(formData);
        const created = unwrapEntity(res) || res.data?.data || res.data;
        const newId = created?.id;

        if (!newId) {
          toast.error('Service dibuat tapi ID tidak ditemukan');
          navigate('/seller/services');
          return;
        }

        for (const tierName of PACKAGE_TIERS) {
          await createPackage(newId, buildTierPayload(tierName));
        }

        toast.success('Service dengan 3 package berhasil dibuat!');
        navigate(`/seller/services/${newId}/edit`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const thumbPreview = thumbnail ? URL.createObjectURL(thumbnail) : getUploadUrl(existingThumbnail);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/seller/services')} className="flex items-center gap-2 text-sm text-surface-500 hover:text-primary-500 mb-6">
        <HiArrowLeft className="w-4 h-4" /> Back to Services
      </button>

      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
        {isEdit ? 'Edit Service' : 'Create New Service'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700 mb-6">
        <div className="space-y-5">
          <div>
            <Label htmlFor="title" value="Service Title" className="mb-2 block" />
            <TextInput
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Professional Logo Design (min. 5 karakter)"
              required
              minLength={5}
            />
          </div>

          <div>
            <Label htmlFor="category" value="Category" className="mb-2 block" />
            <Select id="category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="description" value="Description" className="mb-2 block" />
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your service in detail (min. 10 karakter)..."
              rows={5}
              required
              minLength={10}
            />
          </div>

          <div>
            <Label htmlFor="thumbnail" value="Thumbnail Image" className="mb-2 block" />
            <FileInput id="thumbnail" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
            {thumbPreview && (
              <img src={thumbPreview} alt="Preview" className="mt-3 w-full max-h-48 object-cover rounded-xl border border-surface-200 dark:border-surface-600" />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-primary-500 to-primary-600">
              {saving && <Spinner size="sm" className="mr-2" />}
              <HiSave className="w-4 h-4 mr-2" />
              {isEdit ? 'Simpan Perubahan Service' : 'Buat Service + 3 Package'}
            </Button>
            {isEdit && (
              <Button type="button" color="light" onClick={() => navigate('/seller/services')}>
                Kembali ke daftar
              </Button>
            )}
          </div>
        </div>
      </form>

      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-1">Packages</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
          Setiap service memiliki 3 package tetap: <strong>Basic</strong>, <strong>Gold</strong>, dan <strong>Pro</strong>.
          {isEdit
            ? ' Simpan tiap package secara terpisah setelah mengisi datanya.'
            : ' Isi ketiganya — akan disimpan otomatis saat service dibuat.'}
        </p>

        <div className="space-y-5">
          {PACKAGE_TIERS.map((tierName) => {
            const tier = tiers[tierName];
            const style = TIER_STYLES[tierName];
            return (
              <div
                key={tierName}
                className={`rounded-xl border-2 p-5 ${style.border} bg-surface-50/50 dark:bg-surface-700/30`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${style.badge}`}>
                    {tierName}
                  </span>
                  {tier.id && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Tersimpan</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label value="Harga (Rp)" className="mb-1 block text-xs" />
                    <TextInput
                      type="number"
                      placeholder="Contoh: 50000"
                      value={tier.price}
                      onChange={(e) => updateTierField(tierName, 'price', e.target.value)}
                      sizing="sm"
                      required
                    />
                  </div>
                  <div>
                    <Label value="Lama pengerjaan (hari)" className="mb-1 block text-xs" />
                    <TextInput
                      type="number"
                      value={tier.deliveryTime}
                      onChange={(e) => updateTierField(tierName, 'deliveryTime', e.target.value)}
                      sizing="sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label value="Keterangan & detail package" className="mb-1 block text-xs" />
                  <Textarea
                    placeholder={'Satu baris = satu poin detail\nContoh:\nDesain logo\nFile PNG & SVG'}
                    value={tier.description}
                    onChange={(e) => updateTierField(tierName, 'description', e.target.value)}
                    rows={3}
                  />
                </div>

                {isEdit && (
                  <Button
                    size="sm"
                    color="purple"
                    disabled={savingTier === tierName}
                    onClick={() => handleSaveTier(tierName)}
                  >
                    {savingTier === tierName ? <Spinner size="sm" className="mr-2" /> : <HiSave className="w-4 h-4 mr-1" />}
                    Simpan {tierName}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
