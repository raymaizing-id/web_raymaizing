// ============================================
// STICKY NAVBAR & SMOOTH SCROLL
// ============================================

(function() {
  'use strict';
  
  console.log('🚀 Sticky Navbar Script Loaded');
  
  // Wait for DOM to be ready
  function init() {
    console.log('🔧 Initializing Sticky Navbar...');
    
    // 1. MAKE NAVBAR STICKY
    makeNavbarSticky();
    
    // 2. SETUP SMOOTH SCROLL
    setupSmoothScroll();
    
    console.log('✅ Sticky Navbar Initialized!');
  }
  
  // ============================================
  // 1. STICKY NAVBAR FUNCTIONALITY
  // ============================================
  function makeNavbarSticky() {
    var header = document.querySelector('.header-transparent');
    
    if (!header) {
      console.error('❌ Header not found');
      return;
    }
    
    // Force navbar to be fixed
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    header.style.width = '100%';
    header.style.zIndex = '9999';
    
    // Add scroll listener for background change
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        // Scrolled down - add background
        header.style.background = 'rgba(0, 0, 0, 0.85)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.webkitBackdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
      } else {
        // At top - transparent
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
        header.style.boxShadow = 'none';
      }
    });
    
    // Set initial state
    header.style.background = 'transparent';
    header.style.transition = 'all 0.3s ease';
    
    console.log('✅ Navbar is now sticky');
  }
  
  // ============================================
  // 2. SMOOTH SCROLL FUNCTIONALITY
  // ============================================
  function setupSmoothScroll() {
    // Section mapping: menu text → section ID
    var sectionMap = {
      'Products': 'team-section',
      'Features': 'features-section',
      'Pricing': 'pricing-section',
      'Resources': 'features-section',
      'Careers': 'testimonials-section',
      'Integrations': 'integrations-section'
    };
    
    // Get all clickable elements in navbar
    var navLinks = document.querySelectorAll('.navbar__link, .navbar__drawer_trigger');
    
    console.log('📋 Found', navLinks.length, 'navbar links');
    
    navLinks.forEach(function(link) {
      var text = link.textContent.trim();
      var targetId = sectionMap[text];
      
      if (targetId) {
        console.log('🔗 Setting up:', text, '→', targetId);
        
        // Add click handler
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          scrollToSection(targetId);
        });
        
        // Change cursor
        link.style.cursor = 'pointer';
      }
    });
    
    // Handle logo click - scroll to top
    var logo = document.querySelector('.navbar__logo');
    if (logo) {
      logo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        console.log('🏠 Scrolling to top');
      });
      logo.style.cursor = 'pointer';
    }
    
    // Handle "Get Started" buttons
    var getStartedButtons = document.querySelectorAll('a[href="/pricing"], a[href*="pricing"]');
    getStartedButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToSection('pricing-section');
      });
    });
    
    console.log('✅ Smooth scroll setup complete');
  }
  
  // ============================================
  // SCROLL TO SECTION HELPER
  // ============================================
  function scrollToSection(sectionId) {
    console.log('📍 Scrolling to:', sectionId);
    
    var target = document.getElementById(sectionId);
    
    if (!target) {
      console.warn('⚠️ Section not found:', sectionId);
      return;
    }
    
    // Get navbar height for offset
    var navbar = document.querySelector('.header-transparent');
    var navbarHeight = navbar ? navbar.offsetHeight : 80;
    
    // Calculate position
    var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    
    // Smooth scroll
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    closeMobileMenu();
    
    console.log('✅ Scrolled to:', sectionId);
  }
  
  // ============================================
  // CLOSE MOBILE MENU
  // ============================================
  function closeMobileMenu() {
    var menu = document.querySelector('.navbar__menu');
    var burger = document.querySelector('.navbar__burger');
    var navbar = document.querySelector('.navbar');
    
    if (menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      if (burger) burger.classList.remove('active');
      if (navbar) navbar.classList.remove('active');
      console.log('📱 Mobile menu closed');
    }
  }
  
  // ============================================
  // INITIALIZE
  // ============================================
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also run on window load (backup)
  window.addEventListener('load', function() {
    setTimeout(init, 100);
  });
  
})();
