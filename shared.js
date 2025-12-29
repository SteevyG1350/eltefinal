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

    const themeSelect = document.getElementById('theme-select');
    const body = document.body;

    // Apply theme classes based on stored preference (dark | light | white)
    function applyTheme(theme) {
        body.classList.remove('light-mode', 'white-mode');
        if (theme === 'light') body.classList.add('light-mode');
        if (theme === 'white') body.classList.add('white-mode');
        // apply assets after class change
        applyThemeAssets(theme);
    }

    // Swap images/backgrounds for current theme
    function applyThemeAssets(theme) {
        const t = theme || (body.classList.contains('white-mode') ? 'white' : (body.classList.contains('light-mode') ? 'light' : 'dark'));

        // Swap <img> elements using data-dark-src / data-light-src / data-white-src
        document.querySelectorAll('img[data-dark-src]').forEach(img => {
            const dark = img.getAttribute('data-dark-src');
            const light = img.getAttribute('data-light-src') || dark;
            const white = img.getAttribute('data-white-src') || light;
            img.src = (t === 'white') ? white : (t === 'light' ? light : dark);
        });

        // Swap hero/background CSS custom property on elements with data-hero-dark
        document.querySelectorAll('[data-hero-dark]').forEach(el => {
            const dark = el.getAttribute('data-hero-dark');
            const light = el.getAttribute('data-hero-light') || dark;
            const white = el.getAttribute('data-hero-white') || light;
            const chosen = (t === 'white') ? white : (t === 'light' ? light : dark);
            el.style.setProperty('--hero-bg', `url('${chosen}')`);
        });
    }

    const storedTheme = localStorage.getItem('theme') || 'dark';
    if (themeSelect) themeSelect.value = storedTheme;
    applyTheme(storedTheme);

    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const val = themeSelect.value || 'dark';
            applyTheme(val);
            localStorage.setItem('theme', val);
        });
    }
});
