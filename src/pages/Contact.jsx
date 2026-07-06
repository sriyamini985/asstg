import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import MedicalPageBackground from '../components/MedicalPageBackground';

const pageTransition = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 } }
};

const cardTransition = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function Contact({ onShowToast }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      if (onShowToast) {
        onShowToast('Contact enquiry submitted successfully!');
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => {
        setFormSubmitted(false);
      }, 4000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen text-gray-800 font-sans">
      <MedicalPageBackground variant="contact" />
      
      {/* ── Page Header / Hero ── */}
      <section className="page-hero text-white text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Get In Touch</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans">Contact Us</h1>
            <div className="w-12 h-1 bg-[#D4A53A] mx-auto mt-4 rounded-full" />
            <p className="text-gray-300 text-[14.5px] mt-4 max-w-xl mx-auto font-medium leading-relaxed">
              Have questions about membership, registrations, or abstract submissions? Reach out to us.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div 
        variants={pageTransition}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto px-6 py-12 relative z-10"
      >
        
        {/* ── Main Grid Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Address */}
            <motion.div variants={cardTransition} whileHover={{ y: -8, scale: 1.02 }} className="premium-card p-6 flex gap-4">
              <div className="icon-box-navy flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500 text-left">
                <h3 className="text-[#0d2d6b] font-bold text-[15px]">Corresponding Secretariat</h3>
                <span className="text-[#D4A53A] text-[10.5px] font-bold uppercase tracking-wider">Dr. A Pavan Kumar</span>
                <address className="not-italic leading-relaxed mt-1 text-[13px]">
                  Udai Omni Hospitals, 5-9-92/A/1,<br />
                  Chapel Road, Abids, Hyderabad, 500001
                </address>
              </div>
            </motion.div>

            {/* Conference Management */}
            <motion.div variants={cardTransition} whileHover={{ y: -8, scale: 1.02 }} className="premium-card p-6 flex gap-4">
              <div className="icon-box-gold flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500 text-left">
                <h3 className="text-[#0d2d6b] font-bold text-[15px]">Conference Secretariat (CMC)</h3>
                <span className="text-[#D4A53A] text-[10.5px] font-bold uppercase tracking-wider">Mr. Kiran Kumar Lella</span>
                <div className="flex flex-col gap-1.5 mt-1.5 text-[13px] font-semibold text-gray-700">
                  <a href="tel:+919676541985" className="hover:text-[#123E87] transition-colors flex items-center gap-2">
                    <span className="text-gray-400">📞</span> +91-9676541985
                  </a>
                  <a href="mailto:kiran@cmchyd.com" className="hover:text-[#123E87] transition-colors flex items-center gap-2">
                    <span className="text-gray-400">✉️</span> kiran@cmchyd.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email channels */}
            <motion.div variants={cardTransition} whileHover={{ y: -8, scale: 1.02 }} className="premium-card p-6 flex gap-4">
              <div className="icon-box-navy flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500 text-left">
                <h3 className="text-[#0d2d6b] font-bold text-[15px]">Official Correspondences</h3>
                <span className="text-[#D4A53A] text-[10.5px] font-bold uppercase tracking-wider">Email Channels</span>
                <div className="flex flex-col gap-1.5 mt-1.5 text-[13px] font-semibold text-[#123E87]">
                  <a href="mailto:info@asstg.in" className="hover:text-[#D4A53A] transition-colors block">
                    ✉️ info@asstg.in
                  </a>
                  <a href="mailto:secretariat@asstg.in" className="hover:text-[#D4A53A] transition-colors block">
                    ✉️ secretariat@asstg.in
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Contact Form */}
          <motion.div variants={cardTransition} className="lg:col-span-7 bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-blue-900/5">
            <h3 className="text-[#0d2d6b] text-xl font-bold font-sans mb-5 text-left flex items-center gap-2">
              <span>Send Us a Message</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A53A]" />
            </h3>

            {formSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-xl flex flex-col items-center gap-3 text-center py-12 animate-fadeIn">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
                <span className="font-bold text-[16px]">Enquiry Sent Successfully!</span>
                <span className="text-xs text-emerald-700/80 mt-1 max-w-sm leading-relaxed">
                  Thank you for writing to us. Our secretariat desk team will review and reply to your mail shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      autocomplete="name"
                      className="premium-input"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      autocomplete="email"
                      className="premium-input"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      autocomplete="tel"
                      className="premium-input"
                      placeholder="+91-98765 43210"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-subject" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      autocomplete="off"
                      className="premium-input"
                      placeholder="Membership / Registration Inquiry"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    autocomplete="off"
                    className="premium-input resize-none"
                    placeholder="Type your detailed message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium-navy w-full mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* ── Google Maps Section ── */}
        <motion.section variants={cardTransition} className="text-center">
          <div className="mb-6">
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.20em]">Location Map</span>
            <h3 className="text-[#0d2d6b] text-2xl font-black mt-1">Our Secretariat Office</h3>
            <div className="w-8 h-0.5 bg-[#D4A53A] mx-auto mt-2" />
          </div>
          <div className="premium-card rounded-3xl overflow-hidden shadow-xl h-72 sm:h-96 w-full relative z-10 bg-white/80 backdrop-blur-md p-2">
            <iframe
              title="Secretariat Google Map"
              src="https://maps.google.com/maps?q=Udai%20Omni%20Hospitals%20Abids%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '20px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-3 text-right">
            <a 
              href="https://maps.google.com/?q=Udai+Omni+Hospitals+Abids+Hyderabad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#123E87] hover:text-[#D4A53A] font-bold text-xs transition-colors"
            >
              <span>📍 Open in Google Maps App</span>
            </a>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}
