#!/usr/bin/env python3
"""
Script to replace old slider with new modern design
"""

def replace_slider():
    # Read the current index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Read the new slider design
    with open('NEW_SLIDER_DESIGN.html', 'r', encoding='utf-8') as f:
        new_slider = f.read()
    
    # Find the start and end markers
    start_marker = '<div class="section_home-helpers background-color-alternate">'
    end_marker = '</div>\n        </div>\n        <div class="section_home-automations background-color-alternate">'
    
    # Find positions
    start_pos = content.find(start_marker)
    end_pos = content.find(end_marker, start_pos)
    
    if start_pos == -1 or end_pos == -1:
        print("Error: Could not find slider section markers")
        return False
    
    # Extract before and after sections
    before = content[:start_pos]
    after = content[end_pos:]
    
    # Combine with new slider
    new_content = before + new_slider + '\n        ' + after
    
    # Backup original file
    with open('index-backup-before-slider-redesign.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Backup created: index-backup-before-slider-redesign.html")
    
    # Write new content
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("✅ Slider replaced successfully!")
    print("✅ New slider with 6 bots (Archi, Scribe, Recap, Rapo, Findy, Alerti)")
    print("✅ Video layout: Square 1:1 aspect ratio")
    print("✅ Layout: Video on top, text below")
    
    return True

if __name__ == '__main__':
    print("🚀 Starting slider replacement...")
    print("=" * 50)
    success = replace_slider()
    print("=" * 50)
    if success:
        print("✅ Done! Please test at http://localhost:8000")
    else:
        print("❌ Failed! Check error messages above")
