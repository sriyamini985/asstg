import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, FileText, Send, Users, Award, BookOpen, ShieldCheck, GraduationCap } from 'lucide-react';
import MedicalPageBackground from '../components/MedicalPageBackground';
import { API_BASE_URL } from '../config';

const cardTransition = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function Membership({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('benefits');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'Orthopedic Surgery',
    hospital: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/memberships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Submission failed.');
      }

      setFormSubmitted(true);
      if (onShowToast) {
        onShowToast('Membership request submitted successfully!');
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialty: 'Orthopedic Surgery',
        hospital: '',
        message: ''
      });
    } catch (error) {
      if (onShowToast) {
        onShowToast(error.message || 'Connection to server failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    { id: 'benefits', label: 'Member Benefits', icon: '🎁' },
    { id: 'eligibility', label: 'Eligibility & Fees', icon: '📋' },
    { id: 'apply', label: 'Apply Now', icon: '📝' }
  ];

  return (
    <div className="relative min-h-screen text-gray-800 font-sans">
      <MedicalPageBackground variant="membership" />
      
      {/* ── Page Header / Hero ── */}
      <section className="page-hero text-white text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Join Our Community</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans">Membership Portal</h1>
            <div className="w-12 h-1 bg-[#D4A53A] mx-auto mt-4 rounded-full" />
            <p className="text-gray-300 text-[14.5px] mt-4 max-w-xl mx-auto font-medium leading-relaxed">
              Become a part of the leading association of spine surgeons in Telangana and access exclusive resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Tabbed Layout */}
      <section className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Tab Buttons Container */}
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

        {/* Tab content panels */}
        <AnimatePresence mode="wait">
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

          {activeTab === 'apply' && (
            <motion.div 
              key="apply"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
            >
              {/* Left: Download Offline Form */}
              <div className="md:col-span-5 bg-white border border-gray-100 p-6 rounded-2xl shadow-xl shadow-blue-900/5 flex flex-col gap-6 justify-between">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#D4A53A]/10 flex items-center justify-center text-[#D4A53A]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-[#0d2d6b] font-bold text-lg">Offline Application</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Download the official paper application form. Fill out the details, attach copies of your council registration certificates, and mail them along with your draft payment.
                  </p>
                </div>

                <a
                  href="/asst_membership_form.pdf"
                  download
                  className="btn-premium-navy w-full text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF Form
                </a>
              </div>

              {/* Right: Online request form */}
              <div className="md:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-900/5">
                <h3 className="text-[#0d2d6b] font-bold text-lg mb-5 flex items-center gap-2">
                  <span>Request Online Registration</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
                </h3>
                
                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-xl flex flex-col items-center gap-3 text-center py-10 animate-fadeIn">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                    <span className="font-bold text-[16px]">Enquiry Submitted Successfully!</span>
                    <span className="text-xs text-emerald-700/80 mt-1 max-w-sm leading-relaxed">
                      Our secretariat will contact you shortly with the application registration details and guidelines.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="Dr. John Doe"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="premium-input"
                          placeholder="+91-98765 43210"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specialty</label>
                        <select
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleInputChange}
                          className="premium-input bg-white"
                        >
                          <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                          <option value="Neurosurgery">Neurosurgery</option>
                          <option value="Allied Medical Profession">Allied Medical Profession</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hospital/Clinic Name</label>
                      <input
                        type="text"
                        name="hospital"
                        required
                        value={formData.hospital}
                        onChange={handleInputChange}
                        className="premium-input"
                        placeholder="Apollo Hospitals"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Additional Message</label>
                      <textarea
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="premium-input resize-none"
                        placeholder="Any notes or enquiries..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-premium-navy w-full mt-2 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Request
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
