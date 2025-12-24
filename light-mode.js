document.addEventListener('DOMContentLoaded', function() {
    const lightModeToggle = document.getElementById('light-mode-toggle');
    const body = document.body;

    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    lightModeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');

        // Save theme preference to localStorage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
});
