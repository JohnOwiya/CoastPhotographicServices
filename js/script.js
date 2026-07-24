'use strict';

/* ============================================================
   NAVBAR & MOBILE DROPDOWN MENU MECHANICS
============================================================ */
const navbar = document.getElementById('navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

// Create the dimmed backdrop element once, so no HTML files need editing
const navBackdrop = document.createElement('div');
navBackdrop.className = 'nav-backdrop';
document.body.appendChild(navBackdrop);

// Keep --navbar-height in sync with the real rendered navbar,
// since the logo can wrap to two lines on narrow screens
function syncNavbarHeight() {
    if (!navbar) return;
    document.documentElement.style.setProperty('--navbar-height', navbar.offsetHeight + 'px');
}
syncNavbarHeight();
window.addEventListener('resize', syncNavbarHeight);
window.addEventListener('load', syncNavbarHeight);

// Sticky navbar effect on scroll
window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Function to close the responsive menu
function closeMenu() {
    navLinks?.classList.remove('active');
    navBackdrop.classList.remove('active');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    const icon = menuBtn?.querySelector('i');
    if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
    document.body.style.overflow = '';
}

// Toggle dropdown open/close state
menuBtn?.addEventListener('click', () => {
    syncNavbarHeight();
    const isOpen = navLinks.classList.toggle('active');
    navBackdrop.classList.toggle('active', isOpen);
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Swap the hamburger icon for a close (X) icon while the menu is open
    const icon = menuBtn.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
    }
});

// Close the dropdown when tapping the dimmed backdrop
navBackdrop.addEventListener('click', closeMenu);

// Close the dropdown on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('active')) closeMenu();
});

// Close mobile dropdown smoothly on navigation link click
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* ============================================================
   HERO SLIDESHOW (CLEAN + RELIABLE)
============================================================ */
const slides = document.querySelectorAll('.hero-slideshow .slide');
const dots = document.querySelectorAll('.slide-dots .dot');

let currentSlide = 0;
let slideInterval;

function setSlide(index) {
    if (!slides.length) return;

    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
}

function startSlides() {
    slideInterval = setInterval(() => {
        setSlide(currentSlide + 1);
    }, 5500);
}

// SAFEGUARD FIX: Only loop through dots if they actually exist on the page!
if (dots.length > 0) {
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            setSlide(i);
            startSlides();
        });
    });
}

if (slides.length) startSlides();


/* ============================================================
   COUNTER ANIMATION (PREMIUM EASING)
============================================================ */
function animateCounter(el) {
    const target = Number(el.dataset.value || 0);
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);

        // Smooth ease-out cubic mathematics
        const eased = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}


/* ============================================================
   SCROLL REVEAL (GLOBAL OBSERVER)
============================================================ */
const revealItems = document.querySelectorAll('.reveal, .reveal-stagger');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealItems.forEach(el => revealObserver.observe(el));


/* ============================================================
   COUNTER OBSERVER (RUN ONCE)
============================================================ */
const counters = document.querySelectorAll('.stat-number[data-value]');

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

counters.forEach(counter => counterObserver.observe(counter));


/* ============================================================
   PORTFOLIO CATEGORY FILTER (UPDATED FOR VIDEO ENGINE)
============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.portfolio-item[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Read correct dynamic selector token ("all", "wedding", "conference", etc.)
        const filter = btn.dataset.target;

        // Active filter button state UI adjustment
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Apply display layout visibility rules toggling
        items.forEach(item => {
            const category = item.dataset.category;
            const show = filter === 'all' || category === filter;
            
            // Toggle visibility class
            item.classList.toggle('hide', !show);

            // SPECIAL SAFETY LAYER: If a video card gets filtered out, pause it instantly
            if (!show) {
                const video = item.querySelector('.portfolio-video-element');
                if (video) {
                    video.pause();
                    video.currentTime = 0; // Rewind frame
                }
            }
        });
    });
});


/* ============================================================
   ACTIVE NAVIGATION LINK STATE HIGHLIGHTING
============================================================ */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href')?.split('#')[0];

    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

