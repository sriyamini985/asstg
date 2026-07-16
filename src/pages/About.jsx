import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  Scale, 
  Users, 
  Award,
  Milestone,
  Target,
  Eye
} from 'lucide-react';
import { aimsAndObjectives, coreValues } from '../data/moa';
import aboutVisual from '../assets/images/about_visual.png';
import MedicalPageBackground from '../components/MedicalPageBackground';


const pageTransition = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 } }
};

const cardTransition = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function About() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'graduation-cap':
        return <GraduationCap className="w-6 h-6" />;
      case 'chalkboard-user':
        return <BookOpen className="w-6 h-6" />;
      case 'hands-holding-child':
        return <ShieldCheck className="w-6 h-6" />;
      case 'magnifying-glass-chart':
        return <Search className="w-6 h-6" />;
      case 'scale-balanced':
        return <Scale className="w-6 h-6" />;
      case 'users-rectangle':
        return <Users className="w-6 h-6" />;
      case 'award':
        return <Award className="w-6 h-6" />;
      default:
        return <Milestone className="w-6 h-6" />;
    }
  };

  return (
    <div className="relative min-h-screen text-gray-800 font-sans">
      <MedicalPageBackground variant="about" />
      
      {/* ── Page Header / Hero ── */}
      <section className="page-hero text-white text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em] block mb-3">About Our Society</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans">Who We Are</h1>
            <div className="w-12 h-1 bg-[#D4A53A] mx-auto mt-4 rounded-full" />
            <p className="text-gray-300 text-[14.5px] mt-4 max-w-xl mx-auto font-medium leading-relaxed">
              Association of Spine Surgeons of Telangana is a premier state-level medical organization representing orthopedic spine specialists.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div 
        variants={pageTransition}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto px-6 py-16 relative z-10"
      >
        
        {/* ── Main Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              variants={cardTransition}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-[5/6] max-h-[360px] sm:max-h-none w-full"
            >
              <img 
                src={aboutVisual} 
                alt="ASST Academic Workspace" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0a2f6b]/10 mix-blend-multiply" />
              
              {/* SVG Blueprint lines overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 550" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 35,45 L 465,45 L 465,505 L 35,505 Z" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
                <path d="M 80,80 L 250,30 L 420,80 L 420,470 L 250,520 L 80,470 Z" stroke="rgba(18, 62, 135, 0.2)" strokeWidth="1.2" strokeDasharray="4,4" />
                <polygon points="60,120 85,105 110,120 110,145 85,160 60,145" stroke="rgba(212, 165, 90, 0.3)" strokeWidth="1.2" fill="none" />
                <line x1="85" y1="105" x2="85" y2="85" stroke="rgba(212, 165, 90, 0.3)" strokeWidth="1.2" />
                <circle cx="85" cy="85" r="2.5" fill="#D4A53A" />
                <circle cx="250" cy="30" r="5" fill="#D4A53A" />
                <circle cx="80" cy="80" r="4" fill="#123E87" />
                <circle cx="420" cy="80" r="4" fill="#123E87" />
                <circle cx="420" cy="470" r="4.5" fill="#D4A53A" />
                <circle cx="250" cy="520" r="5" fill="#123E87" />
                <circle cx="80" cy="470" r="4.5" fill="#D4A53A" />
              </svg>
            </motion.div>
            
            {/* Floating badges */}
            <div className="absolute top-8 left-2 sm:-left-4 bg-white/95 backdrop-blur-md border border-blue-50 py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2 hover:-translate-y-1 transition-transform">
              <span className="bg-[#D4A53A]/15 text-[#D4A53A] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
              <span className="text-[13px] font-bold text-gray-700">Education & Training</span>
            </div>
            <div className="absolute bottom-8 right-2 sm:-right-4 bg-white/95 backdrop-blur-md border border-blue-50 py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2 hover:-translate-y-1 transition-transform">
              <span className="bg-[#D4A53A]/15 text-[#D4A53A] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
              <span className="text-[13px] font-bold text-gray-700">Research & Collaboration</span>
            </div>
          </div>

          {/* Description Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.20em]">Association of Spine Surgeons of Telangana</span>
            <h2 className="text-[#0d2d6b] text-3xl lg:text-4xl font-black leading-tight">
              Leading the Future of Spinal Care
            </h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed border-l-4 border-[#D4A53A] pl-4">
              Established as a dedicated society of orthopedic spine surgeons, the Association serves to foster clinical safety, academic excellence, ethical surgical practice, and patient-centric spine care throughout the state of Telangana.
            </p>
            <p className="text-gray-500 text-[14.5px] leading-relaxed">
              We organize educational CMEs, live surgical workshops, clinical research activities, and patient awareness campaigns. Our focus is to ensure the highest standards of safety, quality, and ethics in spine surgery.
            </p>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="premium-card p-6 flex items-start gap-4 border-l-4 border-l-[#123E87] bg-gradient-to-br from-white via-white to-[#123E87]/[0.02] shadow-[0_10px_30px_-10px_rgba(18,62,135,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(18,62,135,0.15)] transition-all duration-300 cursor-pointer"
              >
                <div className="icon-box-navy flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[#0d2d6b] font-black text-[16px]">Our Mission</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                    Promote excellence in spine surgery through education, ethical practice, research, collaboration, and professional development.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="premium-card p-6 flex items-start gap-4 border-l-4 border-l-[#D4A53A] bg-gradient-to-br from-white via-white to-[#D4A53A]/[0.03] shadow-[0_10px_30px_-10px_rgba(212,165,58,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(212,165,58,0.18)] transition-all duration-300 cursor-pointer"
              >
                <div className="icon-box-gold flex-shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[#0d2d6b] font-black text-[16px]">Our Vision</h3>
                  <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                    To be the leading state association in India for spine surgery training, standardizing ethical guidelines, and ensuring public patient safety.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Core Values Section ── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em]">Foundations</span>
            <h2 className="text-[#0d2d6b] text-3xl font-black mt-2">Core Values</h2>
            <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <motion.div 
                key={i} 
                variants={cardTransition}
                whileHover={{ y: -6 }}
                className="premium-card p-6 flex flex-col gap-3 text-left premium-card-gold"
              >
                <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-wider">0{i + 1}</span>
                <h3 className="text-[#0d2d6b] font-bold text-lg">{v.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Aims & Objectives Section ── */}
        <div>
          <div className="text-center mb-12">
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em]">Memorandum of Association</span>
            <h2 className="text-[#0d2d6b] text-3xl font-black mt-2">Aims & Objectives</h2>
            <div className="w-10 h-0.5 bg-[#D4A53A] mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aimsAndObjectives.map((obj, i) => (
              <motion.div 
                key={i} 
                variants={cardTransition}
                whileHover={{ y: -8, scale: 1.02 }}
                className="premium-card p-6 flex gap-4 text-left group"
              >
                <div className={`${i % 2 === 0 ? 'icon-box-navy' : 'icon-box-gold'} flex-shrink-0`}>
                  {getIcon(obj.icon)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[#0d2d6b] font-bold text-[15px] group-hover:text-[#123E87] transition-colors">{obj.title}</h3>
                  <p className="text-gray-500 text-[12.5px] leading-relaxed">{obj.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
