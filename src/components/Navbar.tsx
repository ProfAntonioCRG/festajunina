import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Flame, LogOut, User, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/programacao', label: 'Programação' },
    { path: '/barracas', label: 'Barracas' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-junina-700 hover:text-junina-600 transition-colors">
            <Flame className="w-6 h-6" />
            <span className="font-display font-bold text-xl">Festa Junina</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/admin" className="flex items-center gap-1 text-sm text-junina-600 hover:text-junina-700">
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
                <button onClick={signOut} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-sm text-junina-600 hover:text-junina-700">
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-stone-600">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-lg ${isActive(link.path) ? 'bg-junina-50 text-junina-700 font-semibold' : 'text-stone-600'}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/admin" className="block px-3 py-2 text-junina-600">Painel Admin</Link>
                <button onClick={signOut} className="block w-full text-left px-3 py-2 text-red-600">Sair</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-junina-600">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
