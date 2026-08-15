/* TiltProof — ad campaign attribution.
 *
 * Ads land here as  https://gettiltproof.app/?c=meta-r3-quiz
 * We forward that identity to Apple on every App Store link, so
 * App Store Connect → Analytics → Sources → Campaigns reports
 * first-time downloads per campaign natively — no SDK, no MMP.
 *
 * Invisible to visitors. Does nothing at all without a ?c= param.
 */
(function () {
  "use strict";

  // App Store Connect → Users & Access → (your name) → Provider Token.
  // Apple needs BOTH pt and ct to attribute; with this empty we still tag ct
  // so the links are ready the moment the token is filled in.
  var PROVIDER_TOKEN = "";

  var c = (new URLSearchParams(location.search).get("c") || "").trim();
  // whitelist: campaign names are our own slugs, never user input
  if (!/^[a-z0-9][a-z0-9._-]{0,59}$/i.test(c)) return;

  // 1. every App Store link carries the campaign through to Apple
  document.querySelectorAll('a[href*="apps.apple.com/app/"]').forEach(function (a) {
    var u = new URL(a.href);
    if (PROVIDER_TOKEN) u.searchParams.set("pt", PROVIDER_TOKEN);
    u.searchParams.set("ct", c);
    u.searchParams.set("mt", "8");
    a.href = u.toString();
  });

  // 2. keep ?c= alive if they wander to Features/Challenge before downloading
  document.querySelectorAll('a[href$=".html"], a[href="/"]').forEach(function (a) {
    var u = new URL(a.getAttribute("href"), location.href);
    if (u.origin !== location.origin) return;
    u.searchParams.set("c", c);
    a.href = u.toString();
  });
})();
