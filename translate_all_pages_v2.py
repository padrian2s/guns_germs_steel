#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Improved Romanian Translation Script v2
Smart translation with word boundary detection and context awareness
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple
import unicodedata

# ============================================================================
# COMPREHENSIVE TRANSLATION GLOSSARY
# ============================================================================

TRANSLATION_GLOSSARY = {
    # Titles and Headers
    "Guns, Germs, and Steel": "Arme, Germeni și Oțel",
    "The Fates of Human Societies": "Soarta Societăților Umane",
    "Jared Diamond": "Jared Diamond",

    # Part Titles and Chapter Structure
    "Part One": "Partea Întâi",
    "Part Two": "Partea A Doua",
    "Part Three": "Partea A Treia",
    "Part Four": "Partea A Patra",
    "Chapter": "Capitolul",
    "Preface": "Prefață",
    "Prologue": "Prologul",
    "Epilogue": "Epilogul",
    "Conclusion": "Concluzie",
    "Introduction": "Introducere",

    # Key Concepts - Long phrases first
    "human societies": "societăți umane",
    "technological advancement": "progres tehnologic",
    "societal advancement": "progres social",
    "natural resources": "resurse naturale",
    "environmental factors": "factori ambientali",
    "different continents": "continente diferite",
    "increased globalization": "globalizare crescândă",
    "technological superiority": "superioritate tehnologică",
    "inherent differences": "diferențe inerente",
    "core premise": "premisă esențială",
    "geographical and environmental factors": "factori geografici și ambientali",
    "biological or cultural inferiority": "inferioritate biologică sau culturală",
    "continental layout": "configurația continentului",
    "mechanisms of civilization": "mecanismele civilizației",
    "landmark work on": "lucrare de referință despre",
    "sets the stage for": "pregătește scenariul pentru",
    "central inquiry": "investigația centrală",
    "prevailing assumptions": "asumptiile prevalente",
    "between populations": "între populații",
    "trade networks": "rețele comerciale",
    "technology diffusion": "difuzarea tehnologiei",
    "disease transmission": "transmisia bolii",
    "animal domestication": "domesticirea animalelor",
    "plant domestication": "domesticirea plantelor",

    # Technical Terms
    "biogeography": "biogeografie",
    "epidemiology": "epidemiologie",
    "anthropology": "antropologie",
    "archaeology": "arheologie",
    "ecology": "ecologie",
    "evolution": "evoluție",
    "migration": "migrație",
    "settlement": "așezare",
    "subsistence": "subzistență",
    "surplus": "excedent",
    "domestication": "domesticire",
    "agriculture": "agricultură",
    "civilization": "civilizație",
    "geography": "geografie",
    "technology": "tehnologie",
    "innovation": "inovație",
    "diffusion": "difuzare",
    "advantage": "avantaj",
    "resource": "resursă",
    "environment": "mediu",
    "development": "dezvoltare",
    "continent": "continent",
    "climate": "climat",
    "flora": "floră",
    "fauna": "faună",
    "species": "specie",
    "population": "populație",
    "society": "societate",
    "culture": "cultură",
    "trade": "comerț",
    "disease": "boală",
    "epidemic": "epidemie",
    "immunity": "imunitate",
    "weapon": "armă",
    "conquest": "cucerire",
    "empire": "imperiu",
    "civilization": "civilizație",

    # Common Verbs
    "flourished": "a prosperat",
    "lagged": "a întârziat",
    "determines": "determină",
    "determined": "a determinat",
    "developed": "a dezvoltat",
    "developed": "a dezvoltat",
    "emerged": "a apărut",
    "introduced": "a introdus",
    "introduced": "introduce",
    "examines": "examinează",
    "presents": "prezintă",
    "establishes": "stabilește",
    "challenges": "contestă",
    "stems": "provine",
    "explores": "explorează",
    "exploring": "explorând",
    "promises": "promite",
    "explains": "explică",
    "describes": "descrie",
    "demonstrates": "demonstrează",
    "shows": "arată",
    "reveals": "relevă",
    "argues": "susține",
    "suggests": "sugerează",
    "enables": "permite",
    "allows": "permite",
    "prevents": "previne",
    "affects": "afectează",
    "influences": "influențează",

    # Common Adjectives
    "domesticated": "domesticit",
    "domesticated animals": "animale domesticite",
    "wild": "sălbatic",
    "advanced": "avansat",
    "primitive": "primitiv",
    "complex": "complex",
    "simple": "simplu",
    "agricultural": "agricol",
    "technological": "tehnologic",
    "geographic": "geografic",
    "environmental": "ambiental",
    "biological": "biologic",
    "cultural": "cultural",
    "historical": "istoric",
    "modern": "modern",
    "ancient": "antic",

    # Publishers and Sources
    "W. W. Norton": "W. W. Norton",
    "W.W. Norton": "W.W. Norton",
    "Norton & Company": "Norton & Company",
    "Published by": "Publicată de",
    "published": "publicată",

    # Educational Analysis Headers
    "Educational Analysis": "Analiză Educațională",
    "Summary": "Rezumat",
    "Key Concepts": "Concepte Cheie",
    "Historical & Geographic Context": "Context Istoric și Geografic",
    "Connection to Main Thesis": "Conexiune cu Teza Principală",

    # Page-related
    "Page": "Pagina",
    "Title page": "Pagina de titlu",
    "of": "din",
    "and": "și",
    "in": "în",
    "to": "pentru",
    "for": "pentru",
    "by": "de",
    "from": "din",
    "with": "cu",
    "on": "pe",
    "at": "la",
    "as": "ca",
    "is": "este",
    "are": "sunt",
    "was": "era",
    "were": "erau",
    "be": "fi",
    "been": "fost",
    "this": "acesta",
    "that": "acela",
    "these": "aceștia",
    "those": "aceia",
    "which": "care",
    "what": "ce",
    "who": "cine",
    "why": "de ce",
    "how": "cum",
    "about": "despre",
}

