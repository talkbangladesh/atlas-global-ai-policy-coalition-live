// Copy this file to web3forms-config.js for local form testing.
// Never commit the real access keys to a public repository.
const web3formsRoute = window.location.pathname.replace(/\/+$/, '') || '/';
if (web3formsRoute === '/contribute/submit') {
  window.WEB3FORMS_PUBLICATION_ACCESS_KEY = 'YOUR_PUBLICATION_WEB3FORMS_ACCESS_KEY';
} else {
  window.WEB3FORMS_ACCESS_KEY = 'YOUR_MEMBERSHIP_WEB3FORMS_ACCESS_KEY';
}
