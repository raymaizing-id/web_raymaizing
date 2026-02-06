// Scroll to section functionality with GSAP
function setupScrollToLinks() {
  document.querySelectorAll('[data-scroll-to]').forEach(link => {
    const linkTag = link.getAttribute('data-scroll-to');
    const linkPageTag = link.getAttribute('data-scroll-to-page');

    if (document.querySelector(`[data-scroll-section="${linkTag}"]`)) {
      link.addEventListener('click', e => {
        e.preventDefault();
        scrollToSection(linkTag);
      });
    } else {
      if (linkPageTag || linkPageTag === '') {
        link.setAttribute('href', `/${linkPageTag}#${linkTag}`);
      } else {
        link.setAttribute('href', `/#${linkTag}`);
      }
    }
  });
}

function scrollToSection(sectionTag) {
  const targetSection = document.querySelector(`[data-scroll-section="${sectionTag}"]`);
  if (targetSection) {
    setTimeout(() => {
      ScrollTrigger.refresh();
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: targetSection, offsetY: 0, autoKill: false },
        ease: 'power2.inOut',
        onComplete: () => {
          history.pushState(null, '', `#${sectionTag}`);
        }
      });
    }, 50);
  }
}

document.addEventListener('DOMContentLoaded', setupScrollToLinks);

window.addEventListener('load', () => {
  if (window.location.hash) {
    const sectionTag = window.location.hash.slice(1);
    scrollToSection(sectionTag);
  }
});
