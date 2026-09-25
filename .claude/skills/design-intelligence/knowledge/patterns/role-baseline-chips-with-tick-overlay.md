---
name: Role-baseline chips with tick overlay
description: Permission UI: role-granted capabilities render as locked 'from role' chips while per-user extras are checkboxes, so effective access = baseline union ticks stays legible in one glance
domains: [layout, forms]
product_types: [admin, dashboard, saas]
tags: [permissions, rbac, overlay]
source: LofiHub Admin Permissions tab
added: 2026-08-14
---
Rows have three states: locked chip (role grants it, checkbox absent so the UI cannot lie), ticked, off. Section master toggle governs only tickable keys. Save is diff-based with dirty indicator + Cancel restoring the saved set. Copy-from loads another person's ticks as pending, not saved.
