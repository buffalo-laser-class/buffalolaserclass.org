# buffalolaserclass.org

Official website for the **Buffalo Laser Class Association (BLCA)** — a sailing
club racing ILCA/Laser dinghies in Buffalo, N.Y.

Built with [Eleventy (11ty) v3](https://www.11ty.dev/), hosted free on GitHub
Pages, and deployed automatically on every push to `main`.

> **Not technical? You probably want [`BOARD_GUIDE.md`](BOARD_GUIDE.md) instead.**
> It explains how to update the site in plain English, no coding required.

## Pages (Phase 1)

- **Home** (`src/index.njk`)
- **About** (`src/about.njk`)
- **Results** (`src/results.njk`) — live race results pulled from a published
  Google Sheet (CSV), rendered client-side as a sortable, filterable table.

## Tech stack

- Eleventy v3 (static site generator)
- Nunjucks (`.njk`) templates
- Luxon (date formatting, `America/New_York`)
- Plain CSS (`src/assets/css/site.css`) — no Tailwind, no build pipeline beyond Eleventy
- Vanilla JS for the results table (`src/assets/js/results-table.js`) — no PapaParse
- GitHub Actions → GitHub Pages for hosting

## Project structure

```
.eleventy.js                 Eleventy config (filters, passthrough, dirs)
package.json                 Scripts + dependencies
CNAME                        Custom domain for GitHub Pages
.github/workflows/deploy.yml Auto-build + deploy to Pages
src/
  _includes/layout.njk       Base layout: header, nav, footer
  _data/site.json            Site name, tagline, results CSV URL, contact email
  _data/board.json           Board roster (Name + Role)
  assets/css/site.css        Styles
  assets/img/                Hero image, favicon (placeholders for now)
  assets/js/results-table.js Google Sheet CSV → sortable/filterable table
  assets/js/nav.js           Mobile nav toggle + footer email
  index.njk                  Home
  about.njk                  About
  results.njk                Results
```

## Running it locally (optional — only if you want to preview before pushing)

Requires [Node.js](https://nodejs.org/) (LTS).

```bash
npm install      # first time only — downloads dependencies
npm start        # builds + serves at http://localhost:8080 with live reload
```

To build without serving:

```bash
npm run build    # outputs to _site/
```

## Deploying

Just `git push` to `main`. GitHub Actions builds the site and publishes it to
GitHub Pages automatically. No manual deploy step.

## License

MIT — see `LICENSE`.
