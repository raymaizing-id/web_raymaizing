#!/usr/bin/env python3
"""
Script untuk mendownload semua CDN resources
"""
import os
import urllib.request
import urllib.error
from pathlib import Path

# Daftar semua CDN yang perlu didownload
CDN_RESOURCES = {
    # CSS Files
    'css': [
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/css/sintraweb.shared.8901e777c.min.css',
            'path': 'assets/css/vendor/sintraweb.shared.min.css'
        },
        {
            'url': 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            'path': 'assets/css/vendor/swiper-bundle.min.css'
        },
    ],
    
    # JavaScript Libraries
    'js': [
        {
            'url': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
            'path': 'assets/js/vendor/gsap.min.js'
        },
        {
            'url': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
            'path': 'assets/js/vendor/ScrollTrigger.min.js'
        },
        {
            'url': 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollToPlugin.min.js',
            'path': 'assets/js/vendor/ScrollToPlugin.min.js'
        },
        {
            'url': 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js',
            'path': 'assets/js/vendor/js.cookie.min.js'
        },
        {
            'url': 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
            'path': 'assets/js/vendor/swiper-bundle.min.js'
        },
        {
            'url': 'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js',
            'path': 'assets/js/vendor/jquery-3.5.1.min.js'
        },
        # Webflow chunks
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.36b8fb49256177c8.js',
            'path': 'assets/js/vendor/sintraweb.schunk.1.js'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.8208d3e53b97e3c7.js',
            'path': 'assets/js/vendor/sintraweb.schunk.2.js'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.af25e2162ac3d9cd.js',
            'path': 'assets/js/vendor/sintraweb.schunk.3.js'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.808128f14c542b1f.js',
            'path': 'assets/js/vendor/sintraweb.schunk.4.js'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.a5328fc6e4f79712.js',
            'path': 'assets/js/vendor/sintraweb.schunk.5.js'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.schunk.9dfb96661114d3db.js',
            'path': 'assets/js/vendor/sintraweb.schunk.6.js'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/js/sintraweb.2cf7bfe0.c4068cd94baf5c0c.js',
            'path': 'assets/js/vendor/sintraweb.main.js'
        },
    ],
    
    # Images
    'images': [
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6644ef2f86dc4935ea9a4150_faviconNEW.png',
            'path': 'assets/img/favicon.png'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6644ef81b8925728392cd273_webclip.png',
            'path': 'assets/img/webclip.png'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/66253c9440f55447fcfdc8d7_logo.webp',
            'path': 'assets/img/logo.webp'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6628e2d9b36b0b9ab9ae8974_logo-gradient.svg',
            'path': 'assets/img/logo-gradient.svg'
        },
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/6644bb86873663f1db3a68cd_sintra-home-opengraph.jpg',
            'path': 'assets/img/og-image.jpg'
        },
    ],
    
    # Videos
    'videos': [
        {
            'url': 'https://d1oil5daeuar1j.cloudfront.net/vizzy_waving.mp4',
            'path': 'assets/videos/hero-bg.mp4'
        },
        {
            'url': 'https://d1oil5daeuar1j.cloudfront.net/vizzy_waving.webm',
            'path': 'assets/videos/hero-bg.webm'
        },
    ],
    
    # Lottie animations
    'lottie': [
        {
            'url': 'https://cdn.prod.website-files.com/661d4f6d81ac1042b721396c/67990b231ddfaa0ed9024665_data.lottie',
            'path': 'assets/lottie/data-animation.lottie'
        },
    ],
}

def download_file(url, filepath):
    """Download file dari URL ke filepath"""
    try:
        # Create directory if not exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        print(f"Downloading: {url}")
        print(f"  -> {filepath}")
        
        # Download file
        urllib.request.urlretrieve(url, filepath)
        print(f"  ✓ Success\n")
        return True
        
    except urllib.error.URLError as e:
        print(f"  ✗ Error: {e}\n")
        return False
    except Exception as e:
        print(f"  ✗ Unexpected error: {e}\n")
        return False

def main():
    """Main function"""
    print("=" * 60)
    print("CDN DOWNLOADER - Raymaizing Landing Page")
    print("=" * 60)
    print()
    
    total_files = sum(len(resources) for resources in CDN_RESOURCES.values())
    downloaded = 0
    failed = 0
    
    for category, resources in CDN_RESOURCES.items():
        print(f"\n{'='*60}")
        print(f"Category: {category.upper()}")
        print(f"{'='*60}\n")
        
        for resource in resources:
            if download_file(resource['url'], resource['path']):
                downloaded += 1
            else:
                failed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("DOWNLOAD SUMMARY")
    print("=" * 60)
    print(f"Total files: {total_files}")
    print(f"Downloaded: {downloaded}")
    print(f"Failed: {failed}")
    print("=" * 60)
    
    if failed == 0:
        print("\n✓ All files downloaded successfully!")
    else:
        print(f"\n⚠ {failed} file(s) failed to download")
    
    print("\nNext steps:")
    print("1. Update HTML to use local paths")
    print("2. Test website offline")
    print("3. Verify all resources load correctly")

if __name__ == "__main__":
    main()
