import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import asstLogo from '../assets/images/asst_logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home',       path: '/' },
    { name: 'About Us',   path: '/about' },
    { name: 'Membership', path: '/membership' },
    { name: 'Committee',  path: '/committee' },
  ];

  const eventSubLinks = [
    { name: 'Welcome Message',   tab: 'event-welcome' },
    { name: 'Conference Details', tab: 'event-details' },
    { name: 'Registration',       tab: 'event-registration' },
    { name: 'Venue',              tab: 'event-venue' },
    { name: 'Places to Visit',    tab: 'event-places' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100]">

      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <div className="hidden lg:block bg-[#123E87] text-white text-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">
          {/* Left: address + email */}
          <div className="flex items-center gap-6 opacity-90">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              Association of Spine Surgeons of Telangana, Hyderabad
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 shrink-0" />
              info@asst.org.in
            </span>
          </div>
          {/* Right: phone */}
          <div className="flex items-center gap-1.5 font-semibold opacity-90">
            <Phone className="w-3 h-3 shrink-0" />
            +91 98765 43210
          </div>
        </div>
      </div>

      {/* ── MAIN NAV BAR ─────────────────────────────────────────── */}
      <div
        className={`w-full transition-all duration-300 border-b border-gray-100/50 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-[0_2px_30px_rgba(18,62,135,0.06)]'
            : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between gap-6">

          {/* ── Logo ────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 shrink-0 relative z-50">
            <img src={asstLogo} alt="ASST Logo" className="h-11 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-[#123E87] font-extrabold text-[15px] tracking-wide uppercase">ASST</span>
              <span className="text-[#D4A53A] text-[9.5px] font-bold tracking-widest uppercase mt-0.5">Telangana</span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">

            {/* Static links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-3 text-[13.5px] font-semibold transition-colors duration-200 rounded-sm
                  ${isActive(link.path)
                    ? 'text-[#123E87] font-bold'
                    : 'text-gray-600 hover:text-[#123E87]'
                  }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="activeNavLink"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#123E87] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Events Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-4 py-3 text-[13.5px] font-semibold transition-colors duration-200 rounded-sm bg-transparent border-none cursor-pointer
                  ${location.pathname === '/events'
                    ? 'text-[#123E87] font-bold'
                    : 'text-gray-600 hover:text-[#123E87]'
                  }`}
              >
                <span className="relative z-10">Events</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 relative z-10 ${dropdownOpen ? 'rotate-180' : ''}`} />
                {location.pathname === '/events' && (
                  <motion.div 
                    layoutId="activeNavLink"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#123E87] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              {/* Dropdown panel with high-fidelity glass animations */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full mt-1 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_12px_40px_rgba(18,62,135,0.12)] border border-gray-100/80 py-2 flex flex-col z-50"
                  >
                    {eventSubLinks.map((sub) => (
                      <Link
                        key={sub.name}
                        to={`/events?tab=${sub.tab}`}
                        className="px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-blue-50/50 hover:text-[#123E87] transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact */}
            <Link
              to="/contact"
              className={`relative px-4 py-3 text-[13.5px] font-semibold transition-colors duration-200 rounded-sm
                ${isActive('/contact')
                  ? 'text-[#123E87] font-bold'
                  : 'text-gray-600 hover:text-[#123E87]'
                }`}
            >
              <span className="relative z-10">Contact Us</span>
              {isActive('/contact') && (
                <motion.div 
                  layoutId="activeNavLink"
                  className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#123E87] rounded-full z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </nav>

        {/* ── Mobile Toggle ─────────────────────────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-[#123E87] p-1.5 bg-transparent border-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl z-40 py-5 px-6 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-4">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[15px] font-semibold border-b border-gray-50 pb-3 ${
                  isActive(link.path) ? 'text-[#123E87] font-bold' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Events accordion */}
            <div className="flex flex-col border-b border-gray-50 pb-3">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between text-[15px] font-semibold text-gray-600 bg-transparent border-none text-left cursor-pointer"
              >
                <span>Events</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="flex flex-col gap-3 pl-4 mt-3 border-l-2 border-[#123E87]/20">
                  {eventSubLinks.map((sub) => (
                    <Link
                      key={sub.name}
                      to={`/events?tab=${sub.tab}`}
                      className="text-[13.5px] font-medium text-gray-500 hover:text-[#123E87] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`text-[15px] font-semibold border-b border-gray-50 pb-3 ${
                isActive('/contact') ? 'text-[#123E87] font-bold' : 'text-gray-600'
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
