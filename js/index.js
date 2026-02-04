/**
 * Guns, Germs, and Steel - Landing Page
 * Handles TOC navigation and page linking
 */

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const themes = ['default', 'soft-sepia', 'sepia', 'dark'];
            const currentIndex = themes.indexOf(currentTheme || 'default');
            const newTheme = themes[(currentIndex + 1) % themes.length];
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeToggle) {
            let icon, title;
            switch(theme) {
                case 'soft-sepia':
                    icon = '🌞';
                    title = 'Switch to classic sepia theme';
                    break;
                case 'sepia':
                    icon = '🌚';
                    title = 'Switch to dark theme';
                    break;
                case 'dark':
                    icon = '🌙';
                    title = 'Switch to default theme';
                    break;
                default: // default theme
                    icon = '🌓';
                    title = 'Switch to soft sepia theme';
                    break;
            }
            themeToggle.textContent = icon;
            themeToggle.title = title;
        }
    }

    // TOC item click handlers
    document.querySelectorAll('.toc-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) {
                // Navigate to reader with the page
                window.location.href = `reader.html?page=${page}`;
            }
        });
    });

    // Parse URL parameters in reader
    const urlParams = new URLSearchParams(window.location.search);
    const startPage = urlParams.get('page');
    if (startPage && window.location.pathname.includes('reader.html')) {
        // The reader.js will handle this via sessionStorage
        sessionStorage.setItem('startPage', startPage);
    }

    // Smooth scroll behavior
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
