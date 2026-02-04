/**
 * Guns, Germs, and Steel - Document Reader
 * Interactive dual-view reader with navigation, zoom, and persistence
 */

class DocumentReader {
    constructor() {
        this.currentPage = this.getStoredPage() || 1;
        this.totalPages = 457;
        this.currentView = this.getStoredView() || 'text'; // 'text' or 'image'
        this.currentZoom = this.getStoredZoom() || 100;
        this.bookTitle = 'Guns, Germs, and Steel';

        this.initElements();
        this.attachEventListeners();
        this.loadPage(this.currentPage);
        this.updateUI();
    }

    initElements() {
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInput = document.getElementById('pageInput');
        this.pageDisplay = document.getElementById('pageDisplay');
        this.toggleViewBtn = document.getElementById('toggleViewBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.readerContent = document.getElementById('readerContent');
        this.progressFill = document.getElementById('progressFill');
        this.zoomPanel = document.getElementById('zoomPanel');
        this.sidebar = document.getElementById('readerSidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebarVisible = this.getStoredSidebarState() !== false;
        this.helpBtn = document.getElementById('helpBtn');
        this.helpModal = document.getElementById('helpModal');
        this.helpClose = document.getElementById('helpClose');
        this.bottomMenu = document.getElementById('bottomMenu');
        this.bottomMenuToggle = document.getElementById('bottomMenuToggle');
        this.bottomMenuContent = document.getElementById('bottomMenuContent');
        this.bottomMenuVisible = this.getStoredBottomMenuState();
    }

    attachEventListeners() {
        // Navigation
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        this.pageInput.addEventListener('change', () => this.jumpToPage());
        this.pageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.jumpToPage();
        });

        // View Toggle
        this.toggleViewBtn.addEventListener('click', () => this.toggleView());

        // Sidebar Toggle
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());

