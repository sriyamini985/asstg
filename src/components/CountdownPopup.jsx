import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Clock, ArrowRight } from 'lucide-react';

export default function CountdownPopup() {
  const [isMini, setIsMini] = useState(true);
  
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // Target Date: 27th September 2026 09:00 AM
  const countdownTarget = new Date('September 27, 2026 09:00:00').getTime();

  useEffect(() => {
    // Show popup automatically after 1.5s delay on initial load
    const timer = setTimeout(() => {
      setIsMini(false);
    }, 1500);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownTarget - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [countdownTarget]);

  const handleClose = () => {
    setIsMini(true);
  };

  const handleOpen = () => {
    setIsMini(false);
  };

  return (
    <>
      {/* Floating Main Popup Panel */}
      <div 
        className={`countdown-popup ${isMini ? 'is-mini' : ''}`}
        onMouseLeave={handleClose}
      >
        <button 
          className="popup-close-btn bg-transparent"
          onClick={handleClose} 
          aria-label="Close countdown popup"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="popup-content">
          <span className="popup-tag">ASSTCON 2026</span>
          <h4>Flagship Conference Begins In:</h4>
          <div className="popup-timer">
            <div className="timer-unit">
              <span>{timeLeft.days}</span>
              <label>Days</label>
            </div>
            <div className="timer-divider">:</div>
            <div className="timer-unit">
              <span>{timeLeft.hours}</span>
              <label>Hrs</label>
            </div>
            <div className="timer-divider">:</div>
            <div className="timer-unit">
              <span>{timeLeft.minutes}</span>
              <label>Min</label>
            </div>
            <div className="timer-divider">:</div>
            <div className="timer-unit">
              <span>{timeLeft.seconds}</span>
              <label>Sec</label>
            </div>
          </div>
          <div className="mt-2">
            <Link 
              to="/events" 
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 bg-[#c89b3c] hover:bg-[#b0842e] text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md transition-colors w-full justify-center"
            >
              View Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Mini Toggle Button */}
      <button 
        className={`countdown-mini-btn ${!isMini ? 'is-hidden' : ''}`}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        aria-label="Show countdown"
      >
        <Clock className="w-5 h-5" />
      </button>
    </>
  );
}
