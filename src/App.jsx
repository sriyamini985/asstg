import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import ScrollToTop from './layout/ScrollToTop';
import CountdownPopup from './components/CountdownPopup';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Membership from './pages/Membership';
import Committee from './pages/Committee';
import Events from './pages/Events';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';


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
        </main>

        {/* Global Footer & Floating Countdown Timer */}
        <Footer onShowToast={showToast} />
        <CountdownPopup />

        {/* Global custom toast notification portal */}
        {toastMessage && (
          <div className="custom-toast-container pointer-events-none">
            <div className="bg-[#0A2F6B] text-white py-4 px-6 rounded-xl shadow-2xl border-l-4 border-[#C89B3C] flex items-center gap-3 animate-fadeIn pointer-events-auto max-w-sm mr-4">
              <span className="text-[#C89B3C] text-base font-bold flex-shrink-0">ⓘ</span>
              <span className="text-[13.5px] font-bold text-left">{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
