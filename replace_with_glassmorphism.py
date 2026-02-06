#!/usr/bin/env python3
"""
Replace the slider section with glassmorphism design
"""

def replace_slider():
    # Read the current index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Read the new glassmorphism slider
    with open('GLASSMORPHISM_SLIDER.html', 'r', encoding='utf-8') as f:
        new_slider = f.read()
    
    # Find the start and end markers
    start_marker = '<!-- GLASSMORPHISM SLIDER - Modern & Futuristic Design -->'
    end_marker = '</div>\n\n        <div class="section_home-automations background-color-alternate">'
    
    start_index = content.find(start_marker)
    end_index = content.find(end_marker)
    
    if start_index == -1 or end_index == -1:
        print("❌ Could not find slider section markers")
        return False
    
    # Replace the section
    new_content = (
        content[:start_index] +
        new_slider +
        '\n\n        <div class="section_home-automations background-color-alternate">' +
        content[end_index + len(end_marker):]
    )
    
    # Write the new content
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Slider section replaced successfully!")
    print(f"📊 Old content length: {len(content)}")
    print(f"📊 New content length: {len(new_content)}")
    return True

if __name__ == '__main__':
    replace_slider()
