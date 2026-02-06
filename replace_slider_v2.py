#!/usr/bin/env python3
"""
Script to replace old slider with new modern design - Version 2
More robust with line-based replacement
"""

def replace_slider_v2():
    print("🚀 Reading index.html...")
    
    # Read the current index.html line by line
    with open('index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Read the new slider design
    with open('NEW_SLIDER_DESIGN.html', 'r', encoding='utf-8') as f:
        new_slider_content = f.read()
    
    print(f"📄 Total lines in index.html: {len(lines)}")
    
    # Find start line (line 1486 - 1 because list is 0-indexed)
    start_line_idx = 1485  # Line 1486 in editor = index 1485
    end_line_idx = 1991    # Line 1992 in editor = index 1991 (we keep this line)
    
    # Verify we're at the right place
    if 'section_home-helpers background-color-alternate' in lines[start_line_idx]:
        print(f"✅ Found start marker at line {start_line_idx + 1}")
    else:
        print(f"❌ ERROR: Start marker not found at expected line!")
        print(f"   Line {start_line_idx + 1}: {lines[start_line_idx][:100]}")
        return False
    
    if 'section_home-automations background-color-alternate' in lines[end_line_idx]:
        print(f"✅ Found end marker at line {end_line_idx + 1}")
    else:
        print(f"❌ ERROR: End marker not found at expected line!")
        print(f"   Line {end_line_idx + 1}: {lines[end_line_idx][:100]}")
        return False
    
    # Create backup
    print("💾 Creating backup...")
    with open('index-backup-v2.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("✅ Backup created: index-backup-v2.html")
    
    # Build new content
    print("🔨 Building new content...")
    new_lines = []
    
    # Add lines before slider (0 to start_line_idx-1)
    new_lines.extend(lines[:start_line_idx])
    
    # Add new slider content
    new_lines.append(new_slider_content)
    new_lines.append('\n')
    
    # Add lines after slider (from end_line_idx onwards)
    new_lines.extend(lines[end_line_idx:])
    
    # Write new content
    print("💾 Writing new index.html...")
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("=" * 60)
    print("✅ SUCCESS! Slider replaced successfully!")
    print("=" * 60)
    print("📊 Changes:")
    print(f"   - Removed: {end_line_idx - start_line_idx} lines")
    print(f"   - Added: New modern slider with 6 bots")
    print("")
    print("🤖 New Bots:")
    print("   1. Archi - Organizing & Arsip")
    print("   2. Scribe - Press Release")
    print("   3. Recap - Ringkasan Kegiatan")
    print("   4. Rapo - Laporan Pimpinan")
    print("   5. Findy - Pencari Arsip")
    print("   6. Alerti - Alert & Monitoring")
    print("")
    print("🎨 Design:")
    print("   - Video kotak 1:1 (square)")
    print("   - Layout: Video di atas, teks di bawah")
    print("   - Responsive: 1-3 slides visible")
    print("   - Autoplay: 4 seconds")
    print("")
    print("🧪 Test at: http://localhost:8000")
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    print("=" * 60)
    print("  SLIDER REPLACEMENT - VERSION 2")
    print("=" * 60)
    print("")
    success = replace_slider_v2()
    print("")
    if not success:
        print("❌ FAILED! Check errors above")
        print("💡 TIP: Restore backup with:")
        print("   copy index-backup-v2.html index.html")
