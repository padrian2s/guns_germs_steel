#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive Romanian Translation Script for Guns, Germs, and Steel
Uses only built-in Python libraries - no external dependencies
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List
import html

# ============================================================================
# TRANSLATION GLOSSARY & TERMINOLOGY
# ============================================================================

TRANSLATION_GLOSSARY = {
    # Main Terms
    "Guns, Germs, and Steel": "Arme, Germeni și Oțel",
    "Human Societies": "Societăți Umane",
    "Geography": "Geografie",
    "Agriculture": "Agricultură",
    "Domestication": "Domesticire",
    "Technology": "Tehnologie",
    "Civilization": "Civilizație",
    "Continent": "Continent",
    "Resources": "Resurse",
    "Environment": "Mediu",
    "Development": "Dezvoltare",
    "Advantage": "Avantaj",
    "Diffusion": "Difuzare",
    "Innovation": "Inovație",

    # Technical Terms
    "Biogeography": "Biogeografie",
    "Epidemiology": "Epidemiologie",
    "Anthropology": "Antropologie",
    "Archaeology": "Arheologie",
    "Ecology": "Ecologie",
    "Evolution": "Evoluție",
    "Migration": "Migrație",
    "Settlement": "Așezare",
    "Subsistence": "Subzistență",
    "Surplus": "Excedent",

    # Common Phrases
    "landmark work on": "lucrare de referință despre",
    "technological advancement": "progres tehnologic",
    "societal advancement": "progres social",
    "flourished": "a prosperat",
    "lagged behind": "a întârziat",
    "mechanisms of civilization": "mecanismele civilizației",
    "natural resources": "resurse naturale",
    "environmental factors": "factori ambientali",
    "human societies": "societăți umane",
    "different continents": "continente diferite",
    "increased globalization": "globalizare crescândă",
    "technological superiority": "superioritate tehnologică",
    "inherent differences": "diferențe inerente",
    "core premise": "premisă esențială",
    "geographical and environmental factors": "factori geografici și ambientali",
    "biological or cultural inferiority": "inferioritate biologică sau culturală",
    "continental layout": "configurația continentului",

    # Educational Analysis
    "Educational Analysis": "Analiză Educațională",
    "Summary": "Rezumat",
    "Key Concepts": "Concepte Cheie",
    "Historical & Geographic Context": "Context Istoric și Geografic",
    "Connection to Main Thesis": "Conexiune cu Teza Principală",

    # Common Phrases (continued)
    "introduces": "introduce",
    "examines": "examinează",
    "presents": "prezintă",
    "establishes": "stabilește",
    "challenges": "contestă",
    "stems from": "provine din",
    "sets the stage for": "pregătește scenariul pentru",
    "determined": "a determinat",
    "exploring": "explorarea",
    "promises to explore": "promite să exploreze",
    "central inquiry": "investigația centrală",
    "prevailing assumptions": "asumptiile prevalente",
    "between populations": "între populații",
    "role of": "rolul",
    "trajectory": "traiectoria",
    "shaping": "modelarea",
    "emerged during": "a apărut într-o perioadă",
    "period of": "perioadă de",

    # Authors & Publishers
    "Jared Diamond": "Jared Diamond",
    "Diamond's": "lui Diamond",
    "W.W. Norton": "W.W. Norton",
    "W. W. Norton & Company": "W. W. Norton & Company",

    # Page-related
    "Title page": "Pagina de titlu",
    "Published": "Publicată",
    "Published in": "Publicată în",
    "the 1990s": "anii 1990",

    # Single words (lowercase)
    "of": "din",
    "and": "și",
    "in": "în",
    "to": "pentru",
    "a": "o",
}

# ============================================================================
# TRANSLATION SYSTEM
# ============================================================================

