import { useState, useEffect } from 'react';
import { getAdminSellers } from '../../api/admin';
import UserAvatar from '../../components/UserAvatar';
import StatusPill from '../../components/StatusPill';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Link } from 'react-router-dom';
import { HiUsers, HiSearch } from 'react-icons/hi';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminSellers()
      .then(res => setSellers(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = sellers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Sellers</h1>
        <span className="text-sm text-surface-500">{sellers.length} sellers</span>
      </div>

      <div className="relative mb-6 max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(seller => (
            <Link
              key={seller.id}
              to={`/sellers/${seller.id}`}
              className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 card-hover"
            >
              <div className="flex items-center gap-4 mb-3">
                <UserAvatar name={seller.name} profilePicture={seller.profilePicture} size="md" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-800 dark:text-white truncate">{seller.name}</h3>
                  <p className="text-sm text-surface-500 truncate">{seller.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <StatusPill label={seller.isBanned ? 'Banned' : 'Active'} variant={seller.isBanned ? 'banned' : 'active'} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiUsers} title="No sellers found" description="No sellers match your search criteria." />
      )}
    </div>
  );
};

export default AdminSellers;
