// MotoristAI Landing Page - JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ===== Smooth Scroll for Navigation =====
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Special case: # alone means scroll to top
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Header Scroll Effect =====
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
        }

        lastScroll = currentScroll;
    });

    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ===== Animate Elements on Scroll =====
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.problem-card, .feature-card, .audience-card, .pricing-card, .testimonial-card, .stat-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animation styles
    const animatedElements = document.querySelectorAll('.problem-card, .feature-card, .audience-card, .pricing-card, .testimonial-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run on scroll and on load
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // ===== Pricing Card Hover Effect =====
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            pricingCards.forEach(c => c.style.transform = 'scale(1)');
            if (!this.classList.contains('featured')) {
                this.style.transform = 'scale(1.02)';
            }
        });

        card.addEventListener('mouseleave', function () {
            pricingCards.forEach(c => {
                if (c.classList.contains('featured')) {
                    c.style.transform = 'scale(1.05)';
                } else {
                    c.style.transform = 'scale(1)';
                }
            });
        });
    });

    // ===== Counter Animation for Stats =====
    const animateCounter = (element, target, prefix = '', suffix = '') => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = prefix + target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = prefix + Math.floor(current) + suffix;
            }
        }, 30);
    };

    const statsSection = document.querySelector('.stats');
    let statsAnimated = false;

    const checkStatsVisibility = () => {
        if (statsAnimated) return;
        if (!statsSection) return;

        const sectionTop = statsSection.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();

                // Check for R$ prefix
                if (text.startsWith('R$')) {
                    const value = parseInt(text.replace('R$', '').replace(/\s/g, ''));
                    if (!isNaN(value)) {
                        animateCounter(stat, value, 'R$ ', '');
                    }
                }
                // Check for % suffix
                else if (text.endsWith('%')) {
                    const value = parseInt(text.replace('%', ''));
                    if (!isNaN(value)) {
                        animateCounter(stat, value, '', '%');
                    }
                }
                // Check for min suffix
                else if (text.includes('min')) {
                    const value = parseInt(text);
                    if (!isNaN(value)) {
                        animateCounter(stat, value, '', ' min');
                    }
                }
                // Default: just animate number
                else {
                    const value = parseInt(text);
                    if (!isNaN(value)) {
                        animateCounter(stat, value, '', '');
                    }
                }
            });
            statsAnimated = true;
        }
    };

    window.addEventListener('scroll', checkStatsVisibility);
    checkStatsVisibility();

    // ===== CTA Button Pulse Effect =====
    const ctaButtons = document.querySelectorAll('.btn-success');
    ctaButtons.forEach(btn => {
        setInterval(() => {
            btn.style.transform = 'scale(1.02)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    });

    console.log('MotoristAI Landing Page loaded successfully! 🚗');
});
