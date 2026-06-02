import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices } from '../api/services';
import { getCategories } from '../api/categories';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import PageMeta from '../components/PageMeta';
import { HiSearch } from 'react-icons/hi';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const activeSort = searchParams.get('sort') || '';

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data?.data || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.categoryId = activeCategory;
    if (search) params.search = search;
    if (activeSort) params.sort = activeSort;

    getServices(params)
      .then(res => setServices(res.data?.data || res.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [activeCategory, search, activeSort]);

  const handleCategoryClick = (catId) => {
    if (catId === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (nextSort) => {
    if (nextSort) searchParams.set('sort', nextSort);
    else searchParams.delete('sort');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen">
      <PageMeta title="Browse Services" description="Find the perfect digital service for your project." />

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-surface-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Browse Services</h1>
          <p className="text-primary-100 mb-8 max-w-xl">
            Find the perfect digital service for your project from our talented community.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category + Sort Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {/* Category Filters */}
          {categories.length > 0 && (
            <>
              <button
                onClick={() => {
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !activeCategory
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300'
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(String(cat.id))}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    String(cat.id) === activeCategory
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}

          {/* Sort */}
          <div className="ml-auto">
            <select
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="">Sort: Relevance</option>
              <option value="cheapest">Sort: Cheapest</option>
              <option value="expensive">Sort: Expensive</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : services.length > 0 ? (
          <>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">{services.length} services found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="No services found" description="Try adjusting your search or filter criteria." />
        )}
      </section>
    </div>
  );
};

export default Services;

