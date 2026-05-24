# BLCA Results — Scorekeeper Guide

**Who this is for:** whoever maintains the race-results spreadsheet for the
Buffalo Laser Class Association. If that's being handed to you for the first
time, read this once start to finish — it explains the *one small addition* the
website needs from the scoring spreadsheet, and the simple seasonal rhythm that
keeps the public website's Results page accurate.

**The short version:** Your existing scoring system does not change. We add **one
extra tab** to the spreadsheet — a clean, flat "Website" tab — whose only job is
to present results in a simple shape a website can read. You keep scoring races
exactly as you do today.

---

## Background: how this fits together

- The public website (**buffalolaserclass.org**) has a **Results** page.
- That page reads race results **directly from this spreadsheet**, live, by way
  of a special read-only link (a "published CSV" link).
- The website is **read-only** — it only ever *displays* what's in the sheet. It
  can never change your data. The spreadsheet is always the single source of
  truth.
- The website cannot read your normal scoring tabs directly — they're laid out
  for humans (legends, hidden rows, side-by-side tables, race grids), which
  confuses automated reading. So we give it **one clean tab** built for the
  machine.

---

## The one-time setup (per season spreadsheet)

> **Decision already made by the board:** each *season-year* gets its **own
> spreadsheet** (duplicate last year's file, update the dates). This keeps each
> file fast and uncluttered. See "Starting a new season / new year" below.

### Step 1 — Add a tab named exactly: `Website`

At the bottom of the spreadsheet, add a new tab. Name it **`Website`** (capital
W, no spaces). This is the only tab the website will read.

### Step 2 — Lay out the `Website` tab as a flat table

Put these column headers in **row 1**, starting in cell A1, one per column:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Date | Place | Sailor | Sail # | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 | R9 | R10 | R11 | R12 |

Then optionally add a `Points` column at the end (after R12) if you want the
website to show each night's points.

Rules that keep the website happy:
- **Row 1 is headers only.** Data starts in row 2.
- **One row per sailor, per race night.** (So if 6 sailors raced on 5/11, that's
  6 rows, each with `Date = 5/11`.)
- **No blank rows in the middle, no merged cells, no legend rows, no hidden
  rows** on this tab. Keep it boring and flat. (Your *other* tabs can stay as
  fancy as you like — this rule is only for the `Website` tab.)
- **Keep the header names spelled exactly** as above. The website looks for a
  column literally named `Date` to build its date filter. If you rename it, the
  filter stops working until the website manager is told the new name.

### Step 3 — Fill the `Website` tab (two ways — pick one)

**Option A — Formulas (hands-off, recommended if your race tabs are uniform):**
Because every race tab in the file is pre-built with the same layout, the
`Website` tab can pull from them with formulas, so it updates itself as you score.
A simple pattern, repeated per race tab, is to reference that tab's sorted
"Results" block. (If you'd like, the website manager can sit with you once to
help wire the first one; after that you copy the pattern for each race date.)

> Honest caveat: formula-pulls break **silently** if a race tab is renamed or its
> columns shift. If you go this route, after each race night glance at the
> `Website` tab to confirm the new night's rows appeared.

**Option B — Weekly paste (rock-solid, ~30 seconds a week):**
After you finish scoring a race night, select that night's sorted results,
**Copy**, then on the `Website` tab use **Edit → Paste special → Paste values
only** to append the rows. Add the date in column A. This never breaks, because
it doesn't depend on any tab staying in a fixed shape.

Either option is fine. If you value "never breaks" over "never touch it," choose
Option B.

### Step 4 — Publish the `Website` tab to the web (one time per season file)

1. **File → Share → Publish to web.**
2. Left dropdown: choose the **`Website`** tab (NOT "Entire Document").
3. Right dropdown: choose **Comma-separated values (.csv)**.
4. Click **Publish**, confirm, and **copy the link** it gives you (it ends in
   `output=csv`).
5. **Send that link to the website manager.** They paste it into the website's
   settings (a one-line change on their end). You're done.

---

## The weekly rhythm (during a season)

- Score the race night as you always have.
- Make sure that night's results reached the `Website` tab — automatically
  (Option A) or by your quick paste (Option B).
- That's it. The website refreshes itself within a minute or two. You never log
  into the website or touch any code.

---

## Starting a new season / new year

The board chose "one spreadsheet per season-year." So when a new season starts:

1. **Duplicate** the most recent season's spreadsheet (File → Make a copy), and
   rename it for the new season (e.g. "BLCA Results — 2027").
2. Update the **dates** on the race tabs for the new schedule.
3. The `Website` tab structure carries over automatically in the copy — just
   make sure it's empty of last season's data (or that your formulas now point at
   the new dates).
4. **Re-publish** the `Website` tab to web as CSV in the new file (Step 4 above).
   **This produces a NEW link** — the old one points at last year's file.
5. **Send the new link to the website manager.** They swap it in (a one-line
   change). The website now shows the new season; past seasons can still be kept
   available too (the website manager keeps a list of seasons).

> **Why a new link each year?** A duplicated spreadsheet is technically a brand
> new file, so its publish link is new. This is expected. It's a once-a-year,
> 30-second hand-off, not a rebuild.

### If a future season has a DIFFERENT number of races/weeks

Duplicating last year's file assumes the **same number of race nights**. If a
season has more or fewer races than last year, two things are worth knowing:

- **The website does NOT care.** It reads the flat `Website` tab row by row,
  however many rows there are — more weeks simply means more rows and more dates
  in the page's filter. Nothing on the website needs changing. This is the whole
  point of the flat tab: it is immune to how many race tabs or aggregate formulas
  the file has.
- **Your scoring tabs and aggregate formulas MIGHT care.** The race-scoring and
  series-aggregation formulas in the rest of the file may be built around a fixed
  number of races. Adding or removing race nights can leave a formula pointing at
  a missing tab, or failing to include a new one. This is a property of the
  scoring system itself (it would be true with or without a website) — so adjust
  those formulas the same way you would in any season where the schedule changes.

- **Bulletproof fallback:** if a season's structure changes enough that the
  formula-based `Website` tab becomes a hassle, switch that season to **Option B
  (the weekly paste)**. The paste method doesn't depend on the number of races at
  all — you just append each night's rows as they happen. Many scorekeepers use
  the paste method precisely because it sidesteps this issue entirely.

---

## Handing this role to someone else

If you're passing scorekeeping to a new person, hand them:
- Edit access to the current season's spreadsheet.
- This guide.
- A one-line note on whether you used **Option A (formulas)** or **Option B
  (weekly paste)** so they continue the same way.

That's everything. The website side is documented separately in the **Website
Manager Guide**, which the website manager keeps.

Questions about the website side (the published link, the Results page) go to the
website manager. Questions about scoring stay with you. The only thing that
crosses between you is **that one published-CSV link.**
