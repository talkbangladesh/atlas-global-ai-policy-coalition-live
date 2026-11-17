# Member import guide

1. Prepare a reviewed workbook or CSV with public-approved fields.
2. Map only verified fields; leave unknown values null.
3. Run the import process and inspect the diff.
4. Run `python3 scripts/validate-members.py`.
5. Review privacy and publication approval before pushing.

The current source workbook import is reproducible via `/home/ubuntu/build_registry.py` during development; production updates should use a reviewed importer committed to the repository.
