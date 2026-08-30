import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, FileText, Send, Users, Award, BookOpen, ShieldCheck, GraduationCap, Upload, QrCode, Building2, CreditCard } from 'lucide-react';
import MedicalPageBackground from '../components/MedicalPageBackground';
import { API_BASE_URL } from '../config';
import regQrCode from '../assets/images/registration_qr_code.jpg';

const cardTransition = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function Membership({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('apply');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [successDetails, setSuccessDetails] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['benefits', 'eligibility', 'apply'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const [formData, setFormData] = useState({
    membershipType: 'Life Membership',
    title: 'Dr.',
    name: '',
    dob: '',
    qualification: '',
    designation: '',
    hospital: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    nationality: 'Indian',
    email: '',
    phone: '',
    residencePhone: '',
    proposedBy: '',
    proposedByAsstNo: '',
    secondedBy: '',
    secondedByAsstNo: '',
    transactionId: '',
    specialty: 'Orthopedic Surgery',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        if (onShowToast) onShowToast('Please upload a valid image (PNG, JPG) or PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        if (onShowToast) onShowToast('File size must be under 5MB');
        return;
      }
      setScreenshotFile(file);
      setScreenshotName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!screenshotFile) {
      if (onShowToast) onShowToast('Please upload your payment confirmation screenshot.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('screenshot', screenshotFile);

      const response = await fetch(`${API_BASE_URL}/api/memberships`, {
        method: 'POST',
        body: data
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Submission failed.');
      }

      setSuccessDetails(resData);
      setFormSubmitted(true);
      if (onShowToast) {
        onShowToast('Membership application submitted successfully!');
      }

      setFormData({
        membershipType: 'Life Membership',
        title: 'Dr.',
        name: '',
        dob: '',
        qualification: '',
        designation: '',
        hospital: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        country: 'India',
        nationality: 'Indian',
        email: '',
        phone: '',
        residencePhone: '',
        proposedBy: '',
        proposedByAsstNo: '',
        secondedBy: '',
        secondedByAsstNo: '',
        transactionId: '',
        specialty: 'Orthopedic Surgery',
        message: ''
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

  const tabItems = [
    { id: 'apply', label: 'Online Application Form', icon: '📝' },
    { id: 'benefits', label: 'Member Benefits', icon: '🎁' },
    { id: 'eligibility', label: 'Eligibility & Fees', icon: '📋' }
  ];

  const currentFee = formData.membershipType === 'Associate Membership' ? 3000 : 5000;

  return (
    <div className="relative min-h-screen text-gray-800 font-sans">
      <MedicalPageBackground variant="membership" />
      
      <section className="page-hero text-white text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Join Our Community</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans">Membership Application Portal</h1>
            <div className="w-12 h-1 bg-[#D4A53A] mx-auto mt-4 rounded-full" />
            <p className="text-gray-300 text-[14.5px] mt-4 max-w-xl mx-auto font-medium leading-relaxed">
              Association of Spine Surgeons of Telangana — Official Life & Associate Membership Registration
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        <div className="flex border-b border-gray-200/60 mb-10 overflow-x-auto gap-2">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold whitespace-nowrap transition-all cursor-pointer relative ${
                activeTab === tab.id
                  ? 'text-[#123E87] tab-active'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'apply' && (
            <motion.div 
              key="apply"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-8 text-left"
            >
              <div className="bg-gradient-to-r from-[#123E87] to-[#0d2d6b] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-widest block mb-1">Official Registration</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-sans">Association of Spine Surgeons of Telangana</h2>
                  <p className="text-gray-300 text-xs mt-1">Membership Application Form & Online Payment Portal</p>
                </div>
                <a
                  href="/asst_membership_form.pdf"
                  download
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" /> Download PDF Form
                </a>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-8 rounded-2xl flex flex-col items-center gap-4 text-center py-12 animate-fadeIn max-w-2xl mx-auto shadow-xl">
                  <CheckCircle className="w-16 h-16 text-emerald-600 animate-bounce" />
                  <h3 className="font-black text-2xl text-emerald-900">Application Submitted Successfully!</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed max-w-md">
                    Thank you for applying for ASST Membership. Our Secretariat will verify your application and payment details.
                  </p>

                  {successDetails && (
                    <div className="w-full text-left bg-white border border-emerald-100 rounded-xl p-5 my-2 text-xs flex flex-col gap-2.5 shadow-sm">
                      <div className="flex justify-between border-b border-gray-100 pb-2 font-bold text-[#123E87]">
                        <span>Application Type:</span>
                        <span>{formData.membershipType || 'Life Membership'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Applicant Name:</span>
                        <span className="font-semibold text-gray-800">{formData.title} {formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-semibold text-gray-800">{formData.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500">Mobile:</span>
                        <span className="font-semibold text-gray-800">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fee Amount:</span>
                        <span className="font-extrabold text-emerald-700">₹{currentFee.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-gray-500 italic mt-2">
                    Please share a screenshot of your payment confirmation on WhatsApp to: <strong className="text-gray-700">+91 - 9440602168</strong>
                  </p>

                  <button
                    onClick={() => { setFormSubmitted(false); setSuccessDetails(null); }}
                    className="btn-premium-navy px-6 py-2.5 text-xs font-bold rounded-xl mt-4 cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-900/5">
                    <h3 className="text-[#0d2d6b] font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#123E87] text-white text-xs flex items-center justify-center font-bold">1</span>
                      <span>Select Membership Type</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label 
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          formData.membershipType === 'Life Membership'
                            ? 'border-[#123E87] bg-blue-50/40 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="membershipType"
                              value="Life Membership"
                              checked={formData.membershipType === 'Life Membership'}
                              onChange={handleInputChange}
                              className="accent-[#123E87] w-4 h-4"
                            />
                            <span className="font-bold text-base text-[#0d2d6b]">Life Membership</span>
                          </div>
                          <span className="text-xl font-black text-[#123E87]">₹5,000</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          For qualified Orthopedic / Neuro Spine Surgeons. Includes full voting & academic privileges.
                        </p>
                      </label>

                      <label 
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          formData.membershipType === 'Associate Membership'
                            ? 'border-[#D4A53A] bg-amber-50/40 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="membershipType"
                              value="Associate Membership"
                              checked={formData.membershipType === 'Associate Membership'}
                              onChange={handleInputChange}
                              className="accent-[#D4A53A] w-4 h-4"
                            />
                            <span className="font-bold text-base text-[#0d2d6b]">Associate Membership</span>
                          </div>
                          <span className="text-xl font-black text-[#D4A53A]">₹3,000</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          For postgraduates, fellows & allied medical professionals. Reduced event registration fees.
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col gap-4">
                    <h3 className="text-[#0d2d6b] font-bold text-lg mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#123E87] text-white text-xs flex items-center justify-center font-bold">2</span>
                      <span>Personal & Professional Information</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-3 flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</label>
                        <select
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="premium-input bg-white"
                        >
                          <option value="Dr.">Dr.</option>
                          <option value="Prof.">Prof.</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                        </select>
                      </div>
                      <div className="sm:col-span-9 flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="e.g. Dr. Raghava Dutt"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="premium-input"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification</label>
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="MS, MCh (Spine), DNB"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="Consultant Spine Surgeon"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Institution / Hospital *</label>
                        <input
                          type="text"
                          name="hospital"
                          required
                          value={formData.hospital}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="Udai Omni Hospitals, Hyderabad"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="premium-input"
                        placeholder="Apartment, Street, Locality"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                        <input
                          type="text"
                          name="city"
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
                          value={formData.state}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="Telangana"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Postcode / Pin Code</label>
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="500001"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="surgeon@example.com"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number *</label>
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
                  </div>

                  <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col gap-4">
                    <h3 className="text-[#0d2d6b] font-bold text-lg mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#123E87] text-white text-xs flex items-center justify-center font-bold">3</span>
                      <span>Proposer & Seconder Details (Optional)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#123E87]">Proposed By (ASST Member)</span>
                        <input
                          type="text"
                          name="proposedBy"
                          value={formData.proposedBy}
                          onChange={handleInputChange}
                          className="premium-input bg-white text-xs"
                          placeholder="Proposer Name"
                        />
                        <input
                          type="text"
                          name="proposedByAsstNo"
                          value={formData.proposedByAsstNo}
                          onChange={handleInputChange}
                          className="premium-input bg-white text-xs"
                          placeholder="ASST Membership No."
                        />
                      </div>

                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#123E87]">Seconded By (ASST Member)</span>
                        <input
                          type="text"
                          name="secondedBy"
                          value={formData.secondedBy}
                          onChange={handleInputChange}
                          className="premium-input bg-white text-xs"
                          placeholder="Seconder Name"
                        />
                        <input
                          type="text"
                          name="secondedByAsstNo"
                          value={formData.secondedByAsstNo}
                          onChange={handleInputChange}
                          className="premium-input bg-white text-xs"
                          placeholder="ASST Membership No."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col gap-6">
                    <h3 className="text-[#0d2d6b] font-bold text-lg flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#123E87] text-white text-xs flex items-center justify-center font-bold">4</span>
                      <span>Payment & Bank Details</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      <div className="md:col-span-7 bg-gradient-to-br from-[#f8fafc] to-blue-50/30 p-6 rounded-xl border border-blue-100 flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[#D4A53A] text-[10px] font-bold uppercase tracking-widest block mb-2">Online Transfer Beneficiary Details</span>
                          <h4 className="text-[#0d2d6b] font-black text-base mb-3">Association of Spine Surgeons of Telangana</h4>
                          
                          <div className="flex flex-col gap-2 text-xs text-gray-700">
                            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                              <span className="text-gray-500">Account Number:</span>
                              <strong className="font-mono text-sm text-[#123E87]">052422010001401</strong>
                            </div>
                            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                              <span className="text-gray-500">Bank & Branch:</span>
                              <strong className="font-semibold">Union Bank of India (PBB - Nampally)</strong>
                            </div>
                            <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                              <span className="text-gray-500">IFSC Code:</span>
                              <strong className="font-mono text-[#123E87]">UBIN0905241</strong>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-gray-500">Fee Payable:</span>
                              <strong className="text-base text-emerald-700">₹{currentFee.toLocaleString()} ({formData.membershipType})</strong>
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-400 italic">
                          * Please send screenshot of payment confirmation on WhatsApp to: <strong>+91 - 9440602168</strong>
                        </p>
                      </div>

                      <div className="md:col-span-5 bg-amber-50/40 p-6 rounded-xl border border-amber-200/60 flex flex-col items-center justify-center gap-3 text-center">
                        <span className="text-[#0d2d6b] text-xs font-bold uppercase tracking-wider">Scan QR Code to Pay</span>
                        <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-md">
                          <img src={regQrCode} alt="ASST UPI Payment QR Code" className="w-[160px] h-[200px] object-contain rounded-lg" />
                        </div>
                        <div className="flex flex-col gap-0.5 text-[10.5px] text-gray-600">
                          <span className="font-bold text-[#123E87]">Association of Spine Surgeons of Telangana</span>
                          <span className="font-mono text-gray-500 text-[10px]">qr918143893638-1401@unionbankofindia</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">UPI / Transaction Reference ID *</label>
                        <input
                          type="text"
                          name="transactionId"
                          required
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          className="premium-input font-mono"
                          placeholder="e.g. 329482910482"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Payment Screenshot *</label>
                        <div className="relative">
                          <input
                            type="file"
                            id="mem-screenshot"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="mem-screenshot"
                            className="premium-input bg-gray-50 hover:bg-gray-100/80 flex items-center justify-between cursor-pointer"
                          >
                            <span className="truncate text-xs text-gray-600">
                              {screenshotName || 'Choose image or PDF file...'}
                            </span>
                            <Upload className="w-4 h-4 text-[#123E87] shrink-0" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-premium-navy w-full mt-2 py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
                    >
                      {loading ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Membership Application (₹{currentFee.toLocaleString()})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div 
              key="benefits"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 text-left"
            >
              <h2 className="text-[#0d2d6b] text-2xl font-black font-sans flex items-center gap-2">
                <span>Life & Associate Member Benefits</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
              </h2>
              <p className="text-gray-500 text-[14.5px] leading-relaxed mb-4">
                Joining the Association of Spine Surgeons of Telangana provides medical graduates and practicing specialists with high-value professional platforms:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Academic Networking',
                    desc: 'Connect and collaborate with leading spine surgical authorities and research academic faculties across the country.',
                    icon: <Users className="w-5 h-5" />,
                    styleClass: 'icon-box-navy'
                  },
                  {
                    title: 'Reduced Event Registration Fees',
                    desc: 'Get discounted admission to all state CMEs, hands-on surgical workshops, and annual conferences.',
                    icon: <Award className="w-5 h-5" />,
                    styleClass: 'icon-box-gold'
                  },
                  {
                    title: 'Clinical Journal Access',
                    desc: 'Stay updated with the latest clinical findings, case studies, and bioengineering techniques in regional spine surgery.',
                    icon: <BookOpen className="w-5 h-5" />,
                    styleClass: 'icon-box-navy'
                  },
                  {
                    title: 'Voter Rights',
                    desc: 'Participate actively in the general body meetings and hold voting rights to elect the Executive Committee members.',
                    icon: <ShieldCheck className="w-5 h-5" />,
                    styleClass: 'icon-box-gold'
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    variants={cardTransition}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="premium-card p-6 flex items-start gap-4"
                  >
                    <div className={`${item.styleClass} flex-shrink-0 mt-0.5`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-[#0d2d6b] font-bold text-[15px] group-hover:text-[#123E87] transition-colors">{item.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'eligibility' && (
            <motion.div 
              key="eligibility"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 text-left"
            >
              <h2 className="text-[#0d2d6b] text-2xl font-black font-sans flex items-center gap-2">
                <span>Eligibility Criteria & Fee Structure</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
              </h2>
              
              <div className="bg-white/80 backdrop-blur-md border border-blue-50/50 rounded-2xl shadow-xl shadow-blue-900/5 p-6 flex flex-col gap-4">
                <h3 className="text-[#0d2d6b] font-bold text-lg border-b border-gray-100 pb-2">Academic & Professional Requirements</h3>
                <ul className="list-disc pl-5 text-gray-500 text-[13.5px] leading-relaxed flex flex-col gap-3">
                  <li>Candidates must hold an MS or DNB in Orthopedic Surgery, or M.Ch/DNB in Neurosurgery from a recognized university.</li>
                  <li>PG degree/diploma must be registered with the State Medical Council.</li>
                  <li>Application must be proposed and seconded by two active Life Members of the society.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <motion.div 
                  variants={cardTransition}
                  initial="hidden" animate="show"
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="premium-card p-6 flex flex-col justify-between items-center text-center gap-4 premium-card-gold"
                >
                  <span className="text-[#D4A53A] text-[10px] font-bold uppercase tracking-widest">Category 01</span>
                  <div className="icon-box-gold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[#0d2d6b] text-xl font-bold">Life Membership</h4>
                    <p className="text-gray-400 text-xs mt-1">For qualified orthopedic / neuro spine surgeons</p>
                  </div>
                  <span className="text-3xl font-extrabold text-[#0d2d6b]">₹5,000</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wide font-bold">One-Time Payment</span>
                </motion.div>

                <motion.div 
                  variants={cardTransition}
                  initial="hidden" animate="show"
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="premium-card p-6 flex flex-col justify-between items-center text-center gap-4"
                >
                  <span className="text-[#123E87] text-[10px] font-bold uppercase tracking-widest">Category 02</span>
                  <div className="icon-box-navy">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[#0d2d6b] text-xl font-bold">Associate Membership</h4>
                    <p className="text-gray-400 text-xs mt-1">For postgraduates / allied medical practitioners</p>
                  </div>
                  <span className="text-3xl font-extrabold text-[#0d2d6b]">₹3,000</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wide font-bold">One-Time Payment</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
