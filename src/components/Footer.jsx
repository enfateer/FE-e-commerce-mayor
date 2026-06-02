import { Link } from "react-router-dom";
import { HiHeart } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-300 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">O</span>
              </div>
              <span className="text-xl font-bold text-white">ORVIX</span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              Premium digital marketplace connecting talented freelancers with
              clients worldwide.
            </p>
          </div>

          {/* platform */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          {/* support */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-sm">info@orvix.com</li>
              <li className="text-sm">+62 812 3456 7890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} ORVIX Digital Marketplace. By enfateer.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
