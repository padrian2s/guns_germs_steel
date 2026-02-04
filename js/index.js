/**
 * Guns, Germs, and Steel - Landing Page
 * Handles TOC navigation and page linking
 */

document.addEventListener('DOMContentLoaded', () => {
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
