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
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('hamburger-active');
        body.classList.toggle('no-scroll');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('hamburger-active');
            body.classList.remove('no-scroll');
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
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
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
            
            detailsTabBtns.forEach(b => b.classList.remove('active'));
            detailsTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`details-${targetDetailsTab}`).classList.add('active');
        });
    });

    // =========================================================================
    // 9. LIGHTBOX GALLERY SYSTEM
    // =========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const imageContainer = document.getElementById('lightbox-image-container');
    const captionEl = document.getElementById('lightbox-caption');
    
    let currentImageIndex = 0;
    
    // Extract SVG codes from items to represent full-screen content
    const galleryContents = [];
    galleryItems.forEach(item => {
        const svgElement = item.querySelector('.gallery-svg').cloneNode(true);
        const title = item.querySelector('.overlay-title').innerText;
        const desc = item.querySelector('.overlay-desc').innerText;
        galleryContents.push({
            svgMarkup: svgElement.outerHTML,
            caption: `${title} - ${desc}`
        });
        
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-image-index'));
            openLightbox(index);
        });
    });
    
    window.openLightbox = (index) => {
        currentImageIndex = index;
        const item = galleryContents[currentImageIndex];
        imageContainer.innerHTML = item.svgMarkup;
        captionEl.innerText = item.caption;
        lightboxModal.style.display = 'flex';
        body.classList.add('no-scroll');
    };
    
    window.closeLightbox = () => {
        lightboxModal.style.display = 'none';
        body.classList.remove('no-scroll');
    };
    
    window.nextLightboxImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryContents.length;
        const item = galleryContents[currentImageIndex];
        imageContainer.innerHTML = item.svgMarkup;
        captionEl.innerText = item.caption;
    };
    
    window.prevLightboxImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryContents.length) % galleryContents.length;
        const item = galleryContents[currentImageIndex];
        imageContainer.innerHTML = item.svgMarkup;
        captionEl.innerText = item.caption;
    };
    
    // Close lightbox on clicking dark overlay background
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
});

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
    const successMsg = document.getElementById('contactSuccess');
    successMsg.style.display = 'flex';
    successMsg.style.opacity = '0';
    setTimeout(() => {
        successMsg.style.transition = 'opacity 0.4s ease';
        successMsg.style.opacity = '1';
    }, 50);
    
    // Clear fields
    document.getElementById('contactForm').reset();
    
    // Mute notification after 6 seconds
    setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 400);
    }, 6000);
};

window.handleRegistrationSubmit = (e) => {
    e.preventDefault();
    const successMsg = document.getElementById('regSuccess');
    successMsg.style.display = 'flex';
    successMsg.style.opacity = '0';
    setTimeout(() => {
        successMsg.style.transition = 'opacity 0.4s ease';
        successMsg.style.opacity = '1';
    }, 50);
    
    document.getElementById('regForm').reset();
    
    setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.display = 'none';
            closeRegistrationModal();
        }, 400);
    }, 5000);
};

window.handleMembershipSubmit = (e) => {
    e.preventDefault();
    const successMsg = document.getElementById('memSuccess');
    successMsg.style.display = 'flex';
    successMsg.style.opacity = '0';
    setTimeout(() => {
        successMsg.style.transition = 'opacity 0.4s ease';
        successMsg.style.opacity = '1';
    }, 50);
    
    document.getElementById('memForm').reset();
    
    setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.display = 'none';
            closeMembershipModal();
        }, 400);
    }, 5000);
};

// Add CSS utility class for body scroll locking dynamically
const modalScrollStyle = document.createElement("style");
modalScrollStyle.innerText = `
    body.no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(modalScrollStyle);
