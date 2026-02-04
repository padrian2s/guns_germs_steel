#!/usr/bin/env python3
"""
Guns, Germs, and Steel - Romanian Translation Script
Systematic translation system for managing 457 pages in chunks
"""

import os
import re
from pathlib import Path

def create_translation_skeleton(page_num):
    """Create a Romanian translation skeleton for a given page"""
    # Read English version
    en_file = f"text/page_{page_num:04d}.html"
    ro_file = f"text/page_{page_num:04d}_ro.html"
    
    if not os.path.exists(en_file):
        print(f"❌ English page {page_num} not found")
        return False
    
    # Read English content
    with open(en_file, 'r', encoding='utf-8') as f:
        en_content = f.read()
    
    # Create Romanian skeleton
    ro_content = en_content.replace(
        '<html lang="en">',
        '<html lang="ro">'
    ).replace(
        'Guns, Germs, and Steel',
        'Arme, Germeni și Oțel'
    ).replace(
        'The Fates of Human Societies',
        'Destinele Societăților Umane'
    ).replace(
        'Page PAGE_NUM of 457',
        f'Pagina {page_num} din 457'
    ).replace(
        'Original Content',
        'Conținut Original'
    ).replace(
        'Educational Analysis',
        'Analiză Educațională'
    ).replace(
        'Summary',
        'Rezumat'
    ).replace(
        'Key Concepts',
        'Concepte Cheie'
    ).replace(
        'Historical & Geographic Context',
        'Context Istoric și Geografic'
    ).replace(
        'Connection to Main Thesis',
        'Conexiune cu Teza Principală'
    )
    
    # Save Romanian skeleton
    with open(ro_file, 'w', encoding='utf-8') as f:
        f.write(ro_content)
    
    print(f"✅ Created Romanian skeleton for page {page_num}")
    return True

def translate_chunk(start_page, end_page):
    """Translate a chunk of pages"""
    print(f"📚 Translating pages {start_page} to {end_page}...")
    
    for page_num in range(start_page, end_page + 1):
        success = create_translation_skeleton(page_num)
        if success:
            print(f"  ✅ Page {page_num}: Skeleton created - ready for manual translation")
        else:
            print(f"  ❌ Page {page_num}: Failed")
    
    print(f"🎉 Completed chunk {start_page}-{end_page}")

def main():
    """Main translation management"""
    print("🌍 Guns, Germs, and Steel - Romanian Translation System")
    print("=" * 50)
    
    # Create text directory if it doesn't exist
    os.makedirs("text", exist_ok=True)
    
    # Translate in chunks of 10 pages
    total_pages = 457
    chunk_size = 10
    
    for start_page in range(1, total_pages + 1, chunk_size):
        end_page = min(start_page + chunk_size - 1, total_pages)
        translate_chunk(start_page, end_page)
        
        # Ask before continuing to next chunk
        if end_page < total_pages:
            print(f"\n🔄 Processed up to page {end_page}")
            print(f"📊 Progress: {end_page}/{total_pages} pages ({end_page/total_pages*100:.1f}%)")
            print("💡 You can now:")
            print("  1. Manually translate the created Romanian skeletons")
            print("  2. Continue with next chunk")
            print("  3. Stop and resume later")
            
            # In a real script, you would ask for user input here
            # For now, we'll continue automatically
            print("⏳ Continuing to next chunk in 3 seconds...")
            # time.sleep(3)  # Uncomment for actual use

if __name__ == "__main__":
    main()