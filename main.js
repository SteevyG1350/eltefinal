// EliteSolutions - Main JavaScript File
// Handles all interactions, animations, and functionality

// Global variables
let currentStep = 1;
let selectedServices = [];
let projectData = {};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCodeRain();
    initializeMobileMenu();
    initializeServiceConfigurator();
    initializeStatsCounter();
    initializeScrollAnimations();
    initializeTypewriter();
    initializeClerkGuard();
});

// Typewriter effect for hero text
function initializeTypewriter() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Elite Technology Solutions',
                'Innovative Software Development',
                'Cutting-Edge Mobile Apps',
                'Advanced Data Analytics',
                'Comprehensive IT Services'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Initialize a safe Clerk sign-in guard to avoid opening the sign-in
// widget when a user is already authenticated. This creates a global
// helper `openClerkSignInSafely()` and wires common sign-in buttons
// (selectors) to call it.
function initializeClerkGuard() {
    // Expose a default no-op so callers can safely call it immediately
    window.openClerkSignInSafely = function() {
        console.warn('Clerk not loaded yet or no sign-in action available.');
    };

    // Attempt to load Clerk if present on the page
    try {
        if (window.Clerk) {
            // Clerk v4+ exposes Clerk.load()
            Clerk.load().then((clerk) => {
                window.openClerkSignInSafely = function() {
                    try {
                        // If a user/session exists, don't open the sign-in UI
                        if (clerk && clerk.user) {
                            console.log('Clerk: user already signed in:', clerk.user.primaryEmailAddress || clerk.user.id);
                            return;
                        }
                        // Otherwise open the Clerk sign-in widget (if available)
                        if (typeof clerk.openSignIn === 'function') {
                            clerk.openSignIn();
                        } else if (typeof Clerk.openSignIn === 'function') {
                            Clerk.openSignIn();
                        } else {
                            console.warn('Clerk loaded but no openSignIn() function found.');
                        }
                    } catch (e) {
                        console.error('Error while attempting to open Clerk sign-in:', e);
                    }
                };
            }).catch((e) => {
                console.warn('Clerk.load() failed or Clerk not initialized yet:', e);
            });
        }
    } catch (e) {
        console.warn('Error checking for Clerk:', e);
    }

    // Wire common sign-in button selectors to the safe opener so existing
    // buttons start calling the guarded function instead of opening the
    // widget unconditionally.
    const signSelectors = ['#sign-in', '.sign-in', '.sign-in-btn', '[data-clerk-signin]'];
    signSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(btn => {
            // Avoid adding duplicate handlers
            btn.addEventListener('click', function(evt) {
                evt.preventDefault();
                if (typeof window.openClerkSignInSafely === 'function') {
                    window.openClerkSignInSafely();
                }
            });
        });
    });
}

// Code rain background effect
function initializeCodeRain() {
    const canvas = document.getElementById('code-rain');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in-up elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Stats counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize animations
function initializeAnimations() {
    // Animate service cards on hover
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Animate tech icons
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                rotateY: 180,
                duration: 600,
                easing: 'easeInOutQuad'
            });
        });
        
        icon.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                rotateY: 0,
                duration: 600,
                easing: 'easeInOutQuad'
            });
        });
    });
}

// Service configurator functionality
function initializeServiceConfigurator() {
    const serviceOptions = document.querySelectorAll('.service-option');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const price = parseInt(this.getAttribute('data-price'));
            
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedServices = selectedServices.filter(s => s.service !== service);
            } else {
                // Select
                this.classList.add('selected');
                selectedServices.push({
                    service: service,
                    price: price,
                    name: this.querySelector('h4').textContent
                });
            }
            
            updateNextButton();
        });
    });
}

