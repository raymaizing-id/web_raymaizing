function identifyUserByCookie() {
  // Retrieve the 'mp_distinct_id' cookie value
  const cookies = document.cookie.split('; ');
  const mpCookie = cookies.find(cookie => cookie.startsWith('mp_distinct_id='));
  if (mpCookie) {
    const mpDistinctId = mpCookie.split('=')[1];
    if (mpDistinctId) {
      // Identify the user in Mixpanel
      mixpanel.identify(mpDistinctId);
    }
  }
}
