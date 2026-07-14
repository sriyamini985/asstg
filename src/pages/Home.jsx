import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Award, BookOpen, Stethoscope,
  ChevronRight, Clock, Phone, Activity, Globe, ArrowRight
} from 'lucide-react';
import HomeHero from '../components/HomeHero';
import asstconLogo from '../assets/images/asstcon_logo.png';
import asstconBanner from '../assets/images/asstcon_landscape_poster.png';


// ── Countdown Timer ───────────────────────────────────────────────
function useCountdown(targetDate) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate) - new Date());
      setTime({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountBox({ val, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#123E87] text-white rounded-xl w-16 h-16 flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-blue-900/20 border border-blue-700/40">
        {String(val).padStart(2, '0')}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2">{label}</span>
    </div>
  );
}

// ── Section header component ──────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <span className={`text-[11px] font-bold tracking-[0.22em] uppercase ${light ? 'text-[#D4A53A]' : 'text-[#D4A53A]'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl lg:text-4xl font-black mt-2 mb-3 font-sans ${light ? 'text-white' : 'text-[#0d2d6b]'}`}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className={`h-px w-16 ${light ? 'bg-gradient-to-r from-transparent to-[#D4A53A]' : 'bg-gradient-to-r from-transparent to-[#123E87]'}`} />
        <div className={`w-2 h-2 rotate-45 ${light ? 'bg-[#D4A53A]' : 'bg-[#123E87]'}`} />
        <div className={`h-px w-16 ${light ? 'bg-gradient-to-l from-transparent to-[#D4A53A]' : 'bg-gradient-to-l from-transparent to-[#123E87]'}`} />
      </div>
      {subtitle && <p className={`max-w-xl mx-auto text-[15px] leading-relaxed ${light ? 'text-white/65' : 'text-gray-500'}`}>{subtitle}</p>}
    </div>
  );
}


