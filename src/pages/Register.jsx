import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, Label, Button, Spinner } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PageMeta from '../components/PageMeta';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <PageMeta title="Register" description="Create a new ORVIX account" />
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-accent-600 via-primary-700 to-primary-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative text-center px-12">
         
          <h2 className="text-4xl font-black text-white mb-4">Join ORVIX</h2>
          <p className="text-lg text-primary-100 max-w-sm mx-auto">Create your account and start exploring premium digital services today.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <span className="text-white font-black text-lg">O</span>
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">ORVIX</span>
          </Link>

          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Create account</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" value="Full Name" className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300" />
              <TextInput
                id="name"
                type="text"
                icon={HiUser}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                sizing="lg"
              />
            </div>

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

            <div>
              <Label htmlFor="confirmPassword" value="Confirm Password" className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-300" />
              <TextInput
                id="confirmPassword"
                type="password"
                icon={HiLockClosed}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