function updateNextButton() {
    const nextBtn = document.getElementById('next-btn-1');
    if (selectedServices.length > 0) {
        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function nextStep() {
    if (currentStep < 3) {
        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        
        // Show next step
        currentStep++;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        // Update progress
        updateProgress();
        
        // Update summary if on step 3
        if (currentStep === 3) {
            updateProjectSummary();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        // Update progress
        updateProgress();
    }
}

function updateProgress() {
    const progress = (currentStep / 3) * 100;
    document.getElementById('current-step').textContent = currentStep;
    document.getElementById('progress-percent').textContent = Math.round(progress);
    document.getElementById('progress-fill').style.width = progress + '%';
}

function updateProjectSummary() {
    const summaryContent = document.getElementById('summary-content');
    const totalPriceEl = document.getElementById('total-price');
    const timelineEl = document.getElementById('estimated-timeline');
    
    // Calculate total price
    let totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
    
    // Apply multipliers based on selections
    const timeline = document.getElementById('timeline').value;
    const teamSize = document.getElementById('team-size').value;
    const description = document.getElementById('project-description').value;
    
    // Timeline multiplier
    const timelineMultipliers = {
        '1': 1.5, // Rush
        '2': 1.0, // Standard
        '3': 0.8, // Extended
        '4': 0.6  // Complex
    };
    
    // Team size multiplier
    const teamMultipliers = {
        '1': 1.0,
        '2': 1.8,
        '3': 2.5,
        '4': 3.5
    };
    
    totalPrice = totalPrice * timelineMultipliers[timeline] * teamMultipliers[teamSize];
    
    // Generate timeline estimate
    const timelineEstimates = {
        '1': '1-2 weeks',
        '2': '3-4 weeks',
        '3': '1-2 months',
        '4': '3+ months'
    };
    
    // Update summary
    let summaryHTML = '<div class="space-y-3">';
    selectedServices.forEach(service => {
        summaryHTML += `
            <div class="flex justify-between items-center">
                <span>${service.name}</span>
                <span class="text-cyan-400">$${service.price.toLocaleString()}</span>
            </div>
        `;
    });
    summaryHTML += '</div>';
    
    summaryContent.innerHTML = summaryHTML;
    totalPriceEl.textContent = '$' + Math.round(totalPrice).toLocaleString();
    timelineEl.textContent = timelineEstimates[timeline];
    
    // Store project data
    projectData = {
        services: selectedServices,
        totalPrice: Math.round(totalPrice),
        timeline: timelineEstimates[timeline],
        teamSize: teamSize,
        description: description
    };
}

function submitProject() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    
    // Add project data to form data
    formData.append('project', JSON.stringify(projectData));
    
    // Show success message
    showNotification('Thank you! We\'ll contact you within 24 hours to discuss your project.', 'success');
    
    // Reset form after delay
    setTimeout(() => {
        resetConfigurator();
    }, 3000);
}

function resetConfigurator() {
    currentStep = 1;
    selectedServices = [];
    projectData = {};
    
    // Reset all steps
    document.querySelectorAll('.config-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step-1').classList.add('active');
    
    // Reset selections
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset form
    document.getElementById('contact-form').reset();
    
    // Reset progress
    updateProgress();
    
    // Reset next button
    updateNextButton();
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function selectService(serviceType) {
    // This would typically navigate to the services page or show more info
    showNotification('Redirecting to services page...', 'info');
    setTimeout(() => {
        window.location.href = 'services.html';
    }, 1000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    
    const colors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-blue-600 text-white',
        warning: 'bg-yellow-600 text-black'
    };
    
    notification.className += ` ${colors[type]}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Tech icon hover effects
document.addEventListener('DOMContentLoaded', function() {
    const techIcons = document.querySelectorAll('.tech-icon');
    
    techIcons.forEach(icon => {
        const techName = icon.getAttribute('data-tech');
        
        icon.addEventListener('mouseenter', function() {
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap';
            tooltip.textContent = techName;
            tooltip.id = 'tech-tooltip';
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
        });
        
        icon.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('#tech-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (isValid) {
                showNotification('Form submitted successfully!', 'success');
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events here if needed
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'resources/hero-tech-workspace.jpg',
        'resources/service-software-dev.jpg',
        'resources/service-mobile-dev.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error to analytics service
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}