// Main JavaScript - Load order is important!

// 1. Core Initialization (must load first)
// - webflow-init.js (inline in head for immediate execution)
// - intellimize-storage.js (inline in head)
// - webflow-ready.js (inline in head)
// - intellimize-init.js (inline in head)
// - intellimize-loader.js (inline in head)

// 2. Consent & Privacy
// - termly-consent.js (inline in head)

// 3. Analytics & Tracking (load early)
// - clarity-analytics.js (inline in head)
// - gtm-init.js (inline in head)
// - impact-tracking.js (inline in head)

// 4. User Identification
// - mixpanel-identify.js (inline in head)
// - mixpanel-init.js (inline in head)

// 5. A/B Testing & Experimentation
// - growthbook-config.js (inline in head)

// 6. Event Handlers
// - click-handler.js (inline in head)

// 7. External Libraries (loaded via CDN in HTML)
// - jQuery 3.5.1
// - GSAP 3.13.0 + ScrollTrigger + ScrollToPlugin
// - Klaviyo
// - TrustPilot
// - js-cookie
// - Swiper
// - Webflow chunks

// 8. Application Scripts (load after DOM ready)
// - intercom-config.js
// - scroll-to-section.js
// - impact-identify.js

// Note: Most scripts are kept inline in HTML head for performance
// This file serves as documentation of the loading order
