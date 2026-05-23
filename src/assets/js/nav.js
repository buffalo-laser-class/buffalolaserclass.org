/* nav.js — mobile navigation toggle + spam-resistant footer email. */
(function () {
  "use strict";

  // --- Mobile nav toggle ---
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Footer email obfuscation ---
  // The raw email is encoded in a data- attribute (@ -> ||, . -> __) so naive
  // scrapers don't harvest it. We rebuild the real mailto link here. If JS is
  // off, the template's plain fallback link still works.
  var holder = document.querySelector(".js-email");
  if (holder) {
    var enc = holder.getAttribute("data-user") || "";
    var email = enc.replace(/\|\|/g, "@").replace(/__/g, ".");
    if (email && email.indexOf("@") !== -1) {
      holder.innerHTML = '<a href="mailto:' + email + '">' + email + "</a>";
    }
  }
})();
