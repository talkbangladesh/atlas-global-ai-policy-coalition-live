# Global Member Contributions & Article Submission System

The contribution system uses `/contribute/`, `/contribute/submit/`, `/contributions/` and `/contributions/{slug}/`. The homepage and publication pages invite visitors to “Share your thoughts.”

## Submission behavior

Members and external contributors can submit through `/contribute/submit/`. The form collects the submitter’s name, email address and complete article or thought in the message field. It accepts written text directly and does not require a Drive link or file upload. Contributors should submit only writing they created or have permission to share.

Each submission is sent privately with `form_type=article_submission` through the dedicated `WEB3FORMS_PUBLICATION_ACCESS_KEY`. The form reports success only after Web3Forms returns a successful response. Submissions are for editorial consideration and do not guarantee acceptance or publication. No submission changes the member registry or public contribution library automatically.

## Editorial workflow

The intended statuses are Submitted, Under Review, Revision Requested, Approved, Rejected and Published. The public library reads only `data/contributions.json`, whose current published list is empty. An authorized editor must review authorship, relevance, originality, accuracy, references, editorial quality, privacy and legal considerations before adding an approved contribution to the public dataset.

The current repository does not include an authenticated admin dashboard. A production implementation should add role-based editor authentication, private submission storage, audit logs, revision requests, moderation status transitions and a controlled publication export. No article is automatically published.

## Validation status

The form validates required name, email and article/thought fields and uses the route-specific publication Web3Forms key. No real submission was sent during development. Successful email delivery depends on the publication key’s Web3Forms destination and dashboard configuration.
