# Web3Forms integration

The membership application at `/membership/apply/` and general contact form at `/contact/` submit with `POST` and `FormData` to `https://api.web3forms.com/submit` using `WEB3FORMS_ACCESS_KEY`. Article submissions at `/contribute/submit/` use the separate `WEB3FORMS_PUBLICATION_ACCESS_KEY`; that key is referenced only by the article submission flow. The form collects the submitter’s name, email and article/thought text. The site loads both values from the ignored local runtime file `web3forms-config.js`.

The membership form validates required application information, at least one expertise area, and consent. Article submissions require a name, email and article/thought text. The complete writing is sent to the editorial team for review; no file upload is required.

The UI shows success only after Web3Forms returns an HTTP success response with `success: true`. It disables the submit button while sending and displays validation and service errors. Applications and article submissions never update the member registry or publish content automatically. Membership approval and editorial publication remain authorized administrative decisions.

Do not commit `web3forms-config.js` or publish it in a public source repository. Production deployment must provide the runtime configuration separately. The provided example file contains placeholders only. No real application or publication submission was sent during validation; successful delivery still depends on the respective Web3Forms dashboard destination being configured and verified.
