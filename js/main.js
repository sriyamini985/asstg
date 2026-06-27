// =========================================================================
// ASST Website Client-Side SPA Engine
// =========================================================================

// Global modal and toast controllers (defined outside DOMContentLoaded to be globally accessible)
window.showToast = (message) => {
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
    
    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--secondary-color, #C89B3C); font-size: 1.6rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 50);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
};

const toggleBodyScroll = (lock) => {
    if (lock) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
};

window.openRegistrationModal = () => {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.add('active');
        toggleBodyScroll(true);
    }
};

window.closeRegistrationModal = () => {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.remove('active');
        toggleBodyScroll(false);
    }
};

window.openMembershipFormModal = () => {
    const modal = document.getElementById('membershipModal');
    if (modal) {
        modal.classList.add('active');
        toggleBodyScroll(true);
    }
};

window.openMembershipModal = () => {
    window.openMembershipFormModal();
};

window.closeMembershipModal = () => {
    window.closeMembershipFormModal();
};

window.closeMembershipFormModal = () => {
    const modal = document.getElementById('membershipModal');
    if (modal) {
        modal.classList.remove('active');
        toggleBodyScroll(false);
    }
};

// Global escape key handler for modals
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        activeModals.forEach(modal => modal.classList.remove('active'));
        toggleBodyScroll(false);
    }
});

// Global form submit handlers
window.handleContactSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Submitting...`;
    
    setTimeout(() => {
        const successMsg = form.querySelector('.form-success-msg') || document.getElementById('contactSuccess');
        if (successMsg) {
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.transition = 'opacity 0.4s ease';
                successMsg.style.opacity = '1';
            }, 50);
        }
        
        form.reset();
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
        
        setTimeout(() => {
            if (successMsg) {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 400);
            }
        }, 6000);
    }, 1500);
};

window.handleRegistrationSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Processing...`;
    
    setTimeout(() => {
        const successMsg = form.querySelector('.form-success-msg') || document.getElementById('regSuccess');
        if (successMsg) {
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.transition = 'opacity 0.4s ease';
                successMsg.style.opacity = '1';
            }, 50);
        }
        
        form.reset();
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
        
        setTimeout(() => {
            if (successMsg) {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                    if (form.id === 'regForm') {
                        closeRegistrationModal();
                    }
                }, 400);
            }
        }, 4000);
    }, 1500);
};