/* ============================================================
   PREMIUM UNIFIED LIGHTBOX ENGINE (IMAGES + VIDEO CLIPS)
============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = document.getElementById('lightbox-target-img');
    const lightboxVideo = document.getElementById('lightbox-target-video'); // Target video element
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let activeElements = []; // Store mix of visible image or video tags
    let currentIndex = 0;

    const portfolioCards = document.querySelectorAll('.portfolio-item');
    
    if (portfolioCards.length > 0 && lightbox) {
        portfolioCards.forEach((card) => {
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', (e) => {
                // Ignore click if user clicked on specific native video controls
                if (e.target.hasAttribute('controls')) return;

                // Capture only active elements that are not hidden by category filters
                const visibleCards = Array.from(document.querySelectorAll('.portfolio-item:not(.hide)'));
                
                // Map out elements: check if video wrapper exists first, else fall back to image
                activeElements = visibleCards.map(c => {
                    const videoEl = c.querySelector('.portfolio-video-element');
                    return videoEl ? videoEl : c.querySelector('img');
                });
                
                // Find what asset lives inside the currently clicked card structure
                const targetedAsset = card.querySelector('.portfolio-video-element') || card.querySelector('img');
                currentIndex = activeElements.indexOf(targetedAsset);

                if (currentIndex === -1) return;

                updateLightboxSource();
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden'; // Freeze viewport screen shifts
            });
        });
    }

    function updateLightboxSource() {
        if (!activeElements.length || !lightboxImg || !lightboxVideo || !lightboxCaption) return;
        
        const targetAsset = activeElements[currentIndex];
        const parentCard = targetAsset.closest('.portfolio-item');
        const titleText = parentCard?.querySelector('h3')?.textContent || "Coast Photographic Focus";
        lightboxCaption.textContent = titleText;

        // Reset display frame visibility parameters
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause(); // Reset any playing buffers
        lightboxVideo.src = "";

        // CHOOSE DISPATCH PROFILE: Check if source target element is a video asset tag
        if (targetAsset.tagName.toLowerCase() === 'video') {
            // Pull path safely out of inner source child tag parameters
            const videoSrc = targetAsset.querySelector('source').getAttribute('src');
            lightboxVideo.src = videoSrc;
            lightboxVideo.style.display = 'block';
            lightboxVideo.load();
            lightboxVideo.play().catch(err => console.log("Autoplay context initialization block updated"));
        } else {
            // Standard image display behavior profile
            lightboxImg.src = targetAsset.src;
            lightboxImg.style.display = 'block';
        }
    }

    function closeLightbox() {
        lightbox?.classList.remove('show');
        if (lightboxVideo) {
            lightboxVideo.pause(); // Kill audio output instantly when modal dismissed
            lightboxVideo.src = "";
        }
        document.body.style.overflow = ''; 
    }

    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        currentIndex = (currentIndex - 1 + activeElements.length) % activeElements.length;
        updateLightboxSource();
    });

    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); 
        currentIndex = (currentIndex + 1) % activeElements.length;
        updateLightboxSource();
    });

    closeBtn?.addEventListener('click', closeLightbox);
    
    lightbox?.addEventListener('click', (e) => {
        // Dismiss only if clicking outside image/video container bounds
        if (e.target === lightbox) closeLightbox();
    });

    // Native Keyboard Controls Matrix Integration
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % activeElements.length;
            updateLightboxSource();
        }
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + activeElements.length) % activeElements.length;
            updateLightboxSource();
        }
    });

    // Swipe left/right to navigate the lightbox on touch devices
    let touchStartX = 0;
    lightbox?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox?.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        if (Math.abs(delta) < 40 || !activeElements.length) return;

        if (delta < 0) {
            currentIndex = (currentIndex + 1) % activeElements.length;
        } else {
            currentIndex = (currentIndex - 1 + activeElements.length) % activeElements.length;
        }
        updateLightboxSource();
    }, { passive: true });
});

/* ============================================================
   ASYNCHRONOUS CONTACT FORM & LIVE AJAX PHP MAILING ENGINE
============================================================ */
document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById('studio-booking-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = toast?.querySelector('.toast-icon');

    if (!bookingForm || !submitBtn) return; // Safeguard if on a different sub-page

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Intercept browser page refresh

        let isFormValid = true;
        const requiredFields = bookingForm.querySelectorAll('[required]');

        // Clear previous error states
        requiredFields.forEach(field => {
            field.classList.remove('field-error');
            if (!field.value.trim()) {
                field.classList.add('field-error');
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showToast("Please fill in all required fields cleanly.", "error");
            return;
        }

        // Email regex pattern check
        const emailField = document.getElementById('form-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField && !emailRegex.test(emailField.value.trim())) {
            emailField.classList.add('field-error');
            showToast("Please provide a valid email structure.", "error");
            return;
        }

        // Show loading visual state inside gold button
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="btn-loading-spinner"></div> Processing Request...';

        // LIVE FIX: Capture data and transmit asynchronously to contact.php
        const formData = new FormData(bookingForm);

        fetch('contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showToast("Booking Request Sent Successfully! Confirmation emails delivered.", "success");
                bookingForm.reset(); // Wipe inputs clean
            } else {
                showToast("Mailing system error encountered. Please check fields.", "error");
            }
        })
        .catch(error => {
            showToast("Network dispatch failure. Check your connection.", "error");
        })
        .finally(() => {
            // Restore button layout elements
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    });

    function showToast(message, type) {
        if (!toast || !toastMsg || !toastIcon) return;

        toastMsg.textContent = message;
        toast.className = "toast-card slide-up"; // Reset classes
        toast.classList.add(type);

        if (type === 'success') {
            toastIcon.className = "toast-icon fas fa-check-circle";
        } else {
            toastIcon.className = "toast-icon fas fa-exclamation-circle";
        }

        // Automatically slide notification down out of screen after 4 seconds
        setTimeout(() => {
            toast.classList.remove('slide-up');
        }, 4000);
    }
});

