import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { API_BASE_URL } from '../config';
import { 
  MapPin, 
  Clock, 
  Upload, 
  Send, 
  CheckCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { scientificTimeline } from '../data/timeline';
import { sightseeingPlaces } from '../data/places';
import MedicalPageBackground from '../components/MedicalPageBackground';


// Static image imports for bundling
import imgStatue from '../assets/images/place_statue_of_equality.jpg';
import imgRamoji from '../assets/images/place_ramoji_film_city.jpg';
import imgCharminar from '../assets/images/place_charminar.png';
import imgChowmahalla from '../assets/images/place_chowmahalla_palace.jpg';
import imgFalaknuma from '../assets/images/place_falaknuma_palace.jpg';
import imgBansilalpet from '../assets/images/place_bansilalpet_stepwell.png';
import imgGolkonda from '../assets/images/place_golkonda_fort.jpg';
import imgSalarjung from '../assets/images/place_salarjung_museum.png';
import venueTajDeccan from '../assets/images/venue_taj_deccan.png';
import regQrCode from '../assets/images/registration_qr_code.jpg';
import drRaghavaDutt from '../assets/images/organizers/dr_raghava_dutt.jpg';
import drPavanKumar from '../assets/images/organizers/dr_pavan_kumar.jpg';

const placesImageMap = {
  'place_statue_of_equality.jpg': imgStatue,
  'place_ramoji_film_city.jpg': imgRamoji,
  'place_charminar.png': imgCharminar,
  'place_chowmahalla_palace.jpg': imgChowmahalla,
  'place_falaknuma_palace.jpg': imgFalaknuma,
  'place_bansilalpet_stepwell.png': imgBansilalpet,
  'place_golkonda_fort.jpg': imgGolkonda,
  'place_salarjung_museum.png': imgSalarjung
};

export default function Events({ onShowToast }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'event-welcome';

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [successDetails, setSuccessDetails] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Dr.',
    name: '',
    gender: 'Male',
    dob: '',
    qualification: '',
    institution: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    email: '',
    category: 'Consultant',
    referenceId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file extension (image format check)
      const allowedExts = ['.png', '.jpg', '.jpeg'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExts.includes(fileExt)) {
        if (onShowToast) {
          onShowToast('Only JPG, JPEG, and PNG images are allowed.');
        }
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        if (onShowToast) {
          onShowToast('File size exceeds the 5MB maximum limit.');
        }
        return;
      }
      setScreenshotFile(file);
      setScreenshotName(file.name);
    }
  };

  const handleDownloadReceipt = (details) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Top header panel
    doc.setFillColor(18, 62, 135); // ASST Navy
    doc.rect(0, 0, 210, 45, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('ASSTCON 2026', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Association of Spine Surgeons of Telangana', 20, 28);
    doc.text('Annual Conference Acknowledgement Receipt', 20, 34);

    // Content body
    doc.setTextColor(33, 43, 54);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('REGISTRATION ACKNOWLEDGEMENT', 20, 60);

    // Divider
    doc.setDrawColor(212, 165, 58); // ASST Gold
    doc.setLineWidth(0.8);
    doc.line(20, 64, 190, 64);

    // Registration info table-like structure
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);

    let y = 75;
    const items = [
      { label: 'Registration ID:', value: details.registrationId, isBoldVal: true, valColor: [18, 62, 135] },
      { label: 'Participant Name:', value: details.name || '' },
      { label: 'Category:', value: details.category || '' },
      { label: 'Amount Paid:', value: `INR ${details.fee ? details.fee.toLocaleString() : (details.category === 'Postgraduate Student' ? '1,000' : '3,000')}` },
      { label: 'UPI Transaction ID:', value: details.transactionId || '' },
      { label: 'Registration Date:', value: new Date().toLocaleDateString() },
      { label: 'Current Status:', value: 'Payment Verification Pending', isBoldVal: true, valColor: [212, 165, 58] }
    ];

    items.forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, 20, y);
      
      if (item.isBoldVal) {
        doc.setFont('helvetica', 'bold');
        if (item.valColor) {
          doc.setTextColor(item.valColor[0], item.valColor[1], item.valColor[2]);
        }
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(33, 43, 54);
      }
      
      doc.text(String(item.value), 70, y);
      doc.setTextColor(33, 43, 54); // Reset color
      y += 12;
    });

    // Footer note
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, y + 5, 190, y + 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('This is an automatically generated receipt. Official entry badge will be emailed upon verification.', 20, y + 14);

    doc.save(`asst-acknowledgement-${details.registrationId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.phone.replace(/\s+/g, '').length < 10) {
      if (onShowToast) onShowToast('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    if (!screenshotFile) {
      if (onShowToast) onShowToast('Please upload your payment screenshot.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('name', formData.name);
      data.append('gender', formData.gender);
      data.append('dob', formData.dob);
      data.append('qualification', formData.qualification);
      data.append('institution', formData.institution);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pinCode', formData.pinCode);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('category', formData.category);
      data.append('referenceId', formData.referenceId);
      data.append('screenshot', screenshotFile);

      const response = await fetch(`${API_BASE_URL}/api/registrations`, {
        method: 'POST',
        body: data
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Registration submission failed.');
      }

      setSuccessDetails(resData);
      setFormSubmitted(true);
      if (onShowToast) {
        onShowToast('Conference registration request submitted successfully!');
      }

      // Reset form
      setFormData({
        title: 'Dr.',
        name: '',
        gender: 'Male',
        dob: '',
        qualification: '',
        institution: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        phone: '',
        email: '',
        category: 'Consultant',
        referenceId: ''
      });
      setScreenshotFile(null);
      setScreenshotName('');
    } catch (error) {
      if (onShowToast) {
        onShowToast(error.message || 'Connection to server failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const menuItems = [
    { id: 'event-welcome', label: 'Welcome Message', icon: '✉️' },
    { id: 'event-details', label: 'Conference Details', icon: '📅' },
    { id: 'event-registration', label: 'Registration', icon: '📝' },
    { id: 'event-venue', label: 'Venue', icon: '📍' },
    { id: 'event-places', label: 'Places to Visit', icon: '📸' }
  ];

  return (
    <div className="relative min-h-screen text-gray-800 font-sans">
      <MedicalPageBackground variant="events" />
      
      {/* ── Page Header / Hero ── */}
      <section className="page-hero text-white text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em] block mb-3">State Conference</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans">ASSTCON 2026</h1>
            <div className="w-12 h-1 bg-[#D4A53A] mx-auto mt-4 rounded-full" />
            <p className="text-gray-300 text-[14.5px] mt-4 max-w-xl mx-auto font-medium leading-relaxed">
              1st Annual Conference of the Association of Spine Surgeons of Telangana.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main tabbed layout */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative z-10 items-start">
        
        {/* Left Column Tabs Sidebar (Sticky Navigation Panel) */}
        <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col gap-2 bg-white/80 backdrop-blur-md p-5 rounded-[24px] border border-gray-150 shadow-xl md:sticky md:top-28 z-20 transition-all duration-300">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => selectTab(item.id)}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-[14px] font-bold text-left transition-all cursor-pointer relative group ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-gray-500 hover:bg-blue-50/20 hover:text-gray-800'
              }`}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeSidebarTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#123E87] to-[#1a4fa8] border-l-4 border-[#D4A53A] rounded-xl shadow-md z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="text-base relative z-10 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Column Content Panel */}
        <div className="flex-1 bg-white border border-gray-150 p-8 sm:p-10 rounded-[24px] shadow-xl shadow-blue-900/5 text-left min-h-[500px] w-full">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Welcome Message */}
            {activeTab === 'event-welcome' && (
              <motion.div 
                key="event-welcome"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="-m-6 sm:-m-8 flex flex-col overflow-hidden bg-[#fafcff]"
              >
                {/* ── Top Curved Header Banner ── */}
                <div className="relative h-28 bg-[#07193d] overflow-hidden flex items-center justify-between px-8">
                  {/* SVG Wave curve backing */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0 H800 V60 C700 100, 600 30, 400 80 C200 130, 100 40, 0 50 Z" fill="url(#headerNavyGrad)" />
                    <path d="M0 50 C100 40, 200 130, 400 80 C600 30, 700 100, 800 60" stroke="#D4A53A" strokeWidth="3" fill="none" />
                    <defs>
                      <linearGradient id="headerNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#05122e" />
                        <stop offset="100%" stopColor="#0e2a5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Dotted gold patterns in corners */}
                  <div className="absolute top-0 right-0 w-44 h-full opacity-15 bg-[radial-gradient(#D4A53A_1.5px,transparent_1.5px)] [background-size:10px_10px]" />
                  <div className="absolute top-0 left-0 w-44 h-full opacity-15 bg-[radial-gradient(#D4A53A_1.5px,transparent_1.5px)] [background-size:10px_10px]" />
                  
                  {/* Spacer to push title right */}
                  <div className="hidden sm:block" />
                  
                  {/* Right-aligned Title */}
                  <div className="relative z-10 text-right w-full sm:w-auto mt-6">
                    <h2 className="text-white text-2xl font-black font-sans uppercase tracking-[0.2em] inline-block relative pb-1">
                      Welcome Message
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4A53A]" />
                      <span className="absolute left-[-10px] bottom-[-2.5px] w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
                    </h2>
                  </div>
                </div>

                {/* ── Letterhead Content Body ── */}
                <div className="px-8 sm:px-12 py-10 text-gray-700 text-[14.5px] leading-relaxed flex flex-col gap-6 text-justify">
                  <p className="font-bold text-[#123E87] text-[16px] text-left">Dear Colleagues,</p>
                  
                  <p>
                    It gives us immense pleasure to welcome you to ASSTCON 2026 – the 1st Annual Conference of the Association of Spine Surgeons of Telangana (ASST), scheduled to be held on 27th September 2026 at Hotel Taj Deccan, Hyderabad.
                  </p>
                  
                  <p>
                    On behalf of the Organizing Committee, we are delighted to invite you to this landmark academic gathering, which marks the beginning of a new journey for our state chapter. ASST has been established with a vision to bring together spine surgeons dedicated to excellence in spine care, education, research, and innovation.
                  </p>
                  
                  <p>
                    The scientific program of ASSTCON 2026 has been carefully designed to provide an enriching academic experience through expert lectures, video sessions, interactive case discussions, and exchange of clinical knowledge by eminent national and local faculty. This conference aims to encourage learning, inspire young surgeons, promote research, and strengthen collaboration among spine specialists while upholding the highest standards of ethical patient care.
                  </p>

                  {/* ── Organizing Team Portraits (Circular with Gold Borders) ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center items-center mt-8 py-6 border-t border-gray-100/60 max-w-xl mx-auto w-full">
                    {/* Dr. Raghava Dutt */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4A53A]/40 to-[#123E87]/20 blur-xl opacity-60" />
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-3 ring-[#D4A53A]">
                          <img
                            src={drRaghavaDutt}
                            alt="Dr. Raghava Dutt Mulkutla"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h4 className="text-[#0d2d6b] font-black text-[15.5px]">Dr. Raghava Dutt Mulkutla</h4>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-0.5">Organising Chairman</span>
                    </div>

                    {/* Dr. Pavan Kumar */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#123E87]/20 to-[#D4A53A]/20 blur-xl opacity-60" />
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-3 ring-[#D4A53A]">
                          <img
                            src={drPavanKumar}
                            alt="Dr. A Pavan Kumar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h4 className="text-[#0d2d6b] font-black text-[15.5px]">Dr. A Pavan Kumar</h4>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-0.5">Organising Secretary</span>
                    </div>
                  </div>
                </div>

                {/* ── Bottom Curved Footer Banner ── */}
                <div className="relative h-20 bg-[#07193d] overflow-hidden mt-auto">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100 H800 V40 C700 0, 600 80, 400 30 C200 -20, 100 60, 0 50 Z" fill="url(#footerNavyGrad)" />
                    <path d="M0 50 C100 60, 200 -20, 400 30 C600 80, 700 0, 800 40" stroke="#D4A53A" strokeWidth="3" fill="none" />
                    <defs>
                      <linearGradient id="footerNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#05122e" />
                        <stop offset="100%" stopColor="#0e2a5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Dotted gold patterns in corners */}
                  <div className="absolute bottom-0 right-0 w-44 h-full opacity-15 bg-[radial-gradient(#D4A53A_1.5px,transparent_1.5px)] [background-size:10px_10px]" />
                  <div className="absolute bottom-0 left-0 w-44 h-full opacity-15 bg-[radial-gradient(#D4A53A_1.5px,transparent_1.5px)] [background-size:10px_10px]" />
                </div>
              </motion.div>
            )}

            {/* Tab 2: Conference Details */}
            {activeTab === 'event-details' && (
              <motion.div 
                key="event-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-[#0d2d6b] text-2xl font-black font-sans flex items-center gap-2">
                    <span>Scientific Program Timeline</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
                  </h2>
                  <div className="flex flex-col gap-4 mt-2">
                    {scientificTimeline.map((item, idx) => (
                      <div key={idx} className="flex gap-4 border-l-2 border-blue-50 pl-4 py-2 relative group hover:border-[#D4A53A] transition-colors">
                        <div className="absolute w-3 h-3 rounded-full bg-blue-100 group-hover:bg-[#D4A53A] -left-[7px] top-4 transition-colors" />
                        <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full h-fit">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-[#0d2d6b] font-bold text-sm">{item.title}</h3>
                          <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 text-left flex flex-col gap-4">
                  <h3 className="text-[#0d2d6b] font-bold text-lg">Conference Manager Contact</h3>
                  <div className="bg-gradient-to-br from-[#f0f6ff] to-white border border-blue-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#0d2d6b] font-bold text-base">Mr. Kiran Kumar Lella</span>
                      <span className="text-gray-400 text-xs">Conference Manager, CMC</span>
                    </div>
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 font-semibold">
                      <a href="tel:+919676541985" className="hover:text-[#123E87] transition-colors flex items-center gap-1.5">
                        <span className="text-gray-400">📞</span> +91-96765 41985
                      </a>
                      <a href="mailto:kiran@cmchyd.com" className="hover:text-[#123E87] transition-colors flex items-center gap-1.5">
                        <span className="text-gray-400">✉️</span> kiran@cmchyd.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Registration */}
            {activeTab === 'event-registration' && (
              <motion.div 
                key="event-registration"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-8"
              >
                {/* Row 1: Cost & QR Code side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* Cost card - 2-row layout */}
                  <div className="md:col-span-8 premium-card p-6 flex flex-col justify-center gap-4 border border-blue-100/50 shadow-md">
                    <span className="text-[#D4A53A] text-[10px] font-bold uppercase tracking-widest text-center md:text-left mb-1">Registration Fees</span>
                    <div className="flex flex-col gap-4">
                      {/* Row 1: Consultant */}
                      <div className="flex justify-between items-center bg-[#123E87]/[0.02] border border-blue-50/50 p-4 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[#0d2d6b] font-bold text-[15px]">Consultant</span>
                          <span className="text-gray-400 text-[11px] mt-0.5">Spine Surgeons / Faculty / Delegate</span>
                        </div>
                        <span className="text-2xl font-black text-[#0d2d6b]">₹3,000</span>
                      </div>
                      
                      {/* Row 2: PG Student */}
                      <div className="flex justify-between items-center bg-[#123E87]/[0.02] border border-blue-50/50 p-4 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[#0d2d6b] font-bold text-[15px]">Postgraduate Student</span>
                          <span className="text-gray-400 text-[11px] mt-0.5">Required to upload letter from HOD</span>
                        </div>
                        <span className="text-2xl font-black text-[#0d2d6b]">₹1,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Scan & Pay QR */}
                  <div className="md:col-span-4 premium-card p-6 flex flex-col items-center justify-center gap-4 border border-blue-100/50 shadow-md">
                    <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-inner flex items-center justify-center">
                      <img src={regQrCode} alt="Registration QR Code" className="w-[120px] h-[120px] object-contain" />
                    </div>
                    <div className="flex flex-col items-center text-center gap-0.5">
                      <span className="text-[#0d2d6b] font-bold text-xs uppercase tracking-wider">Scan & Pay</span>
                      <span className="text-gray-400 text-[9.5px]">Payee: <strong className="text-gray-600">Conference Management Company</strong></span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Online Registration Submission form */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-[#0d2d6b] text-xl font-bold font-sans mb-5">Registration Submission Form</h3>

                  {formSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-xl flex flex-col items-center gap-3 text-center py-8 animate-fadeIn max-w-md mx-auto">
                      <CheckCircle className="w-12 h-12 text-emerald-600 animate-pulse" />
                      <span className="font-bold text-[16px]">Registration Submitted Successfully!</span>
                      
                      {successDetails && (
                        <div className="w-full text-left bg-white border border-emerald-100 rounded-xl p-4 my-2 text-xs flex flex-col gap-2 shadow-sm">
                          <div className="flex justify-between border-b border-gray-100 pb-1.5 font-bold text-[#123E87]">
                            <span>Registration ID:</span>
                            <span>{successDetails.registrationId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Name:</span>
                            <span className="text-gray-700">{successDetails.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="text-gray-700">{successDetails.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fee:</span>
                            <span className="text-gray-700">₹{successDetails.fee ? successDetails.fee.toLocaleString() : (successDetails.category === 'Postgraduate Student' ? '1,000' : '3,000')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Event Name:</span>
                            <span className="text-gray-700">ASSTCON 2026</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(successDetails)}
                            className="mt-3 bg-[#123E87] hover:bg-[#0d2d6b] text-white font-bold text-xs py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1.5 transition-colors border-none"
                          >
                            <FileText className="w-4 h-4" /> Download PDF Receipt
                          </button>
                        </div>
                      )}
                      
                      <span className="text-[11px] text-emerald-700/80 mt-1 max-w-xs leading-normal">
                        Our admin team will verify the payment screenshot and mail you the confirmation badge soon.
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {/* Title & Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="flex flex-col gap-1.5 sm:col-span-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
                          <select
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className="premium-input bg-white"
                          >
                            <option value="Dr.">Dr.</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Prof.">Prof.</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5 sm:col-span-3">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="Raghava Dutt"
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="raghava@example.com"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="9440602168"
                          />
                        </div>
                      </div>

                      {/* Gender & DOB */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</label>
                          <select
                            name="gender"
                            required
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="premium-input bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="premium-input"
                          />
                        </div>
                      </div>

                      {/* Qualification & Institution/Hospital */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification</label>
                          <input
                            type="text"
                            name="qualification"
                            required
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="MS, MCh (Spine)"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Institution/Hospital</label>
                          <input
                            type="text"
                            name="institution"
                            required
                            value={formData.institution}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="Udai Omni Hospitals, Hyderabad"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="Apartment, Street, Area"
                        />
                      </div>

                      {/* City, State & Pincode */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="Hyderabad"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State</label>
                          <input
                            type="text"
                            name="state"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="Telangana"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pincode</label>
                          <input
                            type="text"
                            name="pinCode"
                            required
                            value={formData.pinCode}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="500001"
                          />
                        </div>
                      </div>

                      {/* Category & Payment UPI ID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="premium-input bg-white"
                          >
                            <option value="Consultant">Consultant (₹3,000)</option>
                            <option value="Postgraduate Student">Postgraduate Student (₹1,000)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment UPI Transaction ID</label>
                          <input
                            type="text"
                            name="referenceId"
                            required
                            value={formData.referenceId}
                            onChange={handleInputChange}
                            className="premium-input"
                            placeholder="TXN987654321"
                          />
                        </div>
                      </div>

                      {/* Screenshot File Upload */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Transaction Screenshot</label>
                        <div className="border-2 border-dashed border-blue-100 hover:border-[#D4A53A] rounded-2xl p-6 text-center transition-colors relative cursor-pointer bg-[#f8fbff]/50">
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="text-[13px] font-bold text-gray-700">
                              {screenshotName || 'Click to select transaction screenshot'}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">PNG, JPG or JPEG up to 5MB</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium-navy w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Submit Registration
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab 4: Venue */}
            {activeTab === 'event-venue' && (
              <motion.div 
                key="event-venue"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-[#0d2d6b] text-2xl font-black font-sans flex items-center gap-2">
                  <span>Conference Venue</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
                </h2>
                
                <div className="rounded-2xl overflow-hidden border border-blue-50 shadow-md relative h-64 sm:h-76 w-full flex-shrink-0">
                  <img src={venueTajDeccan} alt="Taj Deccan Hotel" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white text-left">
                    <h3 className="font-black text-lg sm:text-xl">Hotel Taj Deccan</h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4A53A]" /> Banjara Hills, Main Road, Hyderabad, Telangana 500034
                    </p>
                  </div>
                </div>

                {/* Map frame */}
                <div className="border border-blue-50 rounded-2xl overflow-hidden shadow-lg shadow-blue-900/5 h-64 sm:h-80 w-full mt-4 p-2 bg-white">
                  <iframe
                    title="Taj Deccan Google Map"
                    src="https://maps.google.com/maps?q=Hotel%20Taj%20Deccan%20Banjara%20Hills%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '14px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-3 text-right">
                  <a 
                    href="https://maps.google.com/?q=Hotel+Taj+Deccan+Banjara+Hills+Hyderabad" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#123E87] hover:text-[#D4A53A] font-bold text-xs transition-colors"
                  >
                    <span>📍 Open in Google Maps App</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* Tab 5: Places to Visit */}
            {activeTab === 'event-places' && (
              <motion.div 
                key="event-places"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-[#0d2d6b] text-2xl font-black font-sans flex items-center gap-2">
                  <span>Sightseeing Attractions in Hyderabad</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
                </h2>
                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
                  Hyderabad, the capital city of Telangana, blends historic landmarks with modern attractions. Explore these scenic spots during your visit:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {sightseeingPlaces.map((place, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="premium-card overflow-hidden flex flex-col group transition-all duration-500"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative bg-gray-50">
                        <img
                          src={placesImageMap[place.image]}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07193d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="p-5 flex flex-col gap-1.5 text-left relative z-10 bg-white">
                        <h3 className="text-[#0d2d6b] font-black text-[15px] group-hover:text-[#123E87] transition-colors">{place.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed mt-1">{place.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>
    </div>
  );
}
