/*
 * results-table.js
 * -----------------
 * Fetches a published-to-web Google Sheet (as CSV), parses it, and renders a
 * sortable, filterable HTML table.
 *
 * A board member never needs to edit this file. The CSV URL is read from the
 * page's #results-table element (data-csv-url), which in turn comes from
 * src/_data/site.json. To point at a different sheet, change the URL there.
 *
 * No external libraries — we parse CSV (including quoted fields with commas
 * and escaped quotes) ourselves.
 */
(function () {
  "use strict";

  var mount = document.getElementById("results-table");
  if (!mount) return;

  var csvUrl = (mount.getAttribute("data-csv-url") || "").trim();
  var filterColumn = (mount.getAttribute("data-filter-column") || "").trim();

  // No URL configured yet → friendly "coming soon" message, not an error.
  if (!csvUrl) {
    mount.innerHTML =
      '<p class="results__empty">Race results will appear here once the season is ' +
      "underway. Check back soon!</p>";
    return;
  }

  // ---- CSV PARSER ---------------------------------------------------------
  // Handles: quoted fields, commas inside quotes, escaped quotes (""),
  // and both \n and \r\n line endings. Returns an array of rows (arrays).
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var i = 0;
    var c;

    // Normalise Windows line endings.
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    while (i < text.length) {
      c = text[i];

      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"'; // escaped quote
            i += 2;
            continue;
          }
          inQuotes = false;
          i++;
          continue;
        }
        field += c;
        i++;
        continue;
      }

      if (c === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (c === ",") {
        row.push(field);
        field = "";
        i++;
        continue;
      }
      if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i++;
        continue;
      }
      field += c;
      i++;
    }

    // Flush the final field/row (file may not end with a newline).
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    // Drop fully-empty trailing rows.
    return rows.filter(function (r) {
      return r.some(function (cell) {
        return String(cell).trim() !== "";
      });
    });
  }

  // ---- STATE --------------------------------------------------------------
  var headers = [];
  var allRows = []; // array of objects keyed by header
  var sortState = { index: -1, dir: 1 }; // dir: 1 asc, -1 desc
  var activeFilter = "__all__";

  // ---- RENDER -------------------------------------------------------------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getFilterValues() {
    if (!filterColumn || headers.indexOf(filterColumn) === -1) return [];
    var seen = {};
    var values = [];
    allRows.forEach(function (r) {
      var v = (r[filterColumn] || "").trim();
      if (v && !seen[v]) {
        seen[v] = true;
        values.push(v);
      }
    });
    return values;
  }

  // Sort helper: numbers sort numerically, dates sort by date, else text.
  function compareCells(a, b) {
    var na = parseFloat(a),
      nb = parseFloat(b);
    var aNum = a !== "" && !isNaN(na);
    var bNum = b !== "" && !isNaN(nb);
    if (aNum && bNum) return na - nb;

    var da = Date.parse(a),
      db = Date.parse(b);
    var aDate = !isNaN(da);
    var bDate = !isNaN(db);
    if (aDate && bDate) return da - db;

    return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
  }

  function render() {
    var rows = allRows.slice();

    // Filter
    if (activeFilter !== "__all__" && filterColumn) {
      rows = rows.filter(function (r) {
        return (r[filterColumn] || "").trim() === activeFilter;
      });
    }

    // Sort
    if (sortState.index >= 0) {
      var key = headers[sortState.index];
      rows.sort(function (ra, rb) {
        return compareCells(ra[key] || "", rb[key] || "") * sortState.dir;
      });
    }

    var html = "";

    // Filter dropdown
    var filterValues = getFilterValues();
    if (filterValues.length > 0) {
      html += '<div class="results__controls">';
      html += '<label class="results__filter-label" for="results-filter">' +
        escapeHtml(filterColumn) + ":</label> ";
      html += '<select id="results-filter" class="results__filter">';
      html += '<option value="__all__">All</option>';
      filterValues.forEach(function (v) {
        var sel = v === activeFilter ? " selected" : "";
        html += '<option value="' + escapeHtml(v) + '"' + sel + ">" +
          escapeHtml(v) + "</option>";
      });
      html += "</select>";
      html += "</div>";
    }

    // Table
    html += '<div class="results__scroll"><table class="results__table"><thead><tr>';
    headers.forEach(function (h, idx) {
      var arrow = "";
      if (sortState.index === idx) {
        arrow = sortState.dir === 1 ? " \u25B2" : " \u25BC";
      }
      html += '<th scope="col"><button type="button" class="results__sort" ' +
        'data-index="' + idx + '">' + escapeHtml(h) + arrow + "</button></th>";
    });
    html += "</tr></thead><tbody>";

    if (rows.length === 0) {
      html += '<tr><td class="results__empty" colspan="' + headers.length +
        '">No results to show for this selection.</td></tr>';
    } else {
      rows.forEach(function (r) {
        html += "<tr>";
        headers.forEach(function (h) {
          html += "<td>" + escapeHtml(r[h] || "") + "</td>";
        });
        html += "</tr>";
      });
    }

    html += "</tbody></table></div>";
    mount.innerHTML = html;

    // Wire up controls
    var filterEl = document.getElementById("results-filter");
    if (filterEl) {
      filterEl.addEventListener("change", function () {
        activeFilter = this.value;
        render();
      });
    }
    var sortButtons = mount.querySelectorAll(".results__sort");
    Array.prototype.forEach.call(sortButtons, function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-index"), 10);
        if (sortState.index === idx) {
          sortState.dir *= -1;
        } else {
          sortState.index = idx;
          sortState.dir = 1;
        }
        render();
      });
    });
  }

  // ---- FETCH --------------------------------------------------------------
  fetch(csvUrl, { cache: "no-store" })
    .then(function (resp) {
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return resp.text();
    })
    .then(function (text) {
      var matrix = parseCSV(text);
      if (matrix.length === 0) {
        mount.innerHTML =
          '<p class="results__empty">The results sheet is empty right now. ' +
          "Check back soon!</p>";
        return;
      }
      headers = matrix[0].map(function (h) {
        return h.trim();
      });
      allRows = matrix.slice(1).map(function (cells) {
        var obj = {};
        headers.forEach(function (h, idx) {
          obj[h] = (cells[idx] !== undefined ? cells[idx] : "").trim();
        });
        return obj;
      });
      render();
    })
    .catch(function (err) {
      mount.innerHTML =
        '<p class="results__error">Sorry &mdash; we couldn&rsquo;t load the ' +
        "results right now. Please try again in a little while.</p>";
      if (window.console && console.error) {
        console.error("Results load failed:", err);
      }
    });
})();
