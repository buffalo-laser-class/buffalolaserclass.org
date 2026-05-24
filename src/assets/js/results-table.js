/*
 * results-table.js
 * -----------------
 * Renders BLCA race results as a sortable, filterable table, read live from a
 * published Google Sheet CSV. Supports MULTIPLE SEASONS via a dropdown.
 *
 * Configuration comes entirely from the page's #results-table element:
 *   data-seasons        a JSON array: [{ "label": "...", "url": "...csv" }, ...]
 *                       (newest first; the first one is shown by default)
 *   data-filter-column  the column the in-table filter dropdown uses (e.g. "Date")
 *   data-default-sort   column to sort by on load (e.g. "Date")
 *   data-default-dir    "asc" or "desc" (we default newest-first => "desc")
 *
 * A board member never edits this file — they edit the seasons list in
 * src/_data/site.json. See WEBSITE_MANAGER_GUIDE.md.
 *
 * No external libraries — we parse CSV (quoted fields, escaped quotes, CRLF)
 * ourselves.
 */
(function () {
  "use strict";

  var mount = document.getElementById("results-table");
  if (!mount) return;

  // ---- Read configuration -------------------------------------------------
  var seasons = [];
  try {
    seasons = JSON.parse(mount.getAttribute("data-seasons") || "[]");
  } catch (e) {
    seasons = [];
  }
  var filterColumn = (mount.getAttribute("data-filter-column") || "").trim();
  var defaultSort = (mount.getAttribute("data-default-sort") || "").trim();
  var defaultDir =
    (mount.getAttribute("data-default-dir") || "desc").trim() === "asc" ? 1 : -1;

  // No seasons configured yet → friendly "coming soon", not an error.
  if (!seasons.length) {
    mount.innerHTML =
      '<p class="results__empty">Race results will appear here once the season ' +
      "is underway. Check back soon!</p>";
    return;
  }

  // ---- CSV parser ---------------------------------------------------------
  function parseCSV(text) {
    var rows = [], row = [], field = "", inQuotes = false, i = 0, c;
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    while (i < text.length) {
      c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(function (r) {
      return r.some(function (cell) { return String(cell).trim() !== ""; });
    });
  }

  // ---- State --------------------------------------------------------------
  var headers = [];
  var allRows = [];
  var sortState = { index: -1, dir: defaultDir };
  var activeFilter = "__all__";
  var activeSeason = 0; // index into seasons

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function getFilterValues() {
    if (!filterColumn || headers.indexOf(filterColumn) === -1) return [];
    var seen = {}, values = [];
    allRows.forEach(function (r) {
      var v = (r[filterColumn] || "").trim();
      if (v && !seen[v]) { seen[v] = true; values.push(v); }
    });
    return values;
  }

  // Parse common US date shapes (M/D, M/D/YY, M/D/YYYY) into a sortable number.
  // Returns NaN if it doesn't look like such a date.
  function parseUsDate(s) {
    var m = String(s).trim().match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
    if (!m) return NaN;
    var month = parseInt(m[1], 10);
    var day = parseInt(m[2], 10);
    var year = m[3] ? parseInt(m[3], 10) : 0; // no year => 0, so within a season M/D still orders right
    if (year && year < 100) year += 2000;
    return year * 10000 + month * 100 + day;
  }

  function compareCells(a, b) {
    // Dates first (so "5/18" beats "5/11" correctly, even without a year).
    var dA = parseUsDate(a), dB = parseUsDate(b);
    if (!isNaN(dA) && !isNaN(dB)) return dA - dB;

    var na = parseFloat(a), nb = parseFloat(b);
    var aNum = a !== "" && !isNaN(na), bNum = b !== "" && !isNaN(nb);
    if (aNum && bNum) return na - nb;

    var da = Date.parse(a), db = Date.parse(b);
    if (!isNaN(da) && !isNaN(db)) return da - db;

    return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
  }

  // ---- Render -------------------------------------------------------------
  function render() {
    var rows = allRows.slice();

    if (activeFilter !== "__all__" && filterColumn) {
      rows = rows.filter(function (r) {
        return (r[filterColumn] || "").trim() === activeFilter;
      });
    }
    if (sortState.index >= 0) {
      var key = headers[sortState.index];
      rows.sort(function (ra, rb) {
        return compareCells(ra[key] || "", rb[key] || "") * sortState.dir;
      });
    }

    var html = '<div class="results__controls">';

    // Season picker (only if more than one season)
    if (seasons.length > 1) {
      html += '<span class="results__control">';
      html += '<label class="results__filter-label" for="results-season">Season:</label> ';
      html += '<select id="results-season" class="results__filter">';
      seasons.forEach(function (s, idx) {
        html += '<option value="' + idx + '"' + (idx === activeSeason ? " selected" : "") +
          ">" + escapeHtml(s.label || ("Season " + (idx + 1))) + "</option>";
      });
      html += "</select></span>";
    }

    // In-table filter (e.g. by Date)
    var filterValues = getFilterValues();
    if (filterValues.length > 0) {
      html += '<span class="results__control">';
      html += '<label class="results__filter-label" for="results-filter">' +
        escapeHtml(filterColumn) + ":</label> ";
      html += '<select id="results-filter" class="results__filter">';
      html += '<option value="__all__">All</option>';
      filterValues.forEach(function (v) {
        html += '<option value="' + escapeHtml(v) + '"' +
          (v === activeFilter ? " selected" : "") + ">" + escapeHtml(v) + "</option>";
      });
      html += "</select></span>";
    }
    html += "</div>";

    html += '<div class="results__scroll"><table class="results__table"><thead><tr>';
    headers.forEach(function (h, idx) {
      var arrow = sortState.index === idx ? (sortState.dir === 1 ? " \u25B2" : " \u25BC") : "";
      html += '<th scope="col"><button type="button" class="results__sort" data-index="' +
        idx + '">' + escapeHtml(h) + arrow + "</button></th>";
    });
    html += "</tr></thead><tbody>";
    if (rows.length === 0) {
      html += '<tr><td class="results__empty" colspan="' + headers.length +
        '">No results to show for this selection.</td></tr>';
    } else {
      rows.forEach(function (r) {
        html += "<tr>";
        headers.forEach(function (h) { html += "<td>" + escapeHtml(r[h] || "") + "</td>"; });
        html += "</tr>";
      });
    }
    html += "</tbody></table></div>";
    mount.innerHTML = html;

    var seasonEl = document.getElementById("results-season");
    if (seasonEl) {
      seasonEl.addEventListener("change", function () {
        activeSeason = parseInt(this.value, 10);
        activeFilter = "__all__";
        sortState = { index: -1, dir: defaultDir };
        loadSeason(activeSeason);
      });
    }
    var filterEl = document.getElementById("results-filter");
    if (filterEl) {
      filterEl.addEventListener("change", function () {
        activeFilter = this.value; render();
      });
    }
    Array.prototype.forEach.call(mount.querySelectorAll(".results__sort"), function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-index"), 10);
        if (sortState.index === idx) { sortState.dir *= -1; }
        else { sortState.index = idx; sortState.dir = 1; }
        render();
      });
    });
  }

  function applyDefaultSort() {
    if (defaultSort && headers.indexOf(defaultSort) !== -1) {
      sortState.index = headers.indexOf(defaultSort);
      sortState.dir = defaultDir;
    }
  }

  // ---- Fetch one season ---------------------------------------------------
  function loadSeason(idx) {
    var season = seasons[idx];
    if (!season || !season.url) {
      mount.innerHTML = '<p class="results__error">This season has no results link configured.</p>';
      return;
    }
    mount.innerHTML = '<p class="results__loading">Loading results&hellip;</p>';
    fetch(season.url, { cache: "no-store" })
      .then(function (resp) {
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        return resp.text();
      })
      .then(function (text) {
        var matrix = parseCSV(text);
        if (matrix.length === 0) {
          mount.innerHTML = '<p class="results__empty">No results posted yet for this season. Check back soon!</p>';
          return;
        }
        headers = matrix[0].map(function (h) { return h.trim(); });
        allRows = matrix.slice(1).map(function (cells) {
          var obj = {};
          headers.forEach(function (h, i2) {
            obj[h] = (cells[i2] !== undefined ? cells[i2] : "").trim();
          });
          return obj;
        });
        applyDefaultSort();
        render();
      })
      .catch(function (err) {
        mount.innerHTML =
          '<p class="results__error">Sorry &mdash; we couldn&rsquo;t load the results ' +
          "right now. Please try again in a little while.</p>";
        if (window.console && console.error) console.error("Results load failed:", err);
      });
  }

  // Initial load: newest season (index 0).
  loadSeason(activeSeason);
})();
