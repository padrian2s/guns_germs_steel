# 📖 Guns, Germs, and Steel - Interactive Study Guide

An interactive, browser-based study guide for Jared Diamond's landmark work **"Guns, Germs, and Steel: The Fates of Human Societies"** (1997).

## 🌟 Features

### 📚 Full Document Reader
- **Dual-view interface**: Toggle between original PDF pages and transcribed text
- **Page-by-page structure**: All 457 pages available with extracted text
- **Navigation controls**: Arrow keys, page input, progress bar, search
- **Zoom controls**: 8 zoom levels (70-140%) with smooth scaling
- **Keyboard shortcuts**:
  - `←` / `→` : Previous / Next page
  - `V` : Toggle Image / Text view
  - `M` : Open menu
  - `Escape` : Close menu

### 🗺️ Interactive Simulators
Hands-on demonstrations of key concepts from the book:

1. **Agricultural Advantage Simulator** 🌾
   - Adjust crop suitability, animal domestication, and geographic advantage
   - Watch how civilization develops at different rates based on these factors
   - See population growth, technology advancement, and specialization

2. **Disease Transmission Simulator** 🦠
   - Explore how domestication + population density = epidemics
   - Adjust population density, domestication level, and disease virulence
   - Track infection rates, mortality, and immunity development
   - Visualize disease spread through a population grid

3. **Geography Impact Simulator** 🗺️
   - Choose continental axis orientation (East-West, North-South, Fragmented)
   - See how geography affects technology diffusion speed
   - East-West vs North-South axis advantages
   - Regional isolation vs connected trade networks

### 🎯 Key Themes & Organization
- **Preface & Prologue** (pp. 9–32): Introduction to Diamond's thesis
- **Part One: From Eden to Cajamarca** (pp. 33–82): Geography as destiny
- **Part Two: Food Production** (pp. 83–232): Agriculture & domestication
- **Part Three: Guns, Germs, and Steel** (pp. 233–422): The three factors explained

### 🔍 Navigation
- **Table of Contents** with chapter summaries and theme tags
- **Sidebar navigation** for quick jumps to sections
- **Theme-based filtering** (Geography, Agriculture, Disease, Technology, etc.)
- **Regional navigation** (Africa, Eurasia, Americas, Polynesia)

### ⚡ Technical
- **Zero external dependencies**: Pure vanilla HTML/CSS/JavaScript
- **Offline capable**: Runs entirely in the browser
- **Session persistence**: Remembers your reading position, view preference, and zoom level
- **Responsive design**: Works on desktop and mobile
- **Fast loading**: Optimized page structure and lazy loading

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for the built-in server)

### Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd /Users/adrian/personal/ggs_books
   ```

2. **Start the local server:**
   ```bash
   bash run.sh
   ```
   Or manually:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open your browser and visit:**
   ```
   http://localhost:8000
   ```

4. **Start reading!** 📖
   - Click "Start Reading" on the landing page to open the document reader
   - Or explore the interactive simulators in the "Explore Simulators" section

---

## 📁 Project Structure

```
ggs_books/
├── index.html              # Landing page with TOC and simulators
├── reader.html             # Main document reader (dual-view)
├── run.sh                  # Start local server
├── metadata.json           # Book structure and metadata
│
├── pages/                  # PDF page images (457 files)
│   ├── page_0001.png
│   ├── page_0002.png
│   └── ...
│
├── text_raw/              # Extracted text (raw, one file per page)
│   ├── page_0001.txt
│   ├── page_0002.txt
│   └── ...
│
├── text/                  # HTML pages with transcribed content + commentary stubs
│   ├── page_0001.html
│   ├── page_0002.html
│   └── ...
│
├── simulators/            # Interactive simulator pages
│   ├── agricultural-advantage.html
│   ├── disease-transmission.html
│   └── geography-impact.html
│
├── js/                    # JavaScript modules
│   ├── index.js          # Landing page logic
│   ├── reader.js         # Document reader (navigation, zoom, view toggle)
│   └── simulators/       # Individual simulator controllers
│       ├── agricultural-advantage.js
│       ├── disease-transmission.js
│       └── geography-impact.js
│
└── css/                  # Stylesheets
    ├── index.css        # Landing page styles
    ├── reader.css       # Document reader styles
    └── simulators.css   # Simulator styles
