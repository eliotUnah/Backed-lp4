import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';


import useLandingData from '../hooks/useLandigData'; // ✅ mismo hook que HeroSection

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const { data, loading, error } = useLandingData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return null; // evita parpadeo
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.navbar) return null;

  const { logo, navItems, botonTexto } = data.navbar;

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="navbar-content">
          <motion.div whileHover={{ scale: 1.05 }} className="logo">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="logo-icon"
            >
              <Check className="icon" />
            </motion.div>
            <span className="logo-text">{logo}</span>
          </motion.div>

          <div className="desktop-menu">
            {navItems.map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="nav-link"
                whileHover={{ scale: 1.05 }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.a>
            ))}
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              <User className="icon" /> {botonTexto}
            </motion.button>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="mobile-menu-content">
                {navItems.map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item}`}
                    className="mobile-link"
                    onClick={() => setMenuOpen(false)}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </motion.a>
                ))}
                <button
                  className="btn btn-primary w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  <User className="icon" /> {botonTexto}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

