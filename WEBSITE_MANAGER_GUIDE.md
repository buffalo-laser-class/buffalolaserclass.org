# BLCA Results — Website Manager Guide

**Who this is for:** whoever maintains the BLCA website (the person with access
to the GitHub repo). This explains how the Results page gets its data and the one
recurring task you own: **keeping the list of seasons up to date** in a single
settings file.

You do **not** need to understand the scoring spreadsheet. The scorekeeper hands
you exactly one thing per season — a link — and you paste it in one place.

---

## How Results works, in one paragraph

The scorekeeper maintains the race-results spreadsheet and publishes a clean
"Website" tab as a read-only **CSV link**. The website's Results page reads that
link live in the visitor's browser and draws a sortable, filterable table. You
connect the two by pasting the scorekeeper's link into the website's settings
file, `src/_data/site.json`. That's the whole job.

---

## The settings file: `src/_data/site.json`

Results are configured by a list of **seasons**, newest first. Each season has a
label (what visitors see in a dropdown) and the published-CSV URL the scorekeeper
gave you. It looks like this:

```json
"resultsSeasons": [
  {
    "label": "2026 Season",
    "url": "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=...&single=true&output=csv"
  }
]
```

- The **first** season in the list is shown by default on the page.
- Visitors can switch seasons with a dropdown if there's more than one.
- An empty list (`"resultsSeasons": []`) makes the page show a friendly
  "results coming soon" message — no error.

---

## Task 1 — Connect a new season (start of each season-year)

When the scorekeeper sends you a fresh published-CSV link for a new season:

1. Go to the repo on GitHub:
   **github.com/buffalo-laser-class/buffalolaserclass.org**
2. Open **`src/_data/site.json`** and click the **pencil (✏️ Edit)** icon.
3. Find the `"resultsSeasons"` list. **Add the new season at the TOP** of the
   list (so it becomes the default), like this — note the comma after the new
   `}` when there are older seasons below it:

   ```json
   "resultsSeasons": [
     {
       "label": "2027 Season",
       "url": "PASTE-THE-NEW-LINK-HERE"
     },
     {
       "label": "2026 Season",
       "url": "...last year's link..."
     }
   ]
   ```
4. Scroll down, keep "Commit directly to the `main` branch," click **Commit
   changes**.
5. Wait ~2 minutes, then check the live Results page. The new season should be
   the default, with older seasons available in the dropdown.

### JSON formatting rules (the only way to break this)
- Every label and URL stays inside `"double quotes"`.
- Put a comma after each `}` **except the last one** in the list.
- Keep the square brackets `[ ]` around the whole list.
- If the site build fails (you'll get an email from GitHub, or see a red ✗ in the
  repo's **Actions** tab), you almost certainly have a missing or extra comma or
  quote. Re-open the file and fix it; the history holds your previous working
  version.

---

## Task 2 — Mid-season (during a running season)

**Nothing to do.** Once a season's link is connected, the scorekeeper's weekly
updates flow through automatically — the link is a live window into their sheet.
You only act at season boundaries (Task 1) or if the scorekeeper tells you a link
changed (Task 3).

---

## Task 3 — If the scorekeeper says "the link changed"

Occasionally a sheet gets re-created and re-published, producing a new link.
If the scorekeeper sends a replacement link for an existing season:

1. Edit `src/_data/site.json` (pencil icon).
2. Find that season's entry, replace the old URL inside the quotes with the new
   one, leave the label as-is.
3. Commit. Done.

---

## If the Results page shows "couldn't load results"

This message means the website tried the link but couldn't read usable data.
Usual causes, in order of likelihood:
1. **The sheet was un-published.** Ask the scorekeeper to confirm the `Website`
   tab is still **Published to web as CSV**.
2. **The link is wrong or truncated.** Confirm the URL in `site.json` ends in
   `output=csv` and matches exactly what the scorekeeper sent.
3. **The `Website` tab structure changed.** If the scorekeeper renamed the
   `Date` column, the date filter can misbehave. Coordinate: either they restore
   the `Date` header, or tell you the new name so a small code tweak can match it
   (that part may need a more technical helper).

The page is designed to **fail gracefully** — visitors see a polite message, never
a broken page or a code error.

---

## Handing this role to someone else

Hand the next website manager:
- Collaborator access to the GitHub org (see `BOARD_GUIDE.md`, "Add a new
  collaborator").
- This guide and the `BOARD_GUIDE.md`.
- The current `site.json` already documents the live seasons, so they can see the
  pattern immediately.

The boundary with the scorekeeper is clean: **they own the spreadsheet and send
you links; you own `site.json` and paste them in.** The only thing that crosses
between you is the published-CSV link, once per season.