export default function Home() {
  const countdown = useCountdown('2026-09-27T09:00:00');

  // Generate coordinates for 28 vertebrae segments along a gentle vertical spine curve (Left Edge)
  const segments = [];
  for (let i = 0; i <= 27; i++) {
    const y = 20 + i * 38;
    const x = 50 + Math.sin(y / 110) * 16;
    segments.push({ x, y });
  }

  // Generate smooth SVG Bezier path linking the vertebral canal
  let spinalCordPath = `M ${segments[0].x} ${segments[0].y}`;
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const curr = segments[i];
    const cpY1 = prev.y + 19;
    const cpY2 = curr.y - 19;
    spinalCordPath += ` C ${prev.x} ${cpY1}, ${curr.x} ${cpY2}, ${curr.x} ${curr.y}`;
  }

  return (
    <div className="relative overflow-x-hidden bg-[#edf3fd]">
      <HomeHero />

      {/* ════════════════════════════════════════════════════════════
          COUNTDOWN + ASSTCON BANNER
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-gradient-to-r from-[#030d21] via-[#123E87] to-[#0a2d6a] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left: Conference info */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="w-20 h-16 bg-white rounded-xl flex items-center justify-center p-2.5 shadow-md">
                <img src={asstconLogo} alt="ASSTCON 2026" className="max-h-full object-contain" />
              </div>
              <div>
                <div className="flex gap-2 mb-1">
                  <span className="bg-[#D4A53A]/20 text-[#D4A53A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Featured Event</span>
                </div>
                <h3 className="text-white text-xl font-black">ASSTCON 2026</h3>
                <p className="text-gray-400 text-xs">1st Annual Conference · Association of Spine Surgeons of Telangana</p>
                <div className="flex gap-4 mt-1.5">
                  <span className="flex items-center gap-1 text-gray-300 text-xs"><Calendar className="w-3 h-3" /> 27 Sept 2026</span>
                  <span className="flex items-center gap-1 text-gray-300 text-xs"><MapPin className="w-3 h-3" /> Taj Deccan, Hyderabad</span>
                </div>
              </div>
            </div>

            {/* Center: Countdown */}
            <div>
              <p className="text-center text-[10px] uppercase tracking-widest text-[#D4A53A] font-bold mb-3">Conference Begins In</p>
              <div className="flex items-end gap-3">
                <CountBox val={countdown.d} label="Days" />
                <span className="text-[#D4A53A] text-2xl font-bold pb-6">:</span>
                <CountBox val={countdown.h} label="Hrs" />
                <span className="text-[#D4A53A] text-2xl font-bold pb-6">:</span>
                <CountBox val={countdown.m} label="Min" />
                <span className="text-[#D4A53A] text-2xl font-bold pb-6">:</span>
                <CountBox val={countdown.s} label="Sec" />
              </div>
            </div>

            {/* Right: CTAs */}
            <div className="flex flex-col gap-3">
              <Link to="/events?tab=event-registration"
                className="bg-[#D4A53A] hover:bg-[#b88c2b] text-white font-bold text-sm px-7 py-3 rounded-lg shadow-md transition-all text-center flex items-center gap-2 justify-center">
                Register Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/events?tab=event-details"
                className="border border-white/25 hover:bg-white/10 text-white font-bold text-sm px-7 py-3 rounded-lg transition-all text-center">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WELCOME MESSAGE
         ════════════════════════════════════════════════════════════ */}
      {/* ── Welcome Message Section ── */}
      <section className="relative z-10 py-24 bg-[#edf3fd] overflow-hidden">
        
        {/* Subtle background rotating blueprint circle (About Us style, rendered in margins) */}
        <div className="blueprint-circle-tr absolute -top-16 -right-16 w-80 h-80 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#123E87" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="35" stroke="#D4A53A" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="50" cy="50" r="22" stroke="#123E87" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Subtle hexagons in outer margins (About Us style, 6% opacity) */}
        <div className="absolute left-8 top-28 w-28 h-28 pointer-events-none z-0 opacity-[0.06]">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="#123E87" strokeWidth="1.5" />
            <polygon points="50,22 78,38 78,62 50,78 22,62 22,38" stroke="#D4A53A" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
        </div>
        <div className="absolute right-16 bottom-36 w-20 h-20 pointer-events-none z-0 opacity-[0.06]">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" stroke="#123E87" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Tiny Molecular Network in margins (About Us style, 6% opacity) */}
        <div className="absolute left-10 bottom-44 w-24 h-24 pointer-events-none z-0 opacity-[0.06]">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="35" r="3" fill="#123E87" />
            <circle cx="75" cy="25" r="3" fill="#D4A53A" />
            <circle cx="45" cy="75" r="3" fill="#123E87" />
            <line x1="20" y1="35" x2="75" y2="25" stroke="#123E87" strokeWidth="1.0" />
            <line x1="75" y1="25" x2="45" y2="75" stroke="#123E87" strokeWidth="1.0" />
            <line x1="20" y1="35" x2="45" y2="75" stroke="#D4A53A" strokeWidth="0.8" strokeDasharray="2,2" />
          </svg>
        </div>

        {/* Left-Aligned Spine Column Watermark in margins (5% Opacity, very close to edge) */}
        <div className="spine-watermark-left">
          <svg className="w-full h-full" viewBox="0 0 200 1080" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={spinalCordPath} stroke="#123E87" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
            <path d={spinalCordPath} stroke="#D4A53A" strokeWidth="0.8" strokeDasharray="3,5" opacity="0.4" strokeLinecap="round" />
            {segments.map((pt, i) => {
              const isGold = i % 3 === 0;
              const themeColor = isGold ? '#D4A53A' : '#123E87';
              return (
                <g key={i} opacity={isGold ? 0.7 : 0.45}>
                  <path 
                    d={`M ${pt.x - 22} ${pt.y} C ${pt.x - 22} ${pt.y - 7}, ${pt.x + 22} ${pt.y - 7}, ${pt.x + 22} ${pt.y}`} 
                    stroke={themeColor} 
                    strokeWidth="1" 
                    fill="none" 
                    opacity="0.35"
                  />
                  <rect x={pt.x - 12} y={pt.y - 4} width="24" height="8" rx="3.5" fill={themeColor} />
                  <circle cx={pt.x} cy={pt.y} r="1.5" fill={isGold ? '#ffffff' : '#D4A53A'} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          
          {/* Section Header */}
          <div className="text-center mb-16 relative z-10">
            <span className="text-[#D4A53A] font-bold text-xs tracking-[0.25em] uppercase block mb-2">Welcome to ASST</span>
            <h2 className="text-[#0d2d6b] text-3xl sm:text-4xl font-black">Welcome Message</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#123E87] to-[#D4A53A] mx-auto mt-4 rounded-full" />
          </div>

          {/* Section Glass Wrapper */}
          <div className="relative bg-white border-t-[8px] border-t-[#D4A53A] border-l-2 border-r-2 border-b-2 border-[#D4A53A]/85 rounded-[32px] p-8 sm:p-12 shadow-[0_25px_50px_rgba(18,62,135,0.14)] overflow-hidden z-10">
            {/* Light blue radial glow behind the section content */}
            <div className="absolute inset-0 bg-radial-glow opacity-80 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(18, 62, 135, 0.05) 0%, transparent 75%)' }} />

            {/* Conference Banner */}
            <div className="w-full relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm mb-12 z-10">
              <img 
                src={asstconBanner} 
                alt="ASSTCON 2026 Conference Banner" 
                className="w-full h-auto block"
              />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              
              {/* Center Content Panel */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col gap-6 text-left"
              >
                {/* Subtle quotation watermark behind text */}
                <div className="absolute -left-4 -top-8 text-blue-900/[0.02] text-8xl font-serif pointer-events-none select-none">
                  “
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-1.5 self-stretch bg-gradient-to-b from-[#123E87] to-[#D4A53A] rounded-full shrink-0" />
                  <p className="text-[#123E87] leading-relaxed text-[16.5px] font-black">
                    Dear Colleagues,
                  </p>
                </div>

                <p className="text-gray-600 leading-relaxed text-[14.5px]">
                  It gives us immense pleasure to welcome you to <span className="text-[#123E87] font-semibold">ASSTCON 2026</span> – the 1st Annual Conference of the Association of Spine Surgeons of Telangana (ASST), scheduled to be held on 27th September 2026 at Hotel Taj Deccan, Hyderabad.
                </p>
                
                <p className="text-gray-600 leading-relaxed text-[14.5px]">
                  On behalf of the Organizing Committee, we are delighted to invite you to this landmark academic gathering, which marks the beginning of a new journey for our state chapter. ASST has been established with a vision to bring together spine surgeons dedicated to excellence in spine care, education, research, and innovation.
                </p>
                
                <p className="text-gray-600 leading-relaxed text-[14.5px]">
                  The scientific program of ASSTCON 2026 has been carefully designed to provide an enriching academic experience through expert lectures, video sessions, interactive case discussions, and exchange of clinical knowledge by eminent national and local faculty. This conference aims to encourage learning, inspire young surgeons, promote research, and strengthen collaboration among spine specialists while upholding the highest standards of ethical patient care.
                </p>

                <p className="text-gray-600 leading-relaxed text-[14.5px]">
                  We warmly welcome all delegates, faculty members, and friends to the beautiful city of Hyderabad, the City of Pearls. We invite you to experience its magnificent forts, palaces, museums, vibrant shopping destinations, and the rich cultural heritage of the historic City of Nizams.
                </p>

                <p className="text-gray-600 leading-relaxed text-[14.5px]">
                  We look forward to your enthusiastic participation and support in making the first ASST annual conference a memorable and successful event.
                </p>

                <p className="text-[#123E87] leading-relaxed text-[15px] font-bold">
                  Together, let us advance spine care through excellence, education, and innovation.
                </p>

                <div className="mt-2 pt-4 border-t border-gray-100/80">
                  <p className="text-gray-600 text-[14px] font-semibold">Warm Regards,</p>
                  <p className="text-[#123E87] text-[15.5px] font-black mt-0.5">Organising Committee, ASSTCON 2026</p>
                </div>

                <Link to="/events?tab=event-welcome"
                  className="inline-flex items-center gap-2 mt-6 text-[#123E87] font-bold text-sm border-b-2 border-[#D4A53A] pb-0.5 hover:text-[#D4A53A] transition-colors w-fit">
                  View Welcome Tab <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CONFERENCE HIGHLIGHTS — dark navy section
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #030d21 0%, #123E87 52%, #0a1e4a 100%)' }}>

        {/* Subtle bg texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,165,58,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,165,58,0.04) 0%, transparent 50%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <SectionHeader eyebrow="ASSTCON 2026" title="Conference Highlights" light />

          {/* Featured pre-conference card */}
          <div className="bg-[#D4A53A]/10 border border-[#D4A53A]/35 rounded-2xl p-7 mb-6 flex gap-6 items-start">
            <div className="bg-[#D4A53A] rounded-xl p-4 text-center shrink-0 min-w-[80px]">
              <span className="block text-3xl font-black text-[#0a1628] leading-none">27</span>
              <span className="block text-[10px] font-bold tracking-widest uppercase text-[#0a1628] mt-1">Sept 2026</span>
            </div>
            <div className="text-left">
              <span className="inline-block bg-[#D4A53A]/15 border border-[#D4A53A]/45 text-[#D4A53A] text-[10px] tracking-[0.18em] uppercase font-bold px-3 py-1 rounded mb-3">
                Pre-Conference Workshop
              </span>
              <h3 className="text-white text-lg font-bold leading-snug mb-1.5">
                Hands-On Workshop on Spine Surgical Techniques
              </h3>
              <p className="text-white/50 text-[13px]">
                Using Spine Models & Simulators &nbsp;·&nbsp; 27th September 2026 &nbsp;·&nbsp; Taj Deccan, Hyderabad
              </p>
            </div>
          </div>

          {/* 3 highlight cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Activity className="w-5 h-5" />,
                title: 'Live Surgery & Case-Based Learning',
                desc: 'Observe live surgical procedures and engage with immersive case-based learning with real-time expert commentary.',
              },
              {
                icon: <Stethoscope className="w-5 h-5" />,
                title: 'Plenary Sessions',
                desc: 'Cutting-edge advances in spinal surgery, endoscopic techniques, and minimally invasive spine procedures.',
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: 'Expert Panel Discussions',
                desc: 'National and international faculty-led panels covering clinical challenges, outcomes, and future directions.',
              },
            ].map((c) => (
              <div key={c.title}
                className="relative bg-white/[0.03] border border-white/[0.09] rounded-2xl p-6 overflow-hidden group hover:border-[#D4A53A]/40 transition-all duration-300 hover:-translate-y-1.5 text-left">
                {/* Gold bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4A53A] to-transparent" />
                <div className="w-10 h-10 rounded-lg bg-[#D4A53A]/12 flex items-center justify-center text-[#D4A53A] mb-4">
                  {c.icon}
                </div>
                <h4 className="text-white font-bold text-[15px] mb-2">{c.title}</h4>
                <p className="text-white/55 text-[13.5px] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHY JOIN ASST — light section
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            eyebrow="Membership"
            title="Why Join ASST?"
            subtitle="Become part of Telangana's premier spine surgery association and unlock exclusive benefits." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BookOpen className="w-5 h-5" />, title: 'CME Programs', desc: 'Access to 50+ annual CME credits through workshops, seminars, and conferences.', accent: '#123E87' },
              { icon: <Users className="w-5 h-5" />, title: 'Peer Network', desc: 'Connect with 200+ spine surgery specialists across Telangana and India.', accent: '#D4A53A' },
              { icon: <Award className="w-5 h-5" />, title: 'Research Support', desc: 'Collaborate on clinical research and present at national and international forums.', accent: '#123E87' },
              { icon: <Calendar className="w-5 h-5" />, title: 'Annual Conference', desc: 'Priority access and discounted registration for ASSTCON and all ASST events.', accent: '#D4A53A' },
              { icon: <Globe className="w-5 h-5" />, title: 'National Affiliations', desc: 'Representation at national spine bodies — AOSpine India, ISIC, and more.', accent: '#123E87' },
              { icon: <Stethoscope className="w-5 h-5" />, title: 'Clinical Guidelines', desc: 'Early access to practice guidelines, protocols, and evidence-based resources.', accent: '#D4A53A' },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
                className="premium-card bg-white p-6 cursor-pointer text-left">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${c.accent}15`, color: c.accent }}>
                  {c.icon}
                </div>
                <h4 className="text-[#0d2d6b] font-bold text-[15px] mb-2">{c.title}</h4>
                <p className="text-gray-500 text-[13.5px] leading-relaxed">{c.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-[12px] font-bold transition-colors"
                  style={{ color: c.accent }}>
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/membership"
              className="inline-flex items-center gap-2 bg-[#123E87] hover:bg-[#0d2d6b] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200">
              Become a Member <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          VENUE SECTION
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader eyebrow="Location" title="Conference Venue" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map embed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-xl shadow-blue-100/40 border border-blue-100 aspect-[4/3] bg-white p-2">
              <iframe
                title="Taj Deccan Hyderabad"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.6043305278!2d78.45271537469664!3d17.429782283469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb974e0ad2e4a3%3A0x4b28c6e77d7b7bba!2sTaj%20Deccan%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1688000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0, borderRadius: '12px' }} allowFullScreen loading="lazy"
              />
            </motion.div>

            {/* Venue details */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}>
              <div className="inline-flex items-center gap-1.5 bg-[#D4A53A]/10 text-[#D4A53A] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                <MapPin className="w-3 h-3" /> Hyderabad
              </div>
              <h3 className="text-[#0d2d6b] text-2xl font-black mb-2">Taj Deccan</h3>
              <p className="text-gray-500 text-[14px] mb-6">Road No.1, Banjara Hills, Hyderabad, Telangana 500034</p>

              <div className="flex flex-col gap-4">
                {[
                  { icon: <Calendar className="w-4 h-4" />, label: 'Conference Date', value: '27th September 2026' },
                  { icon: <Clock className="w-4 h-4" />, label: 'Registration Opens', value: '08:00 AM onwards' },
                  { icon: <MapPin className="w-4 h-4" />, label: 'Address', value: 'Banjara Hills, Hyderabad' },
                  { icon: <Phone className="w-4 h-4" />, label: 'Contact', value: '+91 98765 43210' },
                ].map((d) => (
                  <div key={d.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#123E87]/10 flex items-center justify-center text-[#123E87] shrink-0">
                      {d.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">{d.label}</p>
                      <p className="text-[#0d2d6b] font-bold text-[14px]">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/events?tab=event-venue"
                className="inline-flex items-center gap-2 mt-7 bg-[#123E87] hover:bg-[#0d2d6b] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all">
                View Venue Details <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          QUICK LINKS / CTA STRIP
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-14 bg-[#123E87]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Users className="w-5 h-5" />,    label: 'Registration',  to: '/events?tab=event-registration' },
              { icon: <BookOpen className="w-5 h-5" />, label: 'Abstract',      to: '/events?tab=event-details'      },
              { icon: <MapPin className="w-5 h-5" />,   label: 'Venue',         to: '/events?tab=event-venue'        },
              { icon: <Phone className="w-5 h-5" />,    label: 'Contact Us',    to: '/contact'                       },
            ].map((l) => (
              <Link key={l.label} to={l.to}
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/25 border border-white/20 rounded-xl px-5 py-4 text-white font-bold text-sm transition-all">
                <div className="w-9 h-9 rounded-lg bg-white/15 group-hover:bg-[#D4A53A] flex items-center justify-center transition-colors">
                  {l.icon}
                </div>
                {l.label}
                <ChevronRight className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
