/* ========================================
   LOGOS POS — Landing Page Scripts
   ======================================== */

// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import custom styles
import './style.css';
import { PRODUCTOS } from './src/config.js';

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initPricingToggle();
    initSmoothScroll();
    initNavActiveState();
    initProductSelector();
    initCardTilt();
    initMagneticButtons();
    initHeroParallax();
    initCursorGlow();
});

// ===== Scroll Animations (Intersection Observer) =====
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const navbar = document.getElementById('mainNav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===== Pricing Toggle (Monthly/Annual) =====
function initPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    const priceAmounts = document.querySelectorAll('.price-amount');
    const annualSavings = document.querySelectorAll('.annual-savings');

    if (!toggle) return;

    // Set initial state
    monthlyLabel.classList.add('active');

    toggle.addEventListener('change', () => {
        const isAnnual = toggle.checked;

        // Toggle label active state
        monthlyLabel.classList.toggle('active', !isAnnual);
        annualLabel.classList.toggle('active', isAnnual);

        // Animate price change
        priceAmounts.forEach((el) => {
            el.style.transform = 'scale(0.8)';
            el.style.opacity = '0.5';

            setTimeout(() => {
                el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
                el.style.transform = 'scale(1)';
                el.style.opacity = '1';
            }, 200);
        });

        // Toggle annual savings visibility
        annualSavings.forEach((el) => {
            el.style.display = isAnnual ? 'block' : 'none';
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });
}

// ===== 3D Card Tilt =====
function initCardTilt() {
    const cards = document.querySelectorAll('.feature-card, .pricing-card:not(.popular), .testimonial-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -7;
            const rotY = ((x - cx) / cx) * 7;

            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
            card.style.transition = 'transform 0.08s ease-out';

            // Move the top highlight with the tilt
            const before = card.querySelector(':scope > *:first-child');
            if (before) {
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                card.style.setProperty('--mx', `${glowX}%`);
                card.style.setProperty('--my', `${glowY}%`);
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

// ===== Magnetic Buttons =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-accent, .btn-outline-accent, .btn-light');

    buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            btn.style.transition = 'transform 0.1s ease-out';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

// ===== Hero Parallax =====
function initHeroParallax() {
    const hero = document.querySelector('.hero-section');
    const floatingCards = document.querySelectorAll('.floating-card');
    const orbs = document.querySelectorAll('.hero-orb');
    const mockup = document.querySelector('.hero-mockup');

    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.height / 2) / rect.height;

        floatingCards.forEach((card, i) => {
            const d = (i + 1) * 18;
            card.style.transform = `translate(${x * d}px, ${y * d}px)`;
            card.style.transition = 'transform 0.15s ease-out';
        });

        if (mockup) {
            mockup.style.transform = `perspective(1200px) rotateY(${x * -4}deg) rotateX(${y * 3}deg) translateZ(0)`;
            mockup.style.transition = 'transform 0.12s ease-out';
        }

        orbs.forEach((orb, i) => {
            const d = (i + 1) * 10;
            orb.style.transform = `translate(${x * d}px, ${y * d}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        floatingCards.forEach((card) => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s ease-out';
        });
        if (mockup) {
            mockup.style.transform = '';
            mockup.style.transition = 'transform 0.6s ease-out';
        }
        orbs.forEach((orb) => {
            orb.style.transform = '';
            orb.style.transition = 'transform 0.8s ease-out';
        });
    });
}

// ===== Cursor Glow =====
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });

    function animate() {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== Product Selector =====
function initProductSelector() {
    const buttons = document.querySelectorAll('.product-btn');
    if (!buttons.length) return;

    function applyProduct(slug) {
        const producto = PRODUCTOS[slug];
        if (!producto) return;

        // Update button states
        buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.product === slug));

        // Update feature lists in each pricing card
        const planSlugs = ['emprendedor', 'profesional', 'enterprise'];
        planSlugs.forEach(planSlug => {
            const card = document.querySelector(`[data-plan="${planSlug}"] .pricing-features`);
            if (!card) return;
            const features = producto.planes[planSlug];
            if (!features) return;

            const included = features.incluidos.map(f =>
                `<li class="included"><i class="bi bi-check-circle-fill"></i> ${f}</li>`
            ).join('');
            const excluded = features.excluidos.map(f =>
                `<li class="excluded"><i class="bi bi-x-circle"></i> ${f}</li>`
            ).join('');
            card.innerHTML = included + excluded;
        });

        // Update all CTA links to include producto param
        document.querySelectorAll('[data-plan-link]').forEach(link => {
            const plan = link.dataset.planLink;
            link.href = `/register.html?plan=${plan}&producto=${slug}`;
        });
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => applyProduct(btn.dataset.product));
    });
}

// ===== Active Nav State =====
function initNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-80px 0px 0px 0px',
        }
    );

    sections.forEach((section) => observer.observe(section));
}
