#!/usr/bin/env python3
"""
Script untuk membuat versi offline dari website
Mengganti semua CDN URLs dengan local paths
"""
import re
from pathlib import Path

def create_offline_html():
    """Membuat versi offline dari HTML"""
    
    # Read original HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    print("=" * 60)
    print("CREATING OFFLINE VERSION")
    print("=" * 60)
    print()
    
    replacements = []
    
    # 1. Replace Webflow shared CSS
    old = 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/css/sintraweb.shared.8901e777c.min.css'
    new = 'assets/css/vendor/sintraweb.shared.min.css'
    if old in html_content:
        html_content = html_content.replace(old, new)
        replacements.append(f"✓ Webflow CSS: {old} → {new}")
    
    # 2. Replace jQuery
    old = 'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=661d4f6d81ac1042b721396c'
    new = 'assets/js/vendor/jquery-3.5.1.min.js'
    if old in html_content:
        html_content = html_content.replace(old, new)
        replacements.append(f"✓ jQuery: {old} → {new}")
    
    # 3. Replace GSAP libraries
    gsap_replacements = [
        ('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js', 'assets/js/vendor/gsap.min.js'),
        ('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js', 'assets/js/vendor/ScrollTrigger.min.js'),
        ('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js', 'assets/js/vendor/ScrollToPlugin.min.js'),
    ]
    for old, new in gsap_replacements:
        if old in html_content:
            html_content = html_content.replace(old, new)
            replacements.append(f"✓ GSAP: {old} → {new}")
    
    # 4. Replace js-cookie
    old = 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js'
    new = 'assets/js/vendor/js.cookie.min.js'
    if old in html_content:
        html_content = html_content.replace(old, new)
        replacements.append(f"✓ js-cookie: {old} → {new}")
    
    # 5. Replace Webflow chunks
    webflow_chunks = [
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.36b8fb49256177c8.js', 'assets/js/vendor/sintraweb.schunk.1.js'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.8208d3e53b97e3c7.js', 'assets/js/vendor/sintraweb.schunk.2.js'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.af25e2162ac3d9cd.js', 'assets/js/vendor/sintraweb.schunk.3.js'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.808128f14c542b1f.js', 'assets/js/vendor/sintraweb.schunk.4.js'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.a5328fc6e4f79712.js', 'assets/js/vendor/sintraweb.schunk.5.js'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.9dfb96661114d3db.js', 'assets/js/vendor/sintraweb.schunk.6.js'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.2cf7bfe0.c4068cd94baf5c0c.js', 'assets/js/vendor/sintraweb.main.js'),
    ]
    for old, new in webflow_chunks:
        if old in html_content:
            html_content = html_content.replace(old, new)
            replacements.append(f"✓ Webflow chunk: {old} → {new}")
    
    # 6. Replace favicon and webclip
    favicon_replacements = [
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6644ef2f86dc4935ea9a4150_faviconNEW.png', 'assets/img/favicon.png'),
        ('https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6644ef81b8925728392cd273_webclip.png', 'assets/img/webclip.png'),
    ]
    for old, new in favicon_replacements:
        if old in html_content:
            html_content = html_content.replace(old, new)
            replacements.append(f"✓ Icon: {old} → {new}")
    
    # 7. Replace logo in structured data
    old = 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6628e2d9b36b0b9ab9ae8974_logo-gradient.svg'
    new = 'assets/img/logo-gradient.svg'
    if old in html_content:
        html_content = html_content.replace(old, new)
        replacements.append(f"✓ Logo: {old} → {new}")
    
    # 8. Replace OG image
    old = 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6644bb86873663f1db3a68cd_sintra-home-opengraph.jpg'
    new = 'assets/img/og-image.jpg'
    if old in html_content:
        html_content = html_content.replace(old, new)
        replacements.append(f"✓ OG Image: {old} → {new}")
    
    # 9. Fix broken image paths (./Assets Images/imgi_15_...)
    # Replace with proper paths
    html_content = re.sub(
        r'\./Assets Images/imgi_15_[a-f0-9]+_([^"\']+)',
        r'assets/img/\1',
        html_content
    )
    replacements.append("✓ Fixed broken image paths: ./Assets Images/imgi_15_* → assets/img/*")
    
    # 10. Comment out third-party scripts that require internet
    # Intellimize
    html_content = html_content.replace(
        '<link href="https://cdn.intellimize.co/snippet/117378866.js" rel="preload" as="script" />',
        '<!-- OFFLINE MODE: Intellimize disabled -->\n    <!-- <link href="https://cdn.intellimize.co/snippet/117378866.js" rel="preload" as="script" /> -->'
    )
    
    # Klaviyo
    html_content = html_content.replace(
        '<script async="" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WD6mn5">',
        '<!-- OFFLINE MODE: Klaviyo disabled -->\n    <!-- <script async="" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WD6mn5">'
    )
    html_content = html_content.replace(
        '</script>\n    <!-- Marketing -->',
        '</script> -->\n    <!-- Marketing -->'
    )
    
    # TrustPilot
    html_content = html_content.replace(
        '<script src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async="">',
        '<!-- OFFLINE MODE: TrustPilot disabled -->\n    <!-- <script src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async="">'
    )
    
    # Cloudflare email decode
    html_content = html_content.replace(
        '<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>',
        '<!-- OFFLINE MODE: Cloudflare email decode disabled -->\n    <!-- <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script> -->'
    )
    
    replacements.append("✓ Commented out third-party scripts (Intellimize, Klaviyo, TrustPilot, Cloudflare)")
    
    # 11. Remove integrity and crossorigin attributes (not needed for local files)
    html_content = re.sub(r'\s+integrity="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+crossorigin="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+crossorigin', '', html_content)
    replacements.append("✓ Removed integrity and crossorigin attributes")
    
    # Print all replacements
    print("Replacements made:")
    print("-" * 60)
    for replacement in replacements:
        print(replacement)
    print()
    
    # Write offline version
    with open('index-offline.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("=" * 60)
    print("✓ SUCCESS: index-offline.html created!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Open index-offline.html in browser")
    print("2. Disconnect internet")
    print("3. Refresh page to test offline functionality")
    print("4. Check browser console for any errors")
    print()

if __name__ == "__main__":
    create_offline_html()
