# Sanity CMS Dataset Sync Guide (legacy)

> **June 2026:** Studio and www both use the **production** dataset. There is no editor-facing staging site. Use this guide only for one-off engineering maintenance on the legacy `preview` dataset — not for day-to-day publishing.

This guide explains how to overwrite the `preview` dataset with content from `production` (or the reverse via `pnpm sanity:sync-to-production`).

---

## Method 1: Official Sanity CLI Export/Import (Recommended)

This is the safest and most robust method. It uses Sanity's official import/export tools, which automatically preserve:
* Document edit histories
* Unfinished drafts
* All hosted image and file assets

### Step-by-Step Instructions

1. **Open your terminal and navigate to the CMS workspace directory:**
   ```bash
   cd website-cms
   ```

2. **Authenticate with Sanity (if not already logged in):**
   ```bash
   pnpm exec sanity login
   ```

3. **Export the `production` dataset to a local backup file:**
   This command creates a compressed tarball containing all production content and references.
   ```bash
   pnpm exec sanity dataset export production production-backup.tar.gz
   ```

4. **Import the backup file into the `preview` dataset:**
   The `--replace` flag will safely overwrite matching documents in the staging database.
   ```bash
   pnpm exec sanity dataset import production-backup.tar.gz preview --replace
   ```

5. **(Optional) Clean up the local backup file:**
   ```bash
   rm production-backup.tar.gz
   ```

---

## Method 2: Programmatic Database Sync Script (Asset-Only / Patches)

If you need to sync only specific types of documents or want to run it programmatically via a script without exporting large tarballs, you can run a custom node script. 

To sync from **production → preview** (which is the reverse of the default script), you can run a script using the Sanity client.

### Script Setup

We have added a utility script at `scripts/sync-production-to-preview.ts` which copies all published documents from `production` to `preview`.

To run it:
1. Ensure your `.env.local` has a valid `SANITY_API_WRITE_TOKEN` with write privileges.
2. Run a dry run to verify the counts:
   ```bash
   pnpm tsx scripts/sync-production-to-preview.ts
   ```
3. Apply the changes:
   ```bash
   pnpm tsx scripts/sync-production-to-preview.ts --apply
   ```

---

## Safety Guidelines

> [!CAUTION]
> * **Double Check Datasets**: Always verify that your target dataset is `preview` and your source is `production`. Overwriting `production` by mistake will replace your live marketing content.
> * **Keep Backups**: Before importing any dataset, it is good practice to run a `dataset export` on the target dataset first so you have a quick restore point if anything goes wrong.