class RomanianTranslator:
    """Handles translation of English to Romanian"""

    def __init__(self, glossary: Dict[str, str]):
        self.glossary = glossary
        # Sort by length (longest first) for multi-word matching
        self.sorted_terms = sorted(glossary.keys(), key=len, reverse=True)

    def translate_text(self, text: str) -> str:
        """Translate text using glossary"""
        if not text or not isinstance(text, str):
            return text

        result = text

        # Apply translations (longest first to avoid partial matches)
        for english_term in self.sorted_terms:
            romanian_term = self.glossary[english_term]

            # Case-insensitive replacement
            pattern = re.compile(re.escape(english_term), re.IGNORECASE)

            def replacer(match):
                original = match.group()
                if original.isupper():
                    return romanian_term.upper()
                elif original[0].isupper():
                    return romanian_term[0].upper() + romanian_term[1:]
                else:
                    return romanian_term

            result = pattern.sub(replacer, result)

        return result

# ============================================================================
# PAGE TRANSLATOR (Regex-based, no external libraries)
# ============================================================================

class PageTranslator:
    """Handles translation of individual HTML pages"""

    def __init__(self, glossary: Dict[str, str]):
        self.translator = RomanianTranslator(glossary)

    def translate_html_element(self, element: str) -> str:
        """Translate text inside HTML element"""
        # Extract tag structure
        match = re.match(r'^(<[^>]+>)(.*?)(</[^>]+>)$', element, re.DOTALL)
        if match:
            opening_tag = match.group(1)
            content = match.group(2)
            closing_tag = match.group(3)

            translated_content = self.translator.translate_text(content)
            return opening_tag + translated_content + closing_tag
        return element

    def translate_page(self, html_content: str, page_num: int) -> str:
        """Translate entire HTML page"""
        try:
            result = html_content

            # Translate page header number
            result = re.sub(
                r'<h1>Page \d+ of \d+</h1>',
                f'<h1>Pagina {page_num} din 460</h1>',
                result
            )

            # Translate breadcrumb
            result = re.sub(
                r'<p class="breadcrumb">📖 Guns, Germs, and Steel: The Fates of Human Societies</p>',
                '<p class="breadcrumb">📖 Arme, Germeni și Oțel: Soarta Societăților Umane</p>',
                result
            )

            # Translate "Original Content" header
            result = re.sub(
                r'<h2>Original Content</h2>',
                '<h2>Conținut Original</h2>',
                result
            )

            # Translate text within text-content divs
            def translate_p_tag(match):
                tag = match.group(0)
                content_match = re.search(r'>([^<]*)<', tag)
                if content_match:
                    original_text = content_match.group(1)
                    translated_text = self.translator.translate_text(original_text)
                    return tag.replace(original_text, translated_text)
                return tag

            result = re.sub(r'<p[^>]*>[^<]*</p>', translate_p_tag, result)

            # Translate Educational Analysis header
            result = re.sub(
                r'<h2>📚 Educational Analysis</h2>',
                '<h2>📚 Analiză Educațională</h2>',
                result
            )

            # Translate section headers
            section_translations = {
                '<h3>Summary</h3>': '<h3>Rezumat</h3>',
                '<h3>Key Concepts</h3>': '<h3>Concepte Cheie</h3>',
                '<h3>Historical & Geographic Context</h3>': '<h3>Context Istoric și Geografic</h3>',
                '<h3>Connection to Main Thesis</h3>': '<h3>Conexiune cu Teza Principală</h3>',
            }

            for english_header, romanian_header in section_translations.items():
                result = result.replace(english_header, romanian_header)

            # Translate commentary paragraph text
            def translate_commentary_p(match):
                tag = match.group(0)
                content_match = re.search(r'>([^<]+)<', tag)
                if content_match:
                    original_text = content_match.group(1)
                    translated_text = self.translator.translate_text(original_text)
                    return tag.replace(original_text, translated_text)
                return tag

            # Find and translate paragraphs in commentary sections
            result = re.sub(
                r'<p>(?!<)[^<]+</p>',
                translate_commentary_p,
                result,
                flags=re.DOTALL
            )

            return result

        except Exception as e:
            print(f"  ⚠️ Error translating page {page_num}: {e}")
            return None

