(function() {
  var TERMLY_SRC = 'https://app.termly.io/resource-blocker/b51727e0-491b-4fb6-a2bf-ae762619a4e9?autoBlock=on';
  var TARGET_PATHS = ['/x-ca-only', '/pricing-ca-only'];
  var COOKIE_NAME = 'fs-consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

  function loadTermly() {
    if (document.querySelector('script[src="' + TERMLY_SRC + '"]')) return;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = TERMLY_SRC;

    script.onload = function() {
      Termly.on("consent", function(evt) {
        var consentState = evt && evt.consentState;
        if (!consentState) return;

        // Pick only boolean values
        var consent = {};
        for (var key in consentState) {
          if (typeof consentState[key] === 'boolean') {
            consent[key] = consentState[key];
          }
        }
        if (Object.keys(consent).length === 0) return;

        var val = encodeURIComponent(JSON.stringify(consent));

        // Clear any existing cookies
        document.cookie = COOKIE_NAME + '=; Path=/; Max-Age=0; SameSite=Lax; Secure';
        document.cookie = COOKIE_NAME + '=; Domain=sintra.ai; Path=/; Max-Age=0; SameSite=Lax; Secure';
        document.cookie = COOKIE_NAME + '=; Domain=.sintra.ai; Path=/; Max-Age=0; SameSite=Lax; Secure';

        // Write the new cookie
        document.cookie = COOKIE_NAME + '=' + val + '; Domain=.sintra.ai; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; SameSite=Lax; Secure';

        console.log("fs-consent cookie written:", val);
      });
      console.log("Termly consent listener registered");
    };

    document.head.appendChild(script);
  }

  function setAutoConsent() {
    var consent = { essential: true, analytics: true, advertising: true, performance: true, social_networking: true };
    var val = encodeURIComponent(JSON.stringify(consent));

    document.cookie = COOKIE_NAME + '=; Path=/; Max-Age=0; SameSite=Lax; Secure';
    document.cookie = COOKIE_NAME + '=; Domain=' + window.location.hostname + '; Path=/; Max-Age=0; SameSite=Lax; Secure';
    document.cookie = COOKIE_NAME + '=; Domain=.sintra.ai; Path=/; Max-Age=0; SameSite=Lax; Secure';
    document.cookie = COOKIE_NAME + '=' + val + '; Domain=.sintra.ai; Path=/; Max-Age=' + COOKIE_MAX_AGE + '; SameSite=Lax; Secure';
  }

  var isTargetPage = TARGET_PATHS.some(function(path) {
    return window.location.pathname === path || window.location.pathname === path + '/';
  });

  if (!isTargetPage) {
    loadTermly();
    return;
  }

  fetch(window.location.href, { method: 'HEAD' })
    .then(function(res) {
      var country = res.headers.get('x-user-country');
      var region = res.headers.get('x-user-region');
      
      var isUS = country === 'US';
      var isCalifornia = region === 'California';

      if (!isUS || isCalifornia) {
        loadTermly();
      } else {
        setAutoConsent();
      }
    })
    .catch(function() {
      loadTermly();
    });
})();
