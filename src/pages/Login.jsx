import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextInput, Label, Button, Spinner } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PageMeta from '../components/PageMeta';
import { HiMail, HiLockClosed } from 'react-icons/hi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');

      const sessionUserStr = localStorage.getItem('orvix_user');
      const sessionUser = sessionUserStr ? JSON.parse(sessionUserStr) : null;
      
      if (from === '/dashboard' && sessionUser?.role === 'admin') {
        navigate('/admin/reports', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (!err.response) {
        toast.error('Tidak bisa terhubung ke server. Pastikan backend berjalan di http://localhost:3000');
      } else if (err.response.status === 400) {
        const detail = err.response.data?.data;
        toast.error(Array.isArray(detail) ? detail[0]?.message || 'Data login tidak valid' : err.response.data?.message || 'Data login tidak valid');
      } else {
        toast.error(err.response?.data?.message || 'Email atau password salah');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <PageMeta title="Login" description="Login to your ORVIX account" />
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <span className="text-white font-black text-lg">O</span>
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">ORVIX</span>
          </Link>

          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" value="Email Address" className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300" />
              <TextInput
                id="email"
                type="email"
                icon={HiMail}
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                sizing="lg"
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300" />
              <TextInput
                id="password"
                type="password"
                icon={HiLockClosed}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                sizing="lg"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:ring-primary-300 font-semibold"
              size="lg"
            >
              {loading ? <Spinner size="sm" className="mr-2" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative text-center px-12">
         
          <h2 className="text-4xl font-black text-white mb-4">Start Your Journey</h2>
          <p className="text-lg text-primary-100 max-w-sm mx-auto">Access thousands of digital services and talented freelancers worldwide.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
