/**
 * DaichiJLC Japanese Language Center
 * Main JavaScript File
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // ============================================
    // DOM Element References
    // ============================================
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const themeToggle = document.getElementById('themeToggle');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialDots = document.getElementById('testimonialDots');

    // ============================================
    // Utility Functions
    // ============================================
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const toggleMobileMenu = () => {
        const isActive = mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // ============================================
    // Dark/Light Mode Toggle
    // ============================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('daichijlc-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('daichijlc-theme', newTheme);
    };

    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('daichijlc-theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });

    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Reveal Animations
    // ============================================
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    initScrollReveal();

    // ============================================
    // Back to Top Button
    // ============================================
    const handleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', throttle(handleBackToTop, 100));

    // ============================================
    // Statistics Counter Animation
    // ============================================
    const initCounters = () => {
        const counters = document.querySelectorAll('.counter');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const startTime = performance.now();

                    const updateCounter = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function (ease-out)
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(easeOut * target);

                        counter.textContent = current.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    };

    initCounters();

    // ============================================
    // FAQ Accordion
    // ============================================
    const initFAQ = () => {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
            });
        });
    };

    initFAQ();

    // ============================================
    // Testimonials Slider
    // ============================================
    const initTestimonialsSlider = () => {
        const track = testimonialsSlider.querySelector('.testimonials-track');
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let autoSlideInterval;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            testimonialDots.appendChild(dot);
        });

        const dots = testimonialDots.querySelectorAll('.testimonial-dot');

        const getSlidesPerView = () => {
            return window.innerWidth > 768 ? 2 : 1;
        };

        const goToSlide = (index) => {
            const slidesPerView = getSlidesPerView();
            const maxIndex = totalCards - slidesPerView;

            currentIndex = Math.max(0, Math.min(index, maxIndex));

            const slideWidth = cards[0].offsetWidth + 24; // 24px gap
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const nextSlide = () => {
            const slidesPerView = getSlidesPerView();
            const maxIndex = totalCards - slidesPerView;

            if (currentIndex < maxIndex) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0);
            }
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                const slidesPerView = getSlidesPerView();
                goToSlide(totalCards - slidesPerView);
            }
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        testimonialNext.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });

        testimonialPrev.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });

        // Pause on hover
        testimonialsSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialsSlider.addEventListener('mouseleave', startAutoSlide);

        // Handle resize
        window.addEventListener('resize', debounce(() => {
            goToSlide(currentIndex);
        }, 250));

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        testimonialsSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        testimonialsSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoSlide();
        }, { passive: true });

        startAutoSlide();
    };

    initTestimonialsSlider();

    // ============================================
    // Contact Form Validation
    // ============================================
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^[\d\s\-\+\(\)]{7,20}$/;
        return phone === '' || re.test(phone);
    };

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    };

    const clearAllErrors = () => {
        contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllErrors();

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const phone = document.getElementById('contactPhone');
        const message = document.getElementById('contactMessage');

        let isValid = true;

        // Validate name
        if (name.value.trim().length < 2) {
            showError(name, 'Please enter your full name (at least 2 characters)');
            isValid = false;
        }

        // Validate email
        if (!validateEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone (optional)
        if (phone.value.trim() && !validatePhone(phone.value.trim())) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate message
        if (message.value.trim().length < 10) {
            showError(message, 'Please enter a message (at least 10 characters)');
            isValid = false;
        }

        if (isValid) {
            // Show success message
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check" aria-hidden="true"></i>';
            submitBtn.style.backgroundColor = '#2E7D32';
            submitBtn.disabled = true;

            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);

            // In a real application, you would send the form data to a server here
            console.log('Form submitted:', {
                name: name.value,
                email: email.value,
                phone: phone.value,
                course: document.getElementById('contactCourse').value,
                message: message.value
            });
        }
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });

    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    const initActiveNavLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveLink = () => {
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', throttle(updateActiveLink, 100));
    };

    initActiveNavLink();

    // ============================================
    // Hero Stats Counter (on page load)
    // ============================================
    const initHeroStats = () => {
        const heroStats = document.querySelectorAll('.hero-stats .stat-number');

        heroStats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2500;
            const startTime = performance.now();

            const updateStat = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                stat.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            // Start after a short delay for visual effect
            setTimeout(() => {
                requestAnimationFrame(updateStat);
            }, 500);
        });
    };

    // Start hero stats when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroStats);
    } else {
        initHeroStats();
    }

    // ============================================
    // Parallax Effect for Hero
    // ============================================
    const initParallax = () => {
        const heroImage = document.querySelector('.hero-image');
        if (!heroImage) return;

        const handleParallax = () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        };

        window.addEventListener('scroll', throttle(handleParallax, 16));
    };

    initParallax();

    // ============================================
    // Gallery Lightbox (Simple)
    // ============================================
    const initGallery = () => {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const overlay = item.querySelector('.gallery-overlay');
                const title = overlay ? overlay.querySelector('h4').textContent : '';

                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-overlay"></div>
                    <div class="lightbox-content">
                        <img src="${img.src}" alt="${img.alt}">
                        <h4>${title}</h4>
                        <button class="lightbox-close" aria-label="Close lightbox">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';

                // Close lightbox
                const closeLightbox = () => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                };

                lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
                lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

                // Close on escape key
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });
        });
    };

    initGallery();

    // Add lightbox styles dynamically
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lightbox-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            cursor: pointer;
        }
        .lightbox-content {
            position: relative;
            z-index: 1;
            max-width: 90vw;
            max-height: 90vh;
            text-align: center;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .lightbox-content h4 {
            color: white;
            margin-top: 1rem;
            font-size: 1.25rem;
        }
        .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .lightbox-close:hover {
            background: var(--color-primary);
            transform: rotate(90deg);
        }
    `;
    document.head.appendChild(lightboxStyles);

    // ============================================
    // Preloader (Optional enhancement)
    // ============================================
    const initPreloader = () => {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-circle"></div>
                <span>Loading...</span>
            </div>
        `;

        document.body.appendChild(preloader);

        // Hide preloader when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 500);
        });
    };

    // Uncomment to enable preloader
    // initPreloader();

    // Add preloader styles
    const preloaderStyles = document.createElement('style');
    preloaderStyles.textContent = `
        .preloader {
            position: fixed;
            inset: 0;
            background: var(--bg-body);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        }
        .preloader-content {
            text-align: center;
        }
        .preloader-circle {
            width: 60px;
            height: 60px;
            border: 4px solid var(--border-color);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        .preloader-content span {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(preloaderStyles);

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c DaichiJLC Japanese Language Center ', 'background: #C8102E; color: #fff; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Welcome to our website! ', 'color: #C8102E; font-size: 14px;');
    console.log('%c Built with modern web technologies for the best experience. ', 'color: #666; font-size: 12px;');

})();