# ============================================================================
# IMPROVED TRANSLATION SYSTEM
# ============================================================================

class SmartTranslator:
    """Smart translation with word boundary detection"""

    def __init__(self, glossary: Dict[str, str]):
        self.glossary = glossary
        # Sort by length (longest first)
        self.sorted_terms = sorted(glossary.keys(), key=len, reverse=True)
        # Pre-compile patterns
        self.patterns = {}
        self._compile_patterns()

    def _compile_patterns(self):
        """Pre-compile regex patterns for efficiency"""
        for term in self.sorted_terms:
            # Use word boundaries for single words, exact match for phrases
            if ' ' in term:
                # Multi-word phrases - exact match (case insensitive)
                pattern = r'\b' + re.escape(term) + r'\b'
            else:
                # Single words - word boundaries
                pattern = r'\b' + re.escape(term) + r'\b'

            self.patterns[term] = re.compile(pattern, re.IGNORECASE)

    def translate_text(self, text: str) -> str:
        """Translate text preserving case"""
        if not text or not isinstance(text, str):
            return text

        result = text

        # Apply translations in order (longest first)
        for english_term in self.sorted_terms:
            romanian_term = self.glossary[english_term]
            pattern = self.patterns[english_term]

            def replacer(match):
                original = match.group(0)
                # Preserve case
                if original.isupper():
                    return romanian_term.upper()
                elif original[0].isupper():
                    return romanian_term[0].upper() + romanian_term[1:] if len(romanian_term) > 1 else romanian_term.upper()
                else:
                    return romanian_term

            result = pattern.sub(replacer, result)

        return result

# ============================================================================
# HTML TRANSLATION
# ============================================================================

class HTMLTranslator:
    """Handles HTML page translation"""

    def __init__(self, glossary: Dict[str, str]):
        self.translator = SmartTranslator(glossary)

    def extract_text_from_html(self, html: str) -> Tuple[Dict, Dict]:
        """Extract all translatable text from HTML"""
        texts_to_translate = {}
        text_positions = {}

        # Find all text nodes (simple extraction)
        # Match text between tags but not in tags
        pattern = r'>([^<]+)<'

        for match in re.finditer(pattern, html):
            text = match.group(1)
            if text.strip() and not text.strip().startswith('{'):
                pos = match.start(1)
                texts_to_translate[pos] = text

        return texts_to_translate

    def translate_page(self, html_content: str, page_num: int) -> str:
        """Translate entire HTML page"""
        try:
            result = html_content

            # 1. Translate page number in header
            result = re.sub(
                r'<h1>Page \d+ of \d+</h1>',
                f'<h1>Pagina {page_num} din 460</h1>',
                result,
                flags=re.IGNORECASE
            )

            # 2. Translate breadcrumb
            result = re.sub(
                r'<p class="breadcrumb">📖 Guns, Germs, and Steel: The Fates of Human Societies</p>',
                '<p class="breadcrumb">📖 Arme, Germeni și Oțel: Soarta Societăților Umane</p>',
                result
            )

            # 3. Translate section headers
            section_headers = {
                'Original Content': 'Conținut Original',
                'Educational Analysis': 'Analiză Educațională',
                'Summary': 'Rezumat',
                'Key Concepts': 'Concepte Cheie',
                'Historical & Geographic Context': 'Context Istoric și Geografic',
                'Connection to Main Thesis': 'Conexiune cu Teza Principală',
            }

            for english, romanian in section_headers.items():
                result = result.replace(f'<h2>{english}</h2>', f'<h2>{romanian}</h2>')
                result = result.replace(f'<h3>{english}</h3>', f'<h3>{romanian}</h3>')
                result = result.replace(f'<h2>📚 {english}</h2>', f'<h2>📚 {romanian}</h2>')

            # 4. Translate text content in paragraphs
            def translate_paragraph(match):
                opening = match.group(1)
                text = match.group(2)
                closing = match.group(3)

                translated = self.translator.translate_text(text)
                return opening + translated + closing

            # Find paragraphs with text
            result = re.sub(
                r'(<p[^>]*>)([^<]+)(</p>)',
                translate_paragraph,
                result
            )

            return result

        except Exception as e:
            print(f"  ⚠️ Error translating page {page_num}: {e}")
            return None