# ============================================================================
# BATCH PROCESSOR
# ============================================================================

class BatchProcessor:
    """Processes pages in batches to manage memory"""

    def __init__(self, text_dir: str, batch_size: int = 30):
        self.text_dir = Path(text_dir)
        self.batch_size = batch_size
        self.translator = PageTranslator(TRANSLATION_GLOSSARY)
        self.progress_file = Path('translation_progress.json')

    def get_all_pages(self) -> List[Path]:
        """Get all English HTML pages (non-_ro versions)"""
        pages = []
        for html_file in sorted(self.text_dir.glob('page_*.html')):
            if '_ro' not in html_file.name:
                pages.append(html_file)
        return pages

    def load_progress(self) -> Dict:
        """Load previous translation progress"""
        if self.progress_file.exists():
            with open(self.progress_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {'translated': [], 'failed': []}

    def save_progress(self, progress: Dict):
        """Save translation progress"""
        with open(self.progress_file, 'w', encoding='utf-8') as f:
            json.dump(progress, f, ensure_ascii=False, indent=2)

    def process_batches(self):
        """Process all pages in batches"""
        pages = self.get_all_pages()
        progress = self.load_progress()

        print(f"\n{'='*70}")
        print(f"📖 GUNS, GERMS & STEEL - ROMANIAN TRANSLATION")
        print(f"{'='*70}")
        print(f"📊 Total pages to process: {len(pages)}")
        print(f"   Already translated: {len(progress['translated'])}")
        print(f"   Failed: {len(progress['failed'])}")
        print(f"   Batch size: {self.batch_size}\n")

        total_batches = (len(pages) + self.batch_size - 1) // self.batch_size

        for batch_num in range(total_batches):
            start_idx = batch_num * self.batch_size
            end_idx = min(start_idx + self.batch_size, len(pages))
            batch_pages = pages[start_idx:end_idx]

            print(f"🔄 Batch {batch_num + 1}/{total_batches} | Pages {start_idx + 1}-{end_idx}")
            print(f"{'-'*70}")

            batch_count = 0
            for page_file in batch_pages:
                try:
                    match = re.search(r'page_(\d+)', page_file.name)
                    if not match:
                        continue

                    page_num = int(match.group(1))

                    if page_file.name in progress['translated']:
                        print(f"   ✓ p{page_num:03d} (cached)")
                        batch_count += 1
                        continue

                    # Read English page
                    with open(page_file, 'r', encoding='utf-8') as f:
                        english_html = f.read()

                    # Translate
                    romanian_html = self.translator.translate_page(english_html, page_num)

                    if romanian_html:
                        # Generate output filename
                        output_filename = page_file.name.replace('.html', '_ro.html')
                        output_path = self.text_dir / output_filename

                        # Write Romanian version
                        with open(output_path, 'w', encoding='utf-8') as f:
                            f.write(romanian_html)

                        progress['translated'].append(page_file.name)
                        batch_count += 1
                        print(f"   ✓ p{page_num:03d} → {output_filename}")
                    else:
                        progress['failed'].append(page_file.name)
                        print(f"   ✗ p{page_num:03d} (translation failed)")

                except Exception as e:
                    progress['failed'].append(page_file.name)
                    print(f"   ✗ p{page_num:03d}: {str(e)[:40]}")

            # Save progress after each batch
            self.save_progress(progress)
            print(f"\n   ✅ {batch_count} pages processed. Progress saved.\n")

        # Final summary
        print("\n" + "="*70)
        print(f"✅ TRANSLATION COMPLETE!")
        print(f"{'='*70}")
        print(f"   ✓ Translated: {len(progress['translated'])}/{len(pages)} pages")
        print(f"   ✗ Failed: {len(progress['failed'])} pages")
        success_rate = (len(progress['translated']) / len(pages) * 100) if pages else 0
        print(f"   📊 Success rate: {success_rate:.1f}%")
        print(f"{'='*70}\n")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == '__main__':
    processor = BatchProcessor('text', batch_size=30)
    processor.process_batches()
