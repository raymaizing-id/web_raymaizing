#!/usr/bin/env python3
"""
Script untuk mengganti semua CDN image URLs dengan local paths
"""
import re

def replace_cdn_images():
    """Replace all CDN image URLs in offline HTML"""
    
    # Read offline HTML
    with open('index-offline.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    print("=" * 60)
    print("REPLACING CDN IMAGE URLS")
    print("=" * 60)
    print()
    
    replacements_count = 0
    
    # Pattern to match CDN URLs for images
    # https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/HASH_filename.ext
    # https://cdn.prod.website-files.com/673ead940412138dd4bf8e83%2FHASH_filename.ext
    
    pattern = r'https://cdn\.prod\.website-files\.com/[a-zA-Z0-9]+(?:%2F)?/([a-zA-Z0-9_%-]+\.(jpg|jpeg|png|svg|webp|avif|gif|lottie))'
    
    def replace_url(match):
        nonlocal replacements_count
        full_url = match.group(0)
        filename = match.group(1)
        
        # Decode URL-encoded characters
        filename = filename.replace('%2F', '/')
        
        # New local path
        new_path = f'assets/img/{filename}'
        
        replacements_count += 1
        if replacements_count <= 10:  # Print first 10 replacements
            print(f"✓ {full_url}")
            print(f"  → {new_path}")
            print()
        
        return new_path
    
    # Replace all CDN image URLs
    html_content = re.sub(pattern, replace_url, html_content, flags=re.IGNORECASE)
    
    if replacements_count > 10:
        print(f"... and {replacements_count - 10} more replacements")
        print()
    
    # Also replace video CDN URLs
    # https://cdn.prod.website-files.com/673ead940412138dd4bf8e83%2FHASH_filename.mp4
    # https://cdn.prod.website-files.com/673ead940412138dd4bf8e83%2FHASH_filename.webm
    
    video_pattern = r'https://cdn\.prod\.website-files\.com/[a-zA-Z0-9]+(?:%2F)?/([a-zA-Z0-9_%-]+\.(mp4|webm))'
    
    video_count = 0
    def replace_video_url(match):
        nonlocal video_count
        full_url = match.group(0)
        filename = match.group(1)
        
        # Decode URL-encoded characters
        filename = filename.replace('%2F', '/')
        
        # For now, comment out videos as they're not downloaded yet
        # We'll keep the URL but add a comment
        video_count += 1
        return f'<!-- VIDEO NOT AVAILABLE OFFLINE: {full_url} -->'
    
    html_content = re.sub(video_pattern, replace_video_url, html_content, flags=re.IGNORECASE)
    
    print(f"✓ Replaced {replacements_count} image URLs")
    print(f"✓ Commented out {video_count} video URLs (not downloaded)")
    print()
    
    # Write updated HTML
    with open('index-offline.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("=" * 60)
    print("✓ SUCCESS: CDN images replaced!")
    print("=" * 60)
    print()

if __name__ == "__main__":
    replace_cdn_images()
