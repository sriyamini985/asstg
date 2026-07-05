import React from 'react';
import { motion } from 'framer-motion';
import { committeeMembers } from '../data/committee';
import MedicalPageBackground from '../components/MedicalPageBackground';


// Static image imports to ensure correct bundling in Vite
import drRaghavaDutt from '../assets/images/organizers/dr_raghava_dutt.jpg';
import drPavanKumar from '../assets/images/organizers/dr_pavan_kumar.jpg';
import drCSuresh from '../assets/images/organizers/dr_c_suresh.jpg';
import drDevanand from '../assets/images/organizers/dr_devanand.jpg';
import drRamdasMaloth from '../assets/images/organizers/dr_ramdas_maloth.jpg';
import drSatyaNarayana from '../assets/images/organizers/dr_satya_narayana.jpg';
import drSriKrishnaChaitanya from '../assets/images/organizers/dr_sri_krishna_chaitanya.jpg';
import drAbhinandan from '../assets/images/organizers/dr_abhinandan.jpg';
import drSuryaPrakash from '../assets/images/organizers/dr_surya_prakash.jpg';
import drRajuIyengar from '../assets/images/organizers/dr_raju_iyengar.jpg';

// Helper image mapper
const imageMap = {
  'dr_raghava_dutt.jpg': drRaghavaDutt,
  'dr_pavan_kumar.jpg': drPavanKumar,
  'dr_c_suresh.jpg': drCSuresh,
  'dr_devanand.jpg': drDevanand,
  'dr_ramdas_maloth.jpg': drRamdasMaloth,
  'dr_satya_narayana.jpg': drSatyaNarayana,
  'dr_sri_krishna_chaitanya.jpg': drSriKrishnaChaitanya,
  'dr_abhinandan.jpg': drAbhinandan,
  'dr_surya_prakash.jpg': drSuryaPrakash,
  'dr_raju_iyengar.jpg': drRajuIyengar
};

const pageTransition = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 } }
};

const cardTransition = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function Committee() {
  return (
    <div className="relative min-h-screen text-gray-800 font-sans">
      <MedicalPageBackground variant="committee" />
      
      {/* ── Page Header / Hero ── */}
      <section className="page-hero text-white text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D4A53A] text-xs font-bold uppercase tracking-[0.25em] block mb-3">Leadership</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-sans">Our Committee</h1>
            <div className="w-12 h-1 bg-[#D4A53A] mx-auto mt-4 rounded-full" />
            <p className="text-gray-300 text-[14.5px] mt-4 max-w-xl mx-auto font-medium leading-relaxed">
              The dedicated team of executive office bearers guiding the academic and professional initiatives of ASST.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div 
        variants={pageTransition}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 py-16 relative z-10"
      >
        {/* ── Office Bearers Section ── */}
        <div className="mb-20 text-center">
          <div className="text-center mb-16">
           <span className="text-[#D4A53A] uppercase tracking-[0.3em] text-xs font-bold">
            Leadership
           </span>

            <h2 className="mt-4 text-5xl font-black text-[#123E87]">
             Core Team
            </h2>

          <div className="w-20 h-1 bg-[#D4A53A] rounded-full mx-auto mt-5"></div>
        </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {committeeMembers.officeBearers.map((member, i) => (
              <motion.div 
                key={i} 
                variants={cardTransition}
                whileHover={{ y: -8 }}
                className="animate-profile-card flex flex-col items-center text-center group"
              >
                {/* Profile Image Container */}
                <div className="animate-profile-img-container">
                  <img
                    src={imageMap[member.image]}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Details Box */}
                <div className="pt-2 pb-2 relative z-10 flex flex-col items-center gap-2 w-full">
                  <h3 className="text-[#0d2d6b] font-black text-[17px] tracking-tight group-hover:text-[#123E87] transition-colors">{member.name}</h3>
                  <span className="inline-block text-[#D4A53A] text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 bg-[#D4A53A]/5 border border-[#D4A53A]/20 rounded-full transition-all duration-300 group-hover:bg-[#D4A53A] group-hover:text-white group-hover:border-[#D4A53A] group-hover:shadow-md group-hover:shadow-[#D4A53A]/20">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Executive Committee Section ── */}
        <div className="text-center border-t border-gray-100/60 pt-16">
          <div className="text-center my-16">
           <span className="text-[#D4A53A] uppercase tracking-[0.3em] text-xs font-bold">
            Leadership
           </span>
           <h2 className="mt-4 text-4xl font-black text-[#123E87]">
            Executive Committee
           </h2>
           <div className="w-16 h-1 bg-[#D4A53A] rounded-full mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {committeeMembers.executiveCommittee.map((member, i) => (
              <motion.div 
                key={i} 
                variants={cardTransition}
                whileHover={{ y: -8 }}
                className="animate-profile-card flex flex-col items-center text-center group"
              >
                {/* Profile Image Container */}
                <div className="animate-profile-img-container">
                  <img
                    src={imageMap[member.image]}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Details Box */}
                <div className="pt-2 pb-2 relative z-10 flex flex-col items-center gap-2 w-full">
                  <h3 className="text-[#0d2d6b] font-black text-[16px] tracking-tight group-hover:text-[#123E87] transition-colors">{member.name}</h3>
                  <span className="inline-block text-[#D4A53A] text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 bg-[#D4A53A]/5 border border-[#D4A53A]/20 rounded-full transition-all duration-300 group-hover:bg-[#D4A53A] group-hover:text-white group-hover:border-[#D4A53A] group-hover:shadow-md group-hover:shadow-[#D4A53A]/20">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
