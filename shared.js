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

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Stats counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) {
            return;
        }
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

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeStatsCounter();

    const lightModeToggle = document.getElementById('light-mode-toggle');
    const body = document.body;

    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    // Swap images/backgrounds for current theme
    function applyThemeAssets() {
        const isLight = body.classList.contains('light-mode');

        // Swap <img> elements with data-dark-src / data-light-src
        document.querySelectorAll('img[data-dark-src]').forEach(img => {
            const dark = img.getAttribute('data-dark-src');
            const light = img.getAttribute('data-light-src') || dark;
            img.src = isLight ? light : dark;
        });

        // Swap hero/background CSS custom property on elements with data-hero-dark
        document.querySelectorAll('[data-hero-dark]').forEach(el => {
            const dark = el.getAttribute('data-hero-dark');
            const light = el.getAttribute('data-hero-light') || dark;
            el.style.setProperty('--hero-bg', `url('${isLight ? light : dark}')`);
        });
    }

    // Initial apply
    applyThemeAssets();

    lightModeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        applyThemeAssets();

        // Save theme preference to localStorage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
});
