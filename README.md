# TiltProof website

Static, zero-dependency landing site (plain HTML/CSS/JS — no build step, no framework).

- `index.html` — landing page (hero, coaching card, TiltScore gauge, features, tour rail, pricing, FAQ)
- `support.html` — FAQ + contact = the **App Store Connect Support URL**
- `privacy.html` / `terms.html` — legal (copies of `legal/`; keep in sync)
- `assets/` — icon + downscaled app screenshots (regen from `screenshots/` via `sips --resampleWidth 660`)

## Preview locally

```
python3 -m http.server 4173 --directory website
```

## Deploy (GitHub Pages)

1. Push `website/` to a `tiltproof-site` repo (or serve this folder from a `gh-pages` branch).
2. Settings → Pages → deploy from branch, root.
3. Custom domain: `gettiltproof.app` (LIVE) (RON buys it) → add `CNAME` file + DNS A/AAAA records per GitHub docs. `.app` requires HTTPS — GitHub provides the cert.
4. Then update ASC metadata: Marketing URL `https://gettiltproof.app`, Support URL `https://gettiltproof.app/support.html`, and repoint privacy/terms URLs from github.io.

## TODO at launch

- Replace both `href="#"` App Store badges with the real store URL (+ campaign token per source).
- Uncomment the smart-app-banner `<meta name="apple-itunes-app">` in `index.html` with the real app ID.
- Optional: GoatCounter analytics snippet; social-proof quotes section after first reviews.