window.handleMembershipSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Submitting...`;
    
    setTimeout(() => {
        const successMsg = form.querySelector('.form-success-msg') || document.getElementById('memSuccess');
        if (successMsg) {
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.transition = 'opacity 0.4s ease';
                successMsg.style.opacity = '1';
            }, 50);
        }
        
        form.reset();
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.innerHTML = originalText;
        
        setTimeout(() => {
            if (successMsg) {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                    closeMembershipFormModal();
                }, 400);
            }
        }, 4000);
    }, 1500);
};

// =========================================================================
// MAIN RUNTIME INITIALIZATION FUNCTION
// =========================================================================
const initApp = () => {
    
    // Add CSS utility class for body scroll locking dynamically
    if (!document.getElementById('modal-scroll-lock-style')) {
        const modalScrollStyle = document.createElement("style");
        modalScrollStyle.id = "modal-scroll-lock-style";
        modalScrollStyle.innerText = `body.no-scroll { overflow: hidden; }`;
        document.head.appendChild(modalScrollStyle);
    }

    // Add Scroll Reveal animation CSS utility
    if (!document.getElementById('scroll-reveal-style')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "scroll-reveal-style";
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
    }

    // 7. INTERSECTION OBSERVER FOR SCROLL REVEAL
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
    const revealCheck = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => revealObserver.observe(el));
    };
    revealCheck();


    // 1. SHRINKING & STICKY HEADER
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

    // 2. SPA ROUTER WITH FILE PROTOCOL FALLBACK & STATE MANAGEMENT
    const routes = {
        '/': 'page-home',
        '/about': 'page-about',
        '/membership': 'page-membership',
        '/committee': 'page-committee',
        '/events': 'page-events',
        '/contact': 'page-contact'
    };

    let currentPath = '/';
    let currentSearch = '';

    // Initialize clean state from current URL on page load
    const initRouteFromLocation = () => {
        const fullUrl = window.location.href;
        try {
            const urlObj = new URL(fullUrl);
            currentPath = urlObj.pathname;
            currentSearch = urlObj.search;
            
            // Normalize path for local file protocol or root subfolders
            if (currentPath.endsWith('/index.html')) {
                currentPath = '/';
            } else {
                const pathParts = currentPath.split('/').filter(Boolean);
                const lastPart = pathParts.length ? '/' + pathParts[pathParts.length - 1] : '/';
                
                if (routes[lastPart]) {
                    currentPath = lastPart;
                } else if (currentPath !== '/') {
                    currentPath = '/';
                }
            }
        } catch (e) {
            currentPath = '/';
            currentSearch = '';
        }
    };

    window.navigateTo = (url) => {
        try {
            history.pushState(null, null, url);
        } catch (e) {
            console.warn("History pushState blocked by browser security policy (file:// protocol):", e);
        }
        
        // Parse the target URL manually to update state
        if (url.includes('?')) {
            const parts = url.split('?');
            currentPath = parts[0];
            currentSearch = '?' + parts[1];
        } else {
            currentPath = url;
            currentSearch = '';
        }
        
        // Normalize path
        if (currentPath === '/index.html' || currentPath === '') {
            currentPath = '/';
        }
        
        router();
    };

    const router = () => {
        const targetViewId = routes[currentPath] || 'page-home';
        
        // Hide all views
        document.querySelectorAll('.page-view').forEach(view => {
            view.style.display = 'none';
        });
        
        // Show target view
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            targetView.style.display = 'block';
        }
        
        // Highlight active navbar link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href) {
                const linkPath = href.split('?')[0];
                if (linkPath === currentPath) {
                    link.classList.add('active');
                }
            }
        });

        // Trigger reveal checker for the newly shown page
        setTimeout(revealCheck, 100);

        // Handle specific views logic (like events sub tabs)
        if (currentPath === '/events') {
            const params = new URLSearchParams(currentSearch);
            const tab = params.get('tab') || 'welcome';
            switchEventTab(tab);
        }

        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // Sub-tab switcher for events
    window.switchEventTab = (tabName) => {
        const subTabBtns = document.querySelectorAll('.event-tab-btn');
        const subTabPanes = document.querySelectorAll('.event-tab-pane');
        
        subTabBtns.forEach(btn => {
            const dataTab = btn.getAttribute('data-tab');
            if (dataTab === tabName || dataTab === `event-${tabName}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        subTabPanes.forEach(pane => {
            const id = pane.getAttribute('id');
            if (id === tabName || id === `event-${tabName}`) {
                pane.classList.add('active');
                pane.style.display = 'block';
            } else {
                pane.classList.remove('active');
                pane.style.display = 'none';
            }
        });
    };

    // Intercept data-link clicks
    document.body.addEventListener('click', e => {
        const target = e.target.closest('[data-link]');
        if (target) {
            e.preventDefault();
            navigateTo(target.getAttribute('href'));
            // Close mobile menu if open
            const navMenu = document.querySelector('.navigation-menu');
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('hamburger-active');
                document.body.classList.remove('no-scroll');
            }
        }
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        initRouteFromLocation();
        router();
    });

    // Initial state setup and routing on page load
    initRouteFromLocation();
    router();

    // 3. MOBILE MENU TOGGLE
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.navigation-menu');
    const body = document.body;
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('hamburger-active');
            body.classList.toggle('no-scroll');
            mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    }

    // 4. COUNTDOWN TIMER (ASSTCON 2026: 27 September 2026 09:00:00)
    const countdownDate = new Date('2026-09-27T09:00:00').getTime();
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        const d = document.getElementById('days');
        const h = document.getElementById('hours');
        const m = document.getElementById('minutes');
        const s = document.getElementById('seconds');
        
        const pd = document.getElementById('popup-days');
        const ph = document.getElementById('popup-hours');
        const pm = document.getElementById('popup-minutes');
        const ps = document.getElementById('popup-seconds');
        
        let daysStr = "00";
        let hoursStr = "00";
        let minutesStr = "00";
        let secondsStr = "00";

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            daysStr = String(days).padStart(2, '0');
            hoursStr = String(hours).padStart(2, '0');
            minutesStr = String(minutes).padStart(2, '0');
            secondsStr = String(seconds).padStart(2, '0');
        }
        
        if (d) d.innerText = daysStr;
        if (h) h.innerText = hoursStr;
        if (m) m.innerText = minutesStr;
        if (s) s.innerText = secondsStr;

        if (pd) pd.innerText = daysStr;
        if (ph) ph.innerText = hoursStr;
        if (pm) pm.innerText = minutesStr;
        if (ps) ps.innerText = secondsStr;
    };
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately

    // 5. MEMBERSHIP INTERACTIVE TABS
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
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // 6. EVENTS INNER SUB-TABS INTERACTIVE HANDLERS
    document.querySelectorAll('.event-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab').replace('event-', '');
            try {
                history.pushState(null, null, `/events?tab=${tabName}`);
            } catch (e) {
                console.warn("History pushState blocked:", e);
            }
            
            // Explicitly update state variables in case pushState was blocked
            currentPath = '/events';
            currentSearch = `?tab=${tabName}`;
            
            switchEventTab(tabName);
        });
    });


    // 8. FLOATING EVENT COUNTDOWN POPUP LOGIC
    const popup = document.getElementById('countdownPopup');
    const miniBtn = document.getElementById('countdownMiniBtn');
    if (popup && miniBtn) {
        // Show main popup automatically on website open after 1.5s
        setTimeout(() => {
            if (!popup.classList.contains('active') && !miniBtn.classList.contains('active')) {
                window.openCountdownPopup();
            }
        }, 1500);

        // Mouse hover (mouseover) on mini button triggers popup open
        miniBtn.addEventListener('mouseover', () => {
            window.openCountdownPopup();
        });

        // Mouse leaves popup collapses it back to mini button
        popup.addEventListener('mouseleave', () => {
            window.closeCountdownPopup();
        });
    }

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
};

window.selectTierAndScroll = (tier) => {
    const selectEl = document.getElementById('reg-category-inline');
    if (selectEl) {
        selectEl.value = tier;
    }
    const formRow = document.getElementById('registration-form-row');
    if (formRow) {
        formRow.scrollIntoView({ behavior: 'smooth' });
    }
};

window.openCountdownPopup = () => {
    const popup = document.getElementById('countdownPopup');
    const miniBtn = document.getElementById('countdownMiniBtn');
    if (popup && miniBtn) {
        popup.classList.add('active');
        miniBtn.classList.remove('active');
    }
};

window.closeCountdownPopup = () => {
    const popup = document.getElementById('countdownPopup');
    const miniBtn = document.getElementById('countdownMiniBtn');
    if (popup && miniBtn) {
        popup.classList.remove('active');
        miniBtn.classList.add('active');
    }
};

window.handlePopupCta = (e) => {
    window.closeCountdownPopup();
};

// =========================================================================
// RUN INITIALIZATION (BULLETPROOF EXECUTION SAFETY CHECK)
// =========================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
