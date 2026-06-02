import { useState, useEffect } from 'react';
import { TextInput, Label, Button, Spinner, FileInput } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, becomeSeller } from '../api/users';
import { getProfilePictureUrl } from '../utils/media';
import { formatWhatsAppDisplay, getWhatsAppUrl } from '../utils/whatsapp';
import PageMeta from '../components/PageMeta';
import toast from 'react-hot-toast';
import { HiUser, HiShieldCheck, HiPencil, HiPhone } from 'react-icons/hi';

const Profile = () => {
  const { user, isSeller, isAdmin, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    whatsappNumber: user?.whatsappNumber || '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [becomingeSeller, setBecomingSeller] = useState(false);

  const profilePic = getProfilePictureUrl(user?.profilePicture);
  const whatsappUrl = getWhatsAppUrl(user?.whatsappNumber);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      bio: user?.bio || '',
      whatsappNumber: user?.whatsappNumber || '',
    });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      if (isSeller) {
        const wa = form.whatsappNumber.replace(/\D/g, '');
        if (wa && (wa.length < 10 || wa.length > 15)) {
          toast.error('Nomor WhatsApp harus 10–15 digit');
          setLoading(false);
          return;
        }
        formData.append('whatsappNumber', wa);
      }
      if (file) formData.append('profilePicture', file);
      await updateProfile(formData);
      await refreshProfile();
      toast.success('Profile updated!');
      setEditing(false);
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeSeller = async () => {
    setBecomingSeller(true);
    try {
      await becomeSeller();
      await refreshProfile();
      toast.success('You are now a seller!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upgrade');
    } finally {
      setBecomingSeller(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageMeta title="My Profile" />
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-16 mb-4 relative inline-block">
            {profilePic ? (
              <img src={profilePic} alt={user?.name} className="w-28 h-28 rounded-2xl object-cover border-4 border-white dark:border-surface-800 shadow-xl" />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-4xl font-black border-4 border-white dark:border-surface-800 shadow-xl">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          {!editing ? (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">{user?.name}</h2>
                  <p className="text-surface-500 dark:text-surface-400">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold">
                      <HiShieldCheck className="w-3.5 h-3.5" /> Administrator
                    </span>
                  )}
                  {isSeller && !isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                      <HiShieldCheck className="w-3.5 h-3.5" /> Verified Seller
                    </span>
                  )}
                </div>
                <Button color="light" size="sm" onClick={() => setEditing(true)}>
                  <HiPencil className="w-4 h-4 mr-1" /> Edit
                </Button>
              </div>
              {user?.bio && <p className="mt-4 text-surface-600 dark:text-surface-300">{user.bio}</p>}
              {isSeller && user?.whatsappNumber && (
                <p className="mt-3 text-sm text-surface-600 dark:text-surface-300 flex items-center gap-2">
                  <HiPhone className="w-4 h-4 text-emerald-500 shrink-0" />
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      {formatWhatsAppDisplay(user.whatsappNumber)}
                    </a>
                  ) : (
                    formatWhatsAppDisplay(user.whatsappNumber)
                  )}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="name" value="Name" className="mb-2 block" />
                <TextInput
                  id="name"
                  icon={HiUser}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              {isSeller && (
                <div>
                  <Label htmlFor="whatsapp" value="Nomor WhatsApp" className="mb-2 block" />
                  <TextInput
                    id="whatsapp"
                    icon={HiPhone}
                    type="tel"
                    inputMode="numeric"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    placeholder="Contoh: 081234567890"
                  />
                  <p className="text-xs text-surface-500 mt-1">
                    Hanya angka, tanpa spasi. Ditampilkan ke buyer di profil seller kamu.
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="bio" value="Bio" className="mb-2 block" />
                <textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 p-3 text-sm text-surface-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <Label htmlFor="picture" value="Profile Picture" className="mb-2 block" />
                <FileInput id="picture" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="bg-primary-500">
                  {loading && <Spinner size="sm" className="mr-2" />}
                  Save Changes
                </Button>
                <Button color="gray" onClick={() => { setEditing(false); setFile(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Pengingat WA untuk seller yang belum isi nomor */}
      {isSeller && !isAdmin && !user?.whatsappNumber && !editing && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 mb-6">
          <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1 flex items-center gap-2">
            <HiPhone className="w-5 h-5" /> Lengkapi nomor WhatsApp
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
            Buyer dapat menghubungi kamu setelah order. Klik Edit untuk menambahkan nomor WA.
          </p>
          <Button size="sm" color="success" onClick={() => setEditing(true)}>
            Tambah nomor WhatsApp
          </Button>
        </div>
      )}

      {/* Become Seller Card — tidak ditampilkan untuk admin */}
      {!isSeller && !isAdmin && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Become a Seller</h3>
          <p className="text-primary-100 mb-4">Start offering your digital services and earn money on ORVIX.</p>
          <Button
            onClick={handleBecomeSeller}
            disabled={becomingeSeller}
            className="bg-white text-primary-700 hover:bg-surface-100"
          >
            {becomingeSeller && <Spinner size="sm" className="mr-2" />}
            Upgrade to Seller
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
