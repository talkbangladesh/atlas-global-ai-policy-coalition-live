# Founding Committee guide

The official Founding Committee is stored in `data/founding-committee.json` as a separate dataset. It contains exactly eight entries and preserves the supplied names, designations and responsibilities exactly. Each entry references an existing `member_id` and `profile_slug`; biographies, qualifications, institutions and contact data are never duplicated.

The roster was checked against all existing records before linking. Gábor Soós, PhD was found in the audited dataset under the existing record `AGPC-038` despite spelling/diacritic differences, so no ninth or duplicate member record was created. Atlas AI Institute is displayed separately as the Institutional Host & Secretariat.

The dedicated route is `/leadership/founding-committee/`. The same committee dataset drives the homepage section and the dedicated page, so names and titles cannot drift between views. Run `python3 scripts/validate-founding-committee.py` before review or publication.