/* ============================================================
   DYNAMIC SERVICES PACKAGES CALCULATION SWITCH ENGINE
============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.pricing-toggle-btn');
    const priceElements = document.querySelectorAll('.price-amount');
    const pricingGrid = document.querySelector('.pricing-grid');

    if (toggleButtons.length === 0 || priceElements.length === 0) return;

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Do nothing if clicking already active dashboard states
            if (btn.classList.contains('active')) return;

            // Flip active styling positions on toggle track
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedTier = btn.dataset.tier;

            // Show/hide standard-only packages (Premium tier keeps only core packages)
            pricingGrid?.classList.toggle('tier-premium', selectedTier === 'premium');

            // Loop through and swap text contents with micro fade easing animations
            priceElements.forEach(price => {
                price.classList.add('fade-out');

                setTimeout(() => {
                    // Pull pricing mapping values explicitly from dataset variables
                    if (selectedTier === 'premium') {
                        price.textContent = price.dataset.premium;
                    } else {
                        price.textContent = price.dataset.standard;
                    }
                    
                    // Fade calculation items back in smoothly
                    price.classList.remove('fade-out');
                }, 200);
            });

            // Optional structural text tweaks for deep card features context
            // Scoped to .core-package only so custom packages (e.g. Photoshoot,
            // Commercial Advert Photography) keep their own unique feature text
            document.querySelectorAll('.pricing-card.core-package').forEach(card => {
                const featureText = card.querySelector('.feature-text');
                const deliveryText = card.querySelector('.feature-delivery');

                if (selectedTier === 'premium') {
                    if (featureText) featureText.textContent = "Up to 8 Hours Coverage";
                    if (deliveryText) deliveryText.textContent = "Priority 48-Hour Web Gallery";
                } else {
                    if (featureText) featureText.textContent = "Up to 4 Hours Coverage";
                    if (deliveryText) deliveryText.textContent = "5-Day Turnaround Delivery";
                }
            });
        });
    });
});
/* ============================================================
   PORTFOLIO VIDEO INTERACTION HOVER CONTROL
============================================================ */
document.addEventListener("DOMContentLoaded", function() {
    const videoCards = document.querySelectorAll('.portfolio-item');

    videoCards.forEach(card => {
        const video = card.querySelector('.portfolio-video-element');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            video.play().catch(err => console.log("Autoplay blocked until interaction"));
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // Rewinds to the first frame when mouse leaves
        });
    });
});
