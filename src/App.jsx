import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import ScrollToTop from './layout/ScrollToTop';
import CountdownPopup from './components/CountdownPopup';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Membership = lazy(() => import('./pages/Membership'));
const Committee = lazy(() => import('./pages/Committee'));
const Events = lazy(() => import('./pages/Events'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading fallback spinner for code-split pages
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-4 border-[#123E87]/20 border-t-[#123E87] rounded-full animate-spin" />
    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Page...</span>
  </div>
);

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastTimeoutId, setToastTimeoutId] = useState(null);

  const showToast = (message) => {
    // Clear any active timeout
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    
    setToastMessage(message);
    
    const timeoutId = setTimeout(() => {
      setToastMessage('');
    }, 4000);
    setToastTimeoutId(timeoutId);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-gray-800 relative">
        {/* Scroll Reset & Sticky Navbar */}
        <ScrollToTop />
        <Navbar />

        {/* Main Content Router */}
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home onShowToast={showToast} />} />
              <Route path="/about" element={<About />} />
              <Route path="/membership" element={<Membership onShowToast={showToast} />} />
              <Route path="/committee" element={<Committee />} />
              <Route path="/events" element={<Events onShowToast={showToast} />} />
              <Route path="/contact" element={<Contact onShowToast={showToast} />} />
              <Route path="/admin" element={<AdminLogin onShowToast={showToast} />} />
              <Route path="/admin/dashboard" element={<AdminDashboard onShowToast={showToast} />} />
              <Route path="*" element={<Home onShowToast={showToast} />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Footer & Floating Countdown Timer */}
        <Footer onShowToast={showToast} />
        <CountdownPopup />

        {/* Global custom toast notification portal */}
        {toastMessage && (
          <div className="custom-toast-container pointer-events-none">
            <div className="bg-[#0A2F6B] text-white py-4 px-6 rounded-xl shadow-2xl border-l-4 border-[#C89B3C] flex items-center gap-3 animate-fadeIn pointer-events-auto max-w-sm">
              <span className="text-[#C89B3C] text-base font-bold flex-shrink-0">ⓘ</span>
              <span className="text-[13.5px] font-bold text-left">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
