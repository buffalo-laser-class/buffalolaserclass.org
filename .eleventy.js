const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Copy everything in src/assets straight through to the built site
  // (CSS, images, JS) without Eleventy processing it.
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copy the CNAME file (used by GitHub Pages for the custom domain)
  // through to the output, if present.
  eleventyConfig.addPassthroughCopy("CNAME");

  // ---------------------------------------------------------------
  // DATE FILTER
  // Formats a date in the America/New_York timezone using Luxon.
  // Usage in templates:  {{ someDate | date }}  or  {{ someDate | date("DATE_FULL") }}
  // ---------------------------------------------------------------
  eleventyConfig.addFilter("date", (value, format = "DATE_MED") => {
    // Allow the literal string "now" to mean the current date/time.
    let dt;
    if (value === "now" || value === undefined || value === null) {
      dt = DateTime.now();
    } else if (value instanceof Date) {
      dt = DateTime.fromJSDate(value);
    } else {
      // Try ISO first (e.g. "2026-05-17"), then fall back to a JS Date parse.
      dt = DateTime.fromISO(String(value));
      if (!dt.isValid) {
        dt = DateTime.fromJSDate(new Date(String(value)));
      }
    }

    dt = dt.setZone("America/New_York");

    if (!dt.isValid) {
      // If we still can't parse it, just hand back the original value
      // rather than printing "Invalid DateTime" on the page.
      return value;
    }

    // Support named Luxon presets (DATE_FULL, DATE_MED, etc.) or a custom format string.
    if (DateTime[format]) {
      return dt.toLocaleString(DateTime[format]);
    }
    return dt.toFormat(format);
  });

  // Convenience filter: current year, handy for the footer copyright.
  eleventyConfig.addFilter("year", () => {
    return DateTime.now().setZone("America/New_York").year;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Use Nunjucks for HTML templates and Markdown files.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
