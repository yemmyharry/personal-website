# yemmyharry.dev — personal website

A single-page, zero-build portfolio for Omoyemi "yemmyharry" Arigbanla: plain HTML/CSS/JS,
no framework, no bundler. Open `index.html` in a browser and it works.

Built from your résumé (`assets/resume.pdf`), your Medium archive
(https://yemmyharry.medium.com), and the standing context in Claude's memory about your
Bitcoin/Rust OSS goals and Ipilẹ Labs. **LinkedIn was not reachable** (it sits behind a login
wall for automated tools), so anything specific to your LinkedIn headline/summary/endorsements
is not reflected here — add it yourself in the About or Experience sections if you want it.

## What's in here

```
personal-website/
├── index.html        all content lives here (sections: hero, about, experience,
│                      skills, projects, writing, open source, playground, contact)
├── styles.css         theme tokens (dark + light), layout, animations
├── script.js           theme toggle, mobile nav, scrollspy, scroll-reveal, hero typing
│                      effect, live BTC price/block-height ticker, project filter,
│                      in-browser SHA-256 playground, copy-email, back-to-top,
│                      canvas network background
├── assets/
│   ├── resume.pdf      copy of your résumé — linked from the hero's "Download résumé" button
│   ├── favicon.svg
│   └── og-image.svg    social share preview image
├── robots.txt
├── sitemap.xml
└── .nojekyll           tells GitHub Pages to serve the site as-is (no Jekyll processing)
```

No build step, no `npm install`, no dependencies beyond two Google Fonts loaded over CDN.
That's deliberate — it keeps hosting free and deployment a single `git push`.

## Interactive features

- **Theme toggle** (dark/light), persisted in `localStorage`, defaults to system preference.
- **Scroll-reveal** animations and a **scrollspy** nav that highlights the section you're in.
- **Hero typing effect** cycling through your roles.
- **Live Bitcoin ticker** — BTC/USD from CoinGecko's free public API, current block height
  from mempool.space's free public API. Both are keyless and CORS-open; if either is
  unreachable it just shows "unavailable" instead of breaking the page.
- **Project filter** by category (Bitcoin / Backend / Full-stack / Currently building).
- **SHA-256 playground** — a live hash demo using the browser's native Web Crypto API, tying
  back to your "Hash Functions and Signatures" Medium piece. Nothing typed ever leaves the
  browser.
- **Animated canvas background** — a subtle node network, paused automatically when the tab
  is hidden or `prefers-reduced-motion` is set.
- Copy-to-clipboard email button, back-to-top button, mobile hamburger nav.

Everything respects `prefers-reduced-motion` and works with keyboard navigation.

## Personalize before publishing — TODOs

Search the files for these and fill them in:

1. **GitHub username** — I assumed `github.com/yemmyharry` to match your other handles
   (`index.html`, About and Contact sections). Confirm or swap it.
2. **Contact form endpoint** — the form in the Contact section posts to
   `https://formspree.io/f/YOUR_FORM_ID`. Formspree's free tier gives 50 submissions/month
   with no backend needed: sign up at formspree.io, create a form, and paste your real ID in
   `index.html`. Until you do, submissions will fail silently.
2b. Alternative to Formspree: drop the form and just rely on the mailto/copy-email button —
   simplest, zero third-party dependency.
3. **Medium article links** — I linked the pinned "Multisignature Wallets 101" post directly;
   the other five writing cards link to your Medium homepage because I couldn't get individual
   post URLs from the archive listing. Open each post on Medium and paste its real URL into
   the matching `<a class="writing-card">` in `index.html`.
4. **Photo** — the About card currently shows initials ("OA") instead of a real photo. Drop a
   square image into `assets/` (e.g. `assets/photo.jpg`) and swap the `.avatar-frame` markup
   in `index.html` for an `<img>`.
5. **X/Twitter or other handles** — not included since I don't have them. Add a link in the
   `.about-socials` / `.contact-socials` blocks if you want one.
6. **Ipilẹ Labs specifics** — kept intentionally high-level (public-facing summary only). Tighten
   the description once you decide what's public.
7. Update `og:url` / `sitemap.xml` / `robots.txt` if you end up hosting somewhere other than
   `yemmyharry.github.io`.

## Running it locally

No server required — just open `index.html` in a browser. If you want a local server (some
browsers restrict `fetch`/clipboard APIs on `file://`):

```bash
cd personal-website
python3 -m http.server 8000
# then open http://localhost:8000
```

## Hosting for free, with your pseudonym in the URL

**Recommended: GitHub Pages, repo named `yemmyharry.github.io`.**
When a GitHub Pages repo is named exactly `<username>.github.io`, its content is served at
that URL directly — so if your GitHub username is `yemmyharry`, your site is live at
`https://yemmyharry.github.io` for $0, with free HTTPS, no expiry, no credit card. This is the
tightest match to "unique name, preferably my pseudonym" without buying a domain.

```bash
cd personal-website
git init
git add .
git commit -m "personal website"
git branch -M main
git remote add origin https://github.com/yemmyharry/yemmyharry.github.io.git
git push -u origin main
```

Then in the repo's Settings → Pages, set the source to the `main` branch, root folder. It's
live within a minute or two at `https://yemmyharry.github.io`.

(Per your usual workflow I haven't run any of this — staging, committing, and pushing is
yours to do whenever you're ready.)

**Free alternatives** (all no-cost static hosts, if you'd rather not use a `.github.io`
"user site" repo, or want to host a *different* project under that name):

| Host | Free URL pattern | Notes |
|---|---|---|
| Cloudflare Pages | `yemmyharry.pages.dev` | Fast global CDN, generous free tier, easy custom domain later |
| Netlify | `yemmyharry.netlify.app` | Drag-and-drop deploys, free tier includes the contact-form backend too (an alternative to Formspree) |
| Vercel | `yemmyharry.vercel.app` | Git-connected deploys, free tier |
| GitHub Pages (project repo) | `yourusername.github.io/personal-website` | If you don't want a dedicated `.github.io` repo |

**Free custom domain matching your pseudonym**, layered on top of any of the above:
[is-a.dev](https://www.is-a.dev/) hands out free subdomains like `yemmyharry.is-a.dev` to
developers — you submit a JSON file via pull request to their GitHub repo, point it at your
GitHub Pages / Cloudflare Pages / Netlify / Vercel deployment via a CNAME record, and it's
free indefinitely as long as the repo stays active. This gets you a real custom domain (not
just a subdirectory of someone else's) for $0. Avoid "free domain" services like Freenom —
they've become unreliable and are frequently reclaimed or blacklisted.

If you ever want a fully-owned domain instead, `.dev` and `.xyz` TLDs are usually the
cheapest (~$10–15/yr) and pair well with free hosts above — but that's optional; the
`.github.io` route above costs nothing.

## Next steps

- Fill in the TODOs above.
- Test in both themes and at mobile width before publishing.
- Once hosted, submit the URL to Google Search Console (free) so it gets indexed.