        // Help Modal
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.helpClose.addEventListener('click', () => this.hideHelp());
        this.helpModal.addEventListener('click', (e) => {
            if (e.target === this.helpModal) this.hideHelp();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target === this.pageInput) return;

            const key = e.key.toLowerCase();

            switch(key) {
                case 'arrowleft':
                    this.previousPage();
                    break;
                case 'arrowright':
                    this.nextPage();
                    break;
                case 'v':
                    this.toggleView();
                    break;
                case 'n':
                    this.toggleSidebar();
                    break;
                case 'm':
                    this.toggleMenu();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                case '_':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.setZoom(100);
                    break;
                case '?':
                case '/':
                    e.preventDefault();
                    this.showHelp();
                    break;
                case 'escape':
                    if (this.helpModal.style.display !== 'none') {
                        this.hideHelp();
                    } else {
                        this.closeMenu();
                    }
                    break;
            }

            // Handle zoom with Ctrl/Cmd + and -
            if ((e.ctrlKey || e.metaKey) && (key === '+' || key === '=')) {
                e.preventDefault();
                this.zoomIn();
            } else if ((e.ctrlKey || e.metaKey) && (key === '-' || key === '_')) {
                e.preventDefault();
                this.zoomOut();
            }
        });

        // Zoom controls
        document.querySelectorAll('.zoom-level').forEach(level => {
            level.addEventListener('click', (e) => {
                const zoom = parseInt(e.target.dataset.zoom);
                this.setZoom(zoom);
            });
        });

        // Sidebar navigation
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                if (page) {
                    this.loadPage(parseInt(page));
                }
            });
        });

        // Bottom menu toggle
        this.bottomMenuToggle.addEventListener('click', () => this.toggleBottomMenu());

        // Bottom menu navigation
        document.querySelectorAll('.bottom-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                if (page) {
                    this.loadPage(parseInt(page));
                    this.closeBottomMenu();
                }
            });
        });
    }

    async loadPage(pageNum) {
        // Clamp to valid range
        if (pageNum < 1) pageNum = 1;
        if (pageNum > this.totalPages) pageNum = this.totalPages;

        this.currentPage = pageNum;
        this.updateUI();
        this.storeState();

        // Load the page content
        const pageFile = `text/page_${String(pageNum).padStart(4, '0')}.html`;

        try {
            const response = await fetch(pageFile);
            if (response.ok) {
                const html = await response.text();
                // Extract just the main content from the loaded page
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('.page-container') || doc.body;

                if (this.currentView === 'image') {
                    this.readerContent.innerHTML = this.getImageView(pageNum);
                } else {
                    this.readerContent.innerHTML = content.innerHTML;
                }
            } else {
                this.readerContent.innerHTML = `<p>Error loading page ${pageNum}</p>`;
            }
        } catch (error) {
            this.readerContent.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <p>Could not load page ${pageNum}</p>
                    <p style="font-size: 14px; color: #999;">${error.message}</p>
                </div>
            `;
        }
    }

    getImageView(pageNum) {
        const imagePath = `pages/page_${String(pageNum).padStart(4, '0')}.png`;
        return `
            <div class="image-view" style="transform: scale(${this.currentZoom / 100});">
                <img src="${imagePath}" alt="Page ${pageNum}" class="page-image" title="Page ${pageNum}">
            </div>
        `;
    }

    toggleView() {
        this.currentView = this.currentView === 'text' ? 'image' : 'text';
        this.storeView();
        this.updateViewButton();
        this.loadPage(this.currentPage);
        // Apply zoom level to new view
        setTimeout(() => this.setZoom(this.currentZoom), 100);
    }

    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
        this.storeSidebarState();
        this.updateSidebarVisibility();
    }

    updateSidebarVisibility() {
        if (this.sidebarVisible) {
            this.sidebar.classList.remove('hidden');
        } else {
            this.sidebar.classList.add('hidden');
        }
    }

    zoomIn() {
        const zoomLevels = [70, 80, 90, 100, 110, 120, 130, 140];
        const currentIndex = zoomLevels.indexOf(this.currentZoom);
        if (currentIndex < zoomLevels.length - 1) {
            this.setZoom(zoomLevels[currentIndex + 1]);
        }
    }

    zoomOut() {
        const zoomLevels = [70, 80, 90, 100, 110, 120, 130, 140];
        const currentIndex = zoomLevels.indexOf(this.currentZoom);
        if (currentIndex > 0) {
            this.setZoom(zoomLevels[currentIndex - 1]);
        }
    }

    updateViewButton() {
        if (this.currentView === 'text') {
            this.toggleViewBtn.textContent = '🖼️ Image';
        } else {
            this.toggleViewBtn.textContent = '📝 Text';
        }
    }

    toggleMenu() {
        this.toggleBottomMenu();
    }

    closeMenu() {
        this.closeBottomMenu();
    }

    toggleBottomMenu() {
        this.bottomMenuVisible = !this.bottomMenuVisible;
        this.storeBottomMenuState();
        this.updateBottomMenuVisibility();
    }

    closeBottomMenu() {
        if (this.bottomMenuVisible) {
            this.bottomMenuVisible = false;
            this.storeBottomMenuState();
            this.updateBottomMenuVisibility();
        }
    }

    updateBottomMenuVisibility() {
        if (this.bottomMenuVisible) {
            this.bottomMenu.classList.add('expanded');
        } else {
            this.bottomMenu.classList.remove('expanded');
        }
    }

    showHelp() {
        this.helpModal.style.display = 'flex';
    }

    hideHelp() {
        this.helpModal.style.display = 'none';
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.loadPage(this.currentPage - 1);
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.loadPage(this.currentPage + 1);
        }
    }

    jumpToPage() {
        const page = parseInt(this.pageInput.value);
        if (!isNaN(page)) {
            this.loadPage(page);
        }
    }

    setZoom(zoomLevel) {
        this.currentZoom = zoomLevel;
        this.storeZoom();

        // Update zoom button states
        document.querySelectorAll('.zoom-level').forEach(level => {
            level.classList.remove('active');
            if (parseInt(level.dataset.zoom) === zoomLevel) {
                level.classList.add('active');
            }
        });

        // Apply zoom to both image and text views
        const zoomScale = zoomLevel / 100;
        if (this.currentView === 'image') {
            this.loadPage(this.currentPage);
        } else {
            // Apply scaling to text view content
            this.readerContent.style.transform = `scale(${zoomScale})`;
            this.readerContent.style.transformOrigin = 'center';
        }
    }

    updateUI() {
        // Update page display
        this.pageInput.value = this.currentPage;
        this.pageDisplay.textContent = `${this.currentPage} / ${this.totalPages}`;

        // Update progress bar
        const progress = (this.currentPage / this.totalPages) * 100;
        this.progressFill.style.width = `${progress}%`;

        // Update button states
        this.prevBtn.disabled = this.currentPage <= 1;
        this.nextBtn.disabled = this.currentPage >= this.totalPages;

        // Update view button
        this.updateViewButton();

        // Update sidebar visibility
        this.updateSidebarVisibility();

        // Update bottom menu visibility
        this.updateBottomMenuVisibility();
    }

    storeState() {
        localStorage.setItem('ggs_currentPage', this.currentPage);
    }

    storeView() {
        localStorage.setItem('ggs_view', this.currentView);
    }

    storeZoom() {
        localStorage.setItem('ggs_zoom', this.currentZoom);
    }

    storeSidebarState() {
        localStorage.setItem('ggs_sidebarVisible', this.sidebarVisible);
    }

    getStoredPage() {
        const stored = localStorage.getItem('ggs_currentPage');
        return stored ? parseInt(stored) : null;
    }

    getStoredView() {
        return localStorage.getItem('ggs_view') || 'text';
    }

    getStoredZoom() {
        const stored = localStorage.getItem('ggs_zoom');
        return stored ? parseInt(stored) : 100;
    }

    getStoredSidebarState() {
        const stored = localStorage.getItem('ggs_sidebarVisible');
        return stored ? stored === 'true' : true;
    }

    storeBottomMenuState() {
        localStorage.setItem('ggs_bottomMenuVisible', this.bottomMenuVisible);
    }

    getStoredBottomMenuState() {
        const stored = localStorage.getItem('ggs_bottomMenuVisible');
        return stored ? stored === 'true' : false;
    }
}

// Initialize reader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DocumentReader();
});
