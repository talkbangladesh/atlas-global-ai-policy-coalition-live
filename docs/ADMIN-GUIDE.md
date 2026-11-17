# Administration guide

The current repository is a public static registry and has no admin dashboard. Do not pretend it has authenticated editing. Recommended production implementation: a separate authenticated admin service with role-based access, audit logs, schema validation, duplicate detection, controlled photo uploads and an export pipeline that publishes reviewed JSON. Keep credentials and tokens outside Git.
