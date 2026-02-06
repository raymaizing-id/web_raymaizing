#!/usr/bin/env python3
"""
Script untuk copy gambar dari Assets Images ke assets/img
dan membuat mapping untuk replacement
"""
import os
import shutil
from pathlib import Path

def copy_images():
    """Copy images dari Assets Images ke assets/img"""
    
    source_dir = Path('Assets Images')
    target_dir = Path('assets/img')
    
    # Create target directory if not exists
    target_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("COPYING IMAGES")
    print("=" * 60)
    print()
    
    # Get all files from Assets Images
    image_files = list(source_dir.glob('*'))
    
    copied = 0
    skipped = 0
    
    for image_file in image_files:
        if image_file.is_file():
            # Extract the actual filename from imgi_X_HASH_filename.ext pattern
            filename = image_file.name
            
            # Skip download files (they're not needed)
            if filename.startswith('download'):
                skipped += 1
                continue
            
            # Extract real filename from pattern: imgi_X_HASH_filename.ext
            if filename.startswith('imgi_'):
                # Split by underscore and get the part after the hash
                parts = filename.split('_', 2)  # Split into max 3 parts
                if len(parts) >= 3:
                    # Get everything after the hash (filename.ext)
                    real_filename = parts[2]
                else:
                    real_filename = filename
            else:
                real_filename = filename
            
            # Copy file
            target_path = target_dir / real_filename
            
            try:
                shutil.copy2(image_file, target_path)
                print(f"✓ Copied: {filename}")
                print(f"  → {real_filename}")
                copied += 1
            except Exception as e:
                print(f"✗ Error copying {filename}: {e}")
                skipped += 1
    
    print()
    print("=" * 60)
    print(f"✓ Copied {copied} images")
    print(f"⊘ Skipped {skipped} files")
    print("=" * 60)
    print()

if __name__ == "__main__":
    copy_images()
