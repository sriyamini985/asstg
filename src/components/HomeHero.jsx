import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeHeroBackground from './spine-bg/HomeHeroBackground';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.10 }
  })
};

const NAV_H = 104; // px

export default function HomeHero() {
  return (
    <div 
      className="relative overflow-hidden w-full"
      style={{ paddingTop: NAV_H, height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Hero Background — Z-Index 0 */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <HomeHeroBackground />
      </div>

      {/* Hero Content — Z-Index 10 */}
      <div className="relative flex-1 w-full overflow-hidden" style={{ zIndex: 10 }}>
        <div className="h-full max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center">

          {/* Content left */}
          <motion.div
            className="flex flex-col justify-center z-10"
            style={{ flex: '0 0 54%', maxWidth: '54%', paddingLeft: '8%' }}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              custom={0}
              variants={fadeUp}
              className="font-black text-[#0d2d6b] leading-[1.06] tracking-tight font-sans text-left"
              style={{ fontSize: 'clamp(3.1rem, 5vw, 4.6rem)' }}
            >
              Association of<br />
              <span className="text-[#123E87]">Spine Surgeons</span><br />
              of Telangana
            </motion.h1>

            <motion.p 
              custom={1} 
              variants={fadeUp}
              className="text-gray-500 leading-relaxed font-medium mt-4 text-left"
              style={{ fontSize: 'clamp(13px, 1.3vw, 16px)', maxWidth: '440px' }}
            >
              Dedicated to advancing spine surgery through education, research, collaboration, and professional excellence.
            </motion.p>

            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap gap-3 mt-6">
              <Link to="/membership"
                className="bg-[#D4A53A] hover:bg-[#b88c2b] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                Become a Member
              </Link>
              <Link to="/events"
                className="border-2 border-[#123E87] hover:bg-[#123E87] text-[#123E87] hover:text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-all duration-200">
                Upcoming Conference
              </Link>
            </motion.div>

            <motion.div 
              custom={3} 
              variants={fadeUp}
              className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200/80"
            >
              {[
                { icon: '👥', value: '200+', label: 'Members' },
                { icon: '📅', value: '25+',  label: 'Events'  },
                { icon: '📖', value: '50+',  label: 'CMEs'    },
                { icon: '🏆', value: 'Best', label: 'Commitment' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-sm shrink-0">{s.icon}</div>
                  <div className="flex flex-col leading-tight text-left">
                    <span className="text-[#123E87] text-[15px] font-extrabold">{s.value}</span>
                    <span className="text-gray-400 text-[9.5px] uppercase tracking-wider font-semibold">{s.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT: Spine + Rings — spacer column for the background spine layer */}
          <div className="hidden lg:flex items-center justify-center h-full" style={{ flex: '0 0 48%', maxWidth: '48%' }} />
        </div>
      </div>
    </div>
  );
}
