import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../api/services';
import { getCategories } from '../api/categories';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageMeta from '../components/PageMeta';
import { HiArrowRight, HiLightningBolt, HiShieldCheck, HiClock, HiStar } from 'react-icons/hi';

const Home = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices(),
          getCategories(),
        ]);
        setServices((servicesRes.data?.data || servicesRes.data || []).slice(0, 8));
        setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <PageMeta title="Home" description="Find Expert Digital Services For Your Business" />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-surface-900 to-primary-900 min-h-[90vh] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
              Find Expert
              <span className="block gradient-text">Digital Services</span>
              <span className="block">For Your Business</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-300 mb-10 max-w-xl leading-relaxed">
              Connect with top freelancers and discover thousands of professional digital services to grow your brand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-2xl shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5"
              >
                Browse Services
                <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/20 hover:bg-white/10 rounded-2xl backdrop-blur-sm transition-all"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-xl">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white">1K+</p>
              <p className="text-sm text-surface-400 mt-1">Services</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white">500+</p>
              <p className="text-sm text-surface-400 mt-1">Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-black text-white">10K+</p>
              <p className="text-sm text-surface-400 mt-1">Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: HiShieldCheck, title: 'Trusted Platform', desc: 'Verified sellers and secure transactions for your peace of mind.' },
              { icon: HiClock, title: 'Fast Delivery', desc: 'Get your projects completed on time with our professional freelancers.' },
              { icon: HiStar, title: 'Quality Work', desc: 'Top-rated professionals delivering exceptional digital services.' },
            ].map((feature, i) => (
              <div key={i} className="group text-center p-8 rounded-2xl border border-surface-200 dark:border-surface-700 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-surface-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-surface-500 dark:text-surface-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-surface-50 dark:bg-surface-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                Browse by <span className="gradient-text">Category</span>
              </h2>
              <p className="text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Find the perfect service for your needs from our diverse categories.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/services?category=${cat.id}`}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-700 dark:text-surface-300 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-lg transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      <section className="py-20 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                Featured <span className="gradient-text">Services</span>
              </h2>
              <p className="text-surface-500 dark:text-surface-400">Discover top-rated digital services from our best sellers.</p>
            </div>
            <Link to="/services" className="hidden sm:inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
              View All
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div key={service.id} className="animate-fade-in">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-surface-500 dark:text-surface-400 text-lg">No services available yet. Be the first to post one!</p>
              <Link to="/register" className="inline-flex items-center gap-2 mt-4 px-6 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
                Get Started <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="sm:hidden text-center mt-8">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-700 rounded-xl">
              View All Services <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-500/10 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals and businesses already using ORVIX to bring their ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-700 bg-white hover:bg-surface-100 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5">
              Create Free Account
            </Link>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/30 hover:bg-white/10 rounded-2xl transition-all">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
