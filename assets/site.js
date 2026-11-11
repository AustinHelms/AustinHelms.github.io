/* Chute Stack: reads assets/config.js for the Templates and Videos pages. */
(function () {
  "use strict";
  var c = window.CHUTE || {};

  // Prices
  document.querySelectorAll("[data-price]").forEach(function (el) {
    var p = (c.products || {})[el.getAttribute("data-price")];
    if (p && p.price) el.textContent = p.price;
  });

  // Stripe buttons: live link when set, clear disabled state when not
  document.querySelectorAll("[data-stripe]").forEach(function (el) {
    var p = (c.products || {})[el.getAttribute("data-stripe")];
    if (p && p.stripe) {
      el.href = p.stripe;
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-disabled");
      el.textContent = "Available soon";
    }
  });

  // Videos
  var slot = document.querySelector("[data-videos]");
  if (slot && c.youtubePlaylistId) {
    var wrap = document.createElement("div");
    wrap.className = "video-frame";
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/videoseries?list=" + encodeURIComponent(c.youtubePlaylistId);
    f.title = "Chute Stack videos";
    f.loading = "lazy";
    f.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    wrap.appendChild(f);
    slot.replaceChildren(wrap);
  }
  document.querySelectorAll("[data-subscribe]").forEach(function (a) {
    if (c.youtubeChannelUrl) {
      a.href = c.youtubeChannelUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.hidden = false;
    }
  });
})();
