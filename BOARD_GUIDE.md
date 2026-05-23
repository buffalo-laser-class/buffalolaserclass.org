# BLCA Website — Board Guide

Welcome! This guide explains how to update the club website **without needing to
know how to code.** If you can edit a text file and click a few buttons on
GitHub, you can keep this site current.

You do **not** need to install anything on your computer. Everything below can be
done in a web browser on GitHub.com.

---

## First, the big picture

- The website's files live in a **repository** ("repo") on GitHub, in the club's
  organization: **github.com/buffalo-laser-class/buffalolaserclass.org**
- When you change a file on GitHub and save it (GitHub calls saving a
  **"commit"**), the site **rebuilds and republishes itself automatically** in
  about 1–2 minutes. You don't have to "upload" anything.
- The live site is at **https://buffalolaserclass.org**

> **Tip:** After any change, wait ~2 minutes, then refresh the live site. If you
> don't see your change, do a "hard refresh" (Ctrl+F5 on Windows, Cmd+Shift+R on
> Mac) to bypass your browser's cache.

---

## How to edit any file on GitHub (the basic move)

You'll use this same handful of clicks for almost everything below:

1. Go to **github.com/buffalo-laser-class/buffalolaserclass.org**
2. Click into the folder and file you want (paths are given below).
3. Click the **pencil icon** (✏️ "Edit this file") in the top-right of the file.
4. Make your change in the text box.
5. Scroll down, leave the default "Commit directly to the `main` branch"
   selected, and click the green **"Commit changes"** button.
6. Wait ~2 minutes, refresh the live site.

That's it. If you ever make a mistake, GitHub keeps a full history — nothing is
ever truly lost, and a more technical helper can roll back any change.

---

## 1. Edit the Home page text

**File:** `src/index.njk`

- The headline and tagline come from a different file (see below), but the
  **"Who we are"** paragraphs are right here.
- Find the text under `<h2>Who we are</h2>` and edit the words between the
  `<p>` and `</p>` tags. Leave the tags themselves alone.

To change the **club name** or **tagline** shown in the big hero banner, edit
`src/_data/site.json` instead (see section 4).

---

## 2. Update the About page

**File:** `src/about.njk`

The About page is divided into clearly-labeled sections (Our history, What is
ILCA/Laser racing, Goals & mission, What we do, The board, How to join, Where we
sail). Each section is marked with a comment like `<!-- HISTORY -->`.

- Edit the words between `<p>` and `</p>` tags.
- Yellow **"TODO"** notes mark spots that still need real info (e.g. the launch
  address). When you fill one in, delete the whole `<p class="todo-note">…</p>`
  line so the yellow box disappears.

---

## 3. Add / change / remove a board member

**File:** `src/_data/board.json`

This is the easiest edit. You'll see a list of board members like this:

```json
{
  "name": "Jane Skipper",
  "role": "Commodore / President"
},
```

- **To change someone:** edit the text inside the quotation marks.
- **To add someone:** copy one full block from the `{` to the `},` (including the
  comma), paste it right after another member, and edit the name and role.
- **To remove someone:** delete their full block from `{` to `},`.

**Important formatting rules** (JSON is picky):
- Keep every name and role inside `"double quotes"`.
- Put a comma after each `}` **except the last one** in the list.
- Keep the square brackets `[ ]` that surround the whole list.

If you get it slightly wrong, the site will tell you the build failed (you'll get
an email from GitHub). Just go back and fix the quotes/commas — usually a missing
or extra comma.

---

## 4. Change site-wide settings (name, tagline, contact email, results sheet)

**File:** `src/_data/site.json`

This one file holds the settings used across the whole site:

- `"name"` — full club name (used in titles and footer).
- `"shortName"` — the short "BLCA" label.
- `"tagline"` — the one-line mission under the club name on the Home page.
- `"contactEmail"` — the club's public contact email, shown in the footer and on
  the About page. **Replace `TODO-club-email@example.com` with the real club
  email.**
- `"resultsCsvUrl"` — the link to the published results spreadsheet (see next
  section).

Edit the text inside the quotation marks, keep the quotes and commas, commit.

---

## 5. Update the race results (the Google Sheet)

The Results page reads directly from a **Google Sheet** you control. You never
touch the website to update results — **you just edit the spreadsheet**, and the
website shows the new data automatically.

### To update results week to week:
1. Open the club's results Google Sheet.
2. Add or edit rows. Keep the **column headings in row 1** the same.
3. Save (Google Sheets saves automatically). Done — the website reflects changes
   within a minute or two.

### To point the site at a *different* sheet (rarely needed):
1. In Google Sheets: **File → Share → Publish to web**.
2. Choose the correct tab, and select **Comma-separated values (.csv)** as the
   format.
3. Click **Publish**, copy the link it gives you.
4. On GitHub, edit `src/_data/site.json`, paste that link as the value of
   `"resultsCsvUrl"` (inside the quotes), and commit.

> The spreadsheet is the single source of truth for results. The website is a
> read-only display of it — you can't (and don't need to) edit results on the
> site itself.

---

## 6. Swap in the real club logo / hero photo

**Hero photo (the big Home page background):**
1. On GitHub, go to `src/assets/img/`.
2. Click **"Add file" → "Upload files."**
3. Upload your photo, but **rename it to exactly `hero.jpg`** first (or upload and
   then it will replace the placeholder if named identically). Landscape, at least
   1600px wide, looks best.
4. Commit. The Home page will use your photo automatically.

**Text logo → image logo (more involved):** The header currently shows "BLCA" as
styled text. Swapping in an image logo is a small code change in
`src/_includes/layout.njk` — best done with a more technical helper, or ask in a
future Phase 2 conversation.

---

## 7. Add a new collaborator to the GitHub organization

When a new board member needs edit access:

1. Go to **github.com/buffalo-laser-class** (the organization page).
2. Click the **"People"** tab.
3. Click **"Invite member."**
4. Enter the new person's GitHub username or email and send the invite.
5. They accept by email/GitHub. For most board members, the default **"Member"**
   role is fine.

> **Note on permissions / ownership:** Changing who *owns* the organization, or
> transferring it when the board turns over, is a sensitive action. For security
> reasons it should be done deliberately by a current owner following GitHub's
> official steps — don't rush it, and loop in someone comfortable with GitHub if
> you're unsure.

---

## If something breaks

- **The site didn't update:** wait 2 minutes, hard-refresh (Ctrl+F5). Check the
  **"Actions"** tab on the repo — a green check means it deployed; a red X means
  the build failed.
- **Build failed (red X / email from GitHub):** you almost certainly have a typo
  in a `.json` file — a missing comma or quotation mark. Re-open the file you last
  edited and fix it. The history has your previous working version.
- **Totally stuck:** the full edit history on GitHub means any change can be
  undone. Ask a more technical friend to "revert the last commit" — it's a
  one-click fix for them.

Sail fast! ⛵
