import re
import os
from bs4 import BeautifulSoup

# Read HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Create assets directories if they don't exist
os.makedirs('assets/css', exist_ok=True)
os.makedirs('assets/js', exist_ok=True)
os.makedirs('assets/fonts', exist_ok=True)
os.makedirs('assets/img', exist_ok=True)

# Extract inline styles
inline_styles = []
style_counter = 1

for style_tag in soup.find_all('style'):
    style_content = style_tag.string
    if style_content:
        filename = f'inline-style-{style_counter}.css'
        with open(f'assets/css/{filename}', 'w', encoding='utf-8') as f:
            f.write(style_content)
        inline_styles.append(filename)
        # Replace style tag with link
        link_tag = soup.new_tag('link', rel='stylesheet', href=f'assets/css/{filename}')
        style_tag.replace_with(link_tag)
        style_counter += 1

# Extract inline scripts
inline_scripts = []
script_counter = 1

for script_tag in soup.find_all('script'):
    if script_tag.string and not script_tag.get('src'):
        script_content = script_tag.string
        if script_content.strip():
            filename = f'inline-script-{script_counter}.js'
            with open(f'assets/js/{filename}', 'w', encoding='utf-8') as f:
                f.write(script_content)
            inline_scripts.append(filename)
            # Replace script tag with external script
            new_script = soup.new_tag('script', src=f'assets/js/{filename}')
            if script_tag.get('type'):
                new_script['type'] = script_tag['type']
            script_tag.replace_with(new_script)
            script_counter += 1

# Write modified HTML
with open('index_clean.html', 'w', encoding='utf-8') as f:
    f.write(str(soup.prettify()))

print(f"Extracted {len(inline_styles)} inline styles")
print(f"Extracted {len(inline_scripts)} inline scripts")
print("Modified HTML saved as index_clean.html")
