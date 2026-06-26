document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. SHRINKING & STICKY HEADER
    // =========================================================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // =========================================================================
    // 2. ACTIVE LINK HIGHLIGHT ON SCROLL
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const highlightNav = () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav);

    // =========================================================================
    // 3. MOBILE MENU TOGGLE
    // =========================================================================
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.navigation-menu');
    const body = document.body;
    
    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('hamburger-active');
        body.classList.toggle('no-scroll');
        mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('hamburger-active');
            body.classList.remove('no-scroll');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // =========================================================================
    // 4. COUNTDOWN TIMER (ASSTCON 2026: 27 September 2026 09:00:00)
    // =========================================================================
    const countdownDate = new Date('September 27, 2026 09:00:00').getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const d = document.getElementById('days');
        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const s = document.getElementById('seconds');
        
        if (!d || !h || !m || !s) return;
        
        if (distance < 0) {
            d.innerText = "00";
            h.innerText = "00";
            m.innerText = "00";
            s.innerText = "00";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        d.innerText = String(days).padStart(2, '0');
        h.innerText = String(hours).padStart(2, '0');
        m.innerText = String(minutes).padStart(2, '0');
        s.innerText = String(seconds).padStart(2, '0');
    };
    
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately

    // =========================================================================
    // 5. MEMBERSHIP INTERACTIVE TABS
    // =========================================================================
    const tabBtns = document.querySelectorAll('.membership-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.membership-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // =========================================================================
    // 6. EVENTS & CALENDAR FILTER
    // =========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.events-grid .event-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            eventCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 7. INTERSECTION OBSERVER FOR SCROLL REVEAL
    // =========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // Add visible class styling via inline styles to handle cases before style loads
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    // =========================================================================
    // 8. CONFERENCE DETAILS TABS (INSIDE EVENT DETAILS MODAL)
    // =========================================================================
    const detailsTabBtns = document.querySelectorAll('.details-tab-btn');
    const detailsTabContents = document.querySelectorAll('.details-tab-content');
    
    detailsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetDetailsTab = btn.getAttribute('data-details-tab');
            
            detailsTabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            detailsTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            document.getElementById(`details-${targetDetailsTab}`).classList.add('active');
        });
    });

    // Lightbox system removed

    // Close modal overlays on backdrop click
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                toggleBodyScroll(false);
            }
        });
    });
});

// =============================================================================
// 9b. PREMIUM TOAST NOTIFICATION SYSTEM
// =============================================================================
window.showToast = (message) => {
    // Check if container exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    // Create toast card
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.cssText = `
        background-color: var(--primary-color, #0A2F6B);
        color: #FFFFFF;
        padding: 1.6rem 2.4rem;
        border-radius: var(--border-radius-md, 10px);
        box-shadow: 0 10px 30px rgba(10, 47, 107, 0.2);
        font-family: var(--font-body, 'Inter', sans-serif);
        font-size: 1.4rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 1.2rem;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border-left: 4px solid var(--secondary-color, #C89B3C);
        pointer-events: auto;
    `;
    
    // Icon & content
    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--secondary-color, #C89B3C); font-size: 1.6rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    // Trigger slide-up fade-in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 50);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
};

// =============================================================================
// 10. GLOBAL MODAL CONTROLLER FUNCTIONS (ACCESSIBLE FROM INLINE HTML)
// =============================================================================
const toggleBodyScroll = (lock) => {
    if (lock) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
};

// ASSTCON 2026 Registration Modal
window.openRegistrationModal = () => {
    document.getElementById('registrationModal').classList.add('active');
    toggleBodyScroll(true);
};
window.closeRegistrationModal = () => {
    document.getElementById('registrationModal').classList.remove('active');
    toggleBodyScroll(false);
};

// Membership Application Modal
window.openMembershipFormModal = () => {
    document.getElementById('membershipModal').classList.add('active');
    toggleBodyScroll(true);
};
window.closeMembershipFormModal = () => {
    document.getElementById('membershipModal').classList.remove('active');
    toggleBodyScroll(false);
};

// Event Details (Scientific timeline) Modal
window.openEventDetailsModal = () => {
    document.getElementById('detailsModal').classList.add('active');
    toggleBodyScroll(true);
};
window.closeEventDetailsModal = () => {
    document.getElementById('detailsModal').classList.remove('active');
    toggleBodyScroll(false);
};

// About Details Modal
window.openAboutDetailsModal = () => {
    document.getElementById('aboutDetailsModal').classList.add('active');
    toggleBodyScroll(true);
};
window.closeAboutDetailsModal = () => {
    document.getElementById('aboutDetailsModal').classList.remove('active');
    toggleBodyScroll(false);
};

// Close modals on escape key press
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(modal => modal.classList.remove('active'));
        
        const lightbox = document.getElementById('lightboxModal');
        if (lightbox && lightbox.style.display === 'flex') {
            closeLightbox();
        }
        
        toggleBodyScroll(false);
    }
});

// =============================================================================
// 11. FORM HANDLERS (VALIDATION & RETURNING NOTIFICATION SUCCESS)
// =============================================================================
window.handleContactSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    // Set button loading state
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Submitting...`;
    
    setTimeout(() => {
        const successMsg = document.getElementById('contactSuccess');
        successMsg.style.display = 'flex';
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.transition = 'opacity 0.4s ease';
            successMsg.style.opacity = '1';
        }, 50);
        
        // Reset form
        form.reset();
        
        // Restore button state
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
        
        // Hide success alert after 6 seconds
        setTimeout(() => {
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 400);
        }, 6000);
    }, 1500); // 1.5s simulated delay
};

window.handleRegistrationSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById('regForm');
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Processing...`;
    
    setTimeout(() => {
        const successMsg = document.getElementById('regSuccess');
        successMsg.style.display = 'flex';
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.transition = 'opacity 0.4s ease';
            successMsg.style.opacity = '1';
        }, 50);
        
        form.reset();
        
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
        
        setTimeout(() => {
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.display = 'none';
                closeRegistrationModal();
            }, 400);
        }, 4000);
    }, 1500);
};

window.handleMembershipSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById('memForm');
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Submitting...`;
    
    setTimeout(() => {
        const successMsg = document.getElementById('memSuccess');
        successMsg.style.display = 'flex';
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.transition = 'opacity 0.4s ease';
            successMsg.style.opacity = '1';
        }, 50);
        
        form.reset();
        
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
        
        setTimeout(() => {
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.display = 'none';
                closeMembershipModal();
            }, 400);
        }, 4000);
    }, 1500);
};

// Add CSS utility class for body scroll locking dynamically
const modalScrollStyle = document.createElement("style");
modalScrollStyle.innerText = `
    body.no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(modalScrollStyle);
