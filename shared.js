document.addEventListener('DOMContentLoaded', function() {

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
