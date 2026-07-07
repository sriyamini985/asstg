import React from 'react';
import { Link } from 'react-router-dom';
import asstconLogo from '../assets/images/asstcon_logo.png';
import cmcLogo from '../assets/images/cmc_logo.png';

export default function Footer({ onShowToast }) {
  const handleToast = (msg) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      alert(msg);
    }
  };

  return (
    <footer className="bg-[#030d21] text-gray-400 border-t border-[#0d2147] relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Event Details & Socials */}
        <div className="flex flex-col gap-6">
          <div className="w-48">
            <img src={asstconLogo} alt="ASSTCON 2026 Logo" className="w-full h-auto object-contain" />
          </div>
          <div className="flex flex-col gap-4 text-[14.5px] leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="text-[#c89b3c] mt-1">📅</span>
              <span>27th September 2026</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#c89b3c] mt-1">📍</span>
              <span>Hotel Taj Deccan,<br />Banjara Hills, Hyderabad</span>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button 
              onClick={() => handleToast('ASST social media channels will be launched soon.')}
              className="w-10 h-10 rounded-full border border-[#0d2147] hover:border-[#c89b3c] hover:text-[#c89b3c] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Facebook"
            >
              🌐
            </button>
            <button 
              onClick={() => handleToast('ASST LinkedIn professional network will be launched soon.')}
              className="w-10 h-10 rounded-full border border-[#0d2147] hover:border-[#c89b3c] hover:text-[#c89b3c] flex items-center justify-center transition-all cursor-pointer"
              aria-label="LinkedIn"
            >
              🔗
            </button>
            <button 
              onClick={() => handleToast('ASST Instagram channel will be launched soon.')}
              className="w-10 h-10 rounded-full border border-[#0d2147] hover:border-[#c89b3c] hover:text-[#c89b3c] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Instagram"
            >
              📸
            </button>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-[16.5px] font-bold tracking-wider uppercase border-b border-[#0d2147] pb-2">Quick Links</h4>
          <ul className="flex flex-col gap-3.5 text-[14.5px]">
            <li>
              <Link to="/events?tab=event-details" className="hover:text-[#c89b3c] transition-colors">Program</Link>
            </li>
            <li>
              <Link to="/committee" className="hover:text-[#c89b3c] transition-colors">Committee</Link>
            </li>
            <li>
              <Link to="/events?tab=event-registration" className="hover:text-[#c89b3c] transition-colors">Registration</Link>
            </li>
            <li>
              <button 
                onClick={() => handleToast('Abstract submission portal will open in July 2026.')} 
                className="hover:text-[#c89b3c] transition-colors bg-transparent border-none p-0 cursor-pointer text-left font-normal"
              >
                Abstract Submission
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Secretariat */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-[16.5px] font-bold tracking-wider uppercase border-b border-[#0d2147] pb-2">Secretariat</h4>
          <div className="flex flex-col gap-3 text-[14.5px]">
            <span className="text-[#c89b3c] text-xs font-semibold uppercase tracking-wider">Corresponding Address</span>
            <address className="not-italic leading-relaxed">
              <strong>Dr. A Pavan Kumar</strong><br />
              Udai Omni Hospitals, 5-9-92/A/1,<br />
              Chapel Road, Hyderabad, 500001
            </address>
            <div className="flex flex-col gap-2 mt-2">
              <a href="tel:+919492759745" className="hover:text-[#c89b3c] transition-colors flex items-center gap-2">📞 +91-94927 59745</a>
              <a href="mailto:secretariat@asstg.in" className="hover:text-[#c89b3c] transition-colors flex items-center gap-2">✉️ secretariat@asstg.in</a>
            </div>
          </div>
        </div>

        {/* Column 4: Conference Manager */}
        <div className="flex flex-col gap-6">
          <h4 className="text-white text-[16.5px] font-bold tracking-wider uppercase border-b border-[#0d2147] pb-2">Conference Manager</h4>
          <div className="flex flex-col gap-3 text-[14.5px]">
            <div className="w-24 py-1.5 px-3 bg-white rounded flex items-center justify-center">
              <img src={cmcLogo} alt="CMC Logo" className="max-h-7 object-contain" />
            </div>
            <span className="text-[#c89b3c] text-xs font-semibold uppercase tracking-wider">CMC - Conference Management Company</span>
            <address className="not-italic leading-relaxed">
              <strong>Mr. Kiran Kumar Lella</strong><br />
              Conference Manager
            </address>
            <div className="flex flex-col gap-2 mt-1">
              <a href="tel:+919676541985" className="hover:text-[#c89b3c] transition-colors">📞 +91-96765 41985</a>
              <a href="mailto:kiran@cmchyd.com" className="hover:text-[#c89b3c] transition-colors">✉️ kiran@cmchyd.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#0d2147] bg-[#020917] py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Copyright &copy; 2026 Association of Spine Surgeons of Telangana. All Rights Reserved.</p>
          <p>Designed by <span className="text-[#c89b3c]">Association of Spine Surgeons of Telangana</span></p>
        </div>
      </div>
    </footer>
  );
}