# ============================================================================
# BATCH PROCESSOR
# ============================================================================

class BatchProcessor:
    """Processes pages in batches"""

    def __init__(self, text_dir: str, batch_size: int = 50):
        self.text_dir = Path(text_dir)
        self.batch_size = batch_size
        self.translator = HTMLTranslator(TRANSLATION_GLOSSARY)
        self.progress_file = Path('translation_progress_v2.json')

    def get_all_pages(self) -> List[Path]:
        """Get all English HTML pages"""
        pages = []
        for html_file in sorted(self.text_dir.glob('page_*.html')):
            if '_ro' not in html_file.name:
                pages.append(html_file)
        return pages

    def load_progress(self) -> Dict:
        """Load translation progress"""
        if self.progress_file.exists():
            with open(self.progress_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {'translated': [], 'failed': []}

    def save_progress(self, progress: Dict):
        """Save translation progress"""
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(progress, f, ensure_ascii=False, indent=2)

    def process_batches(self):
        """Process all pages"""
        pages = self.get_all_pages()
        progress = self.load_progress()

        print(f"\n{'='*75}")
        print(f"📖 GUNS, GERMS & STEEL - ROMANIAN TRANSLATION v2 (IMPROVED)")
        print(f"{'='*75}")
        print(f"📊 Total pages: {len(pages)}")
        print(f"   Already translated: {len(progress['translated'])}")
        print(f"   Batch size: {self.batch_size}\n")

        total_batches = (len(pages) + self.batch_size - 1) // self.batch_size
        total_processed = 0

        for batch_num in range(total_batches):
            start_idx = batch_num * self.batch_size
            end_idx = min(start_idx + self.batch_size, len(pages))
            batch_pages = pages[start_idx:end_idx]

            print(f"🔄 Batch {batch_num + 1}/{total_batches} | Pages {start_idx + 1}-{end_idx}")
            print(f"{'-'*75}")

            batch_count = 0
            for page_file in batch_pages:
                try:
                    match = re.search(r'page_(\d+)', page_file.name)
                    if not match:
                        continue

                    page_num = int(match.group(1))

                    # Check if already translated
                    output_filename = page_file.name.replace('.html', '_ro.html')
                    output_path = self.text_dir / output_filename

                    if output_path.exists() and page_file.name in progress['translated']:
                        print(f"   ✓ p{page_num:03d} (cached)")
                        batch_count += 1
                        total_processed += 1
                        continue

                    # Read English page
                    with open(page_file, 'r', encoding='utf-8') as f:
                        english_html = f.read()

                    # Translate
                    romanian_html = self.translator.translate_page(english_html, page_num)

                    if romanian_html:
                        # Write Romanian version
                        with open(output_path, 'w', encoding='utf-8') as f:
                            f.write(romanian_html)

                        progress['translated'].append(page_file.name)
                        batch_count += 1
                        total_processed += 1
                        print(f"   ✓ p{page_num:03d}")
                    else:
                        progress['failed'].append(page_file.name)
                        print(f"   ✗ p{page_num:03d} (translation failed)")

                except Exception as e:
                    progress['failed'].append(page_file.name)
                    print(f"   ✗ p{page_num:03d}: {str(e)[:30]}")

            # Save after each batch
            self.save_progress(progress)
            print(f"\n   ✅ {batch_count} pages done. Total: {total_processed}/{len(pages)}\n")

        # Summary
        print("\n" + "="*75)
        print(f"✅ TRANSLATION COMPLETE!")
        print(f"{'='*75}")
        print(f"   ✓ Translated: {len(progress['translated'])}/{len(pages)} pages")
        print(f"   ✗ Failed: {len(progress['failed'])} pages")
        success_rate = (len(progress['translated']) / len(pages) * 100) if pages else 0
        print(f"   📊 Success rate: {success_rate:.1f}%")
        print(f"{'='*75}\n")

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    processor = BatchProcessor('text', batch_size=50)
    processor.process_batches()