```

---

## 📖 How to Use

### Reading the Book

1. **Start on the landing page** (`index.html`)
   - See the book overview and key themes
   - Browse the table of contents
   - Choose where to start reading

2. **Enter the document reader** (`reader.html`)
   - Click on any chapter in the TOC to jump to that page
   - Use the previous/next buttons or arrow keys to navigate
   - Toggle between Image View (original PDF) and Text View (transcribed content)
   - Use the zoom controls (left edge, hover to reveal)
   - Search functionality (press `M` for menu)

3. **View text & commentary**
   - Image View: See the original PDF page
   - Text View: See the extracted text content
   - Future enhancement: Per-page educational analysis

### Using Simulators

Each simulator is interactive and self-contained:

1. **Adjust parameters** with sliders and dropdowns
2. **Press Start** to begin the simulation
3. **Watch in real-time** as the visualization shows the dynamics
4. **Monitor statistics** in the left panel
5. **Read the log** for event descriptions and insights
6. **Reset** to try different parameter combinations

All simulators are designed to help you understand:
- How agricultural advantages compound over time
- How diseases emerge and spread in population centers
- How geography constrains or enables technology diffusion

---

## 🎨 Design & UX

### Visual Design
- **Color scheme**: Earthy, historical tones (brown, blue, green)
- **Typography**: Georgia serif for content, system sans-serif for UI
- **Responsive**: Adapts to desktop, tablet, and mobile screens
- **Accessible**: High contrast, semantic HTML, keyboard navigation

### Navigation Patterns
- **Breadcrumbs** show where you are in the book
- **Progress bar** indicates reading position
- **Sidebar** provides quick access to major sections
- **Deep linking** allows bookmarking specific pages
- **Persistent state** remembers your preferences

---

## 🔮 Future Enhancements

### Phase 2: Enhanced Commentary
- Detailed per-page analysis (summary, key concepts, context, implications)
- Real-world examples and modern applications
- Cross-references between related pages and chapters
- Highlighted definitions, important quotes, and key data

### Phase 3: Advanced Features
- Full-text search across all pages
- Annotation system (bookmark, highlight, notes)
- Reading progress tracking and recommendations
- Interactive maps showing geographic examples
- Quiz and review questions per chapter

### Phase 4: Extended Content
- Author biography and context
- Glossary of key terms
- Bibliography with links to sources
- Scholarly critiques and responses
- Video lectures on key concepts

---

## 🛠️ Technical Details

### How It Works
1. **PDF Extraction**: Pages converted to PNG images, text extracted via OCR
2. **HTML Generation**: Page stubs created automatically from raw text
3. **JavaScript**: Client-side reader handles navigation, view toggling, zoom
4. **Canvas Simulators**: Interactive visualizations drawn using HTML5 Canvas API
5. **Storage**: Browser localStorage persists user preferences across sessions

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance
- **Lazy loading**: Pages load on demand
- **Minimal dependencies**: Pure vanilla code, no libraries
- **GPU acceleration**: CSS transforms for smooth animations
- **Optimized images**: PNG pages at 150 DPI, ~50KB each

---

## 📚 About the Book

**Guns, Germs, and Steel: The Fates of Human Societies** (1997)
- **Author**: Jared Diamond
- **Pages**: 457
- **Awards**: Pulitzer Prize (1998)
- **Theme**: How geography, not biology or culture, explains global inequality

### Main Argument
Societies on different continents developed at vastly different rates not because of inherent differences in the people, but because of:
1. **Guns**: Weapon technology enabled conquest
2. **Germs**: Diseases from domesticated animals gave some societies immunity
3. **Steel**: Metalworking and advanced technology compounds advantages

All three emerge from geographic advantages: access to domesticable plants and animals, continental orientation enabling technology diffusion, and population density driving innovation.

---

## 🎓 Educational Use

This study guide is designed for:
- **Students** reading the book for the first time
- **Teachers** looking for supplementary materials
- **Researchers** exploring Diamond's arguments and evidence
- **General readers** seeking deeper engagement with complex material

### Suggested Use Cases
1. **Parallel reading**: Keep the simulator open while reading chapters
2. **Concept verification**: Run simulators to see how mechanisms work
3. **Discussion preparation**: Use the TOC summaries to prepare for class
4. **Review and retention**: Revisit chapters with simulators as memory aids

---

## 📝 License & Attribution

This interactive study guide was created as an educational resource based on:
- **Guns, Germs, and Steel** © 1997 Jared Diamond
- Published by W. W. Norton & Company

This guide is designed to enhance understanding of the original work and encourage readers to engage deeply with Diamond's thesis.

---

## 🤝 Contributing & Feedback

To improve this study guide:
- Suggest enhancements or corrections
- Report bugs or accessibility issues
- Recommend additional simulators or features
- Share your experience using the guide

---

## 📧 Questions?

- **How do I highlight passages?** (Future feature in Phase 2)
- **Can I download the guide?** Yes, clone or download the entire directory
- **Is there a mobile app?** Not yet, but the browser version is mobile-responsive
- **How can I help improve this?** Submit feedback and suggestions!

---

**Happy reading! 📖🌍**

Start with the [**landing page**](index.html) and begin your journey through human history.
