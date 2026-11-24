# Omoyemi Arigbanla’s engineering workbench

A statically generated portfolio for GitHub Pages. No runtime dependencies, SPA routing,
or server API is needed. The committed HTML can be served directly from the repository root.

## Run and verify

```sh
npm run build
npm run check
npm run dev
```

Open http://localhost:8000. Node.js 22+ is recommended for the build/check scripts.

## Focused application links

- `/` — full portfolio, including full-stack applications
- `/frontend/` — frontend work and an interactive interface-state lab
- `/backend/` — backend work and a versioned payment-event lab
- `/bitcoin/` — Bitcoin, Lightning, and open-source contributions

The Bitcoin route is an optional application link for Bitcoin/Lightning roles. Backend
applications emphasize Go services, APIs, architecture, and professional experience; Bitcoin
open-source contributions and articles are confined to the Bitcoin view and main portfolio.

Each view has its own introduction, selected projects, scoped case studies, navigation,
contact subject, metadata, and printable résumé at `<view>/resume/`. Project pages stay
within that perspective; “Full portfolio” is the explicit route back to all the work.
The existing downloadable PDF remains labeled as the **full** résumé.

GitHub Pages resolves `/frontend` to `/frontend/`. Each route has a real `index.html`, so
refreshing or directly opening a nested case study does not depend on a client router or
404 fallback. `404.html` handles genuinely missing pages.

## Edit content

Edit `content/portfolio.mjs`, then run `npm run build`. The generator is
`scripts/build.mjs`; do not edit generated HTML directly. Shared content keeps project
facts consistent across all perspectives. Add a role to `roles`, choose its project IDs,
and build to add a future specialty. New project data also needs a visual template in
`visual()` in the generator.

`styles.css`, `script.js`, `payment-lab.js`, and the analytics files are shared. The generator
fingerprints shared assets, emits route-specific canonical/Open Graph metadata, and updates
the sitemap. Existing `#projects` and `#approach` section links remain supported.

## Analytics

The owner’s Umami website is configured. Tracking starts on the production domain after
deployment; local and preview visits are excluded. No publicly accessible statistics are
included. See [ANALYTICS.md](ANALYTICS.md)
for account setup, daily/weekly/monthly reporting, country/device breakdowns, events,
application attribution, and owner-visit exclusion.

## Content provenance

See [content/SOURCES.md](content/SOURCES.md). New public projects were selected by reading
repository documentation and implementation files. Earlier and assessment work is labeled.
Overview illustrations are labeled concepts. Clooza and Ipilẹ case studies also include
public product previews with source links; their provenance is recorded in SOURCES.md. No adoption metrics, testimonials,
original-design authorship, or production-readiness claims have been invented.

## Contact

The existing Formspree endpoint is preserved. The form validates required fields, reports
success or failure, and only records a successful-contact event after a successful HTTP
response. Real messages were not submitted during testing. The static HTML form also
works without JavaScript through Formspree’s normal response page.

## Deployment

Keep the existing GitHub Pages setup, custom domain (`CNAME`), and `.nojekyll`. Run the build
and checks, then commit the generated pages along with their source before publishing through
the repository’s normal workflow. This redesign does not require migration to another host.

## Interactive finishing layer

The hero’s system layers are buttons with contextual explanations, and the star changes
its color palette. On fine-pointer devices, the board responds to pointer position with
a small perspective tilt. The identity graphic can be remixed into an abstract mirrored
mark and restored. Section reveals, a short heading entrance, and a reading-progress bar
make exploration more tactile. Footer controls pause motion, preferences persist locally,
and system reduced-motion preferences take precedence. Essential content remains visible
when JavaScript or IntersectionObserver is unavailable.

Personal location is omitted from the public pages, focused résumé views, downloadable
résumé, structured metadata, and social preview artwork.

The home and specialty pages also include a role-specific toolkit with project evidence
links, plus a small selection of relevant completed courses. These are shared data in
`content/portfolio.mjs`, and focused résumé pages include the corresponding technical
skills. Course entries link to their credential pages and remain secondary to work.

## Employer discovery and contact

Home and specialty pages have descriptive engineering titles, canonical URLs, social
previews, and Person metadata with relevant skills and a public contact email. Static
role links and the sitemap keep focused application pages discoverable. Each view offers
a résumé, a direct email link, LinkedIn, and the contact form. The user confirmed that
contact delivery works on 23 November 2026. Both Qala courses appear on the main and
Bitcoin views under Courses & credentials.


## Daily appearance

`daily-look.js` selects a sage, blue, or peach accent and one of four workbench paper
patterns (dots, grid, diagonal lines, rings) from the visitor’s local calendar date.
The same date produces the same look across routes and reloads. Appearance initializes
before the stylesheet, refreshes at local midnight and on return to the tab, and needs
no storage, scheduled job, network service, or deployment. Light/dark and motion
preferences continue to apply. The workbench star cycles the accent for the current
page; the next page load restores the day’s palette. Only decorative backgrounds and
tape placement vary; controls and content keep their positions. Without JavaScript,
the original sage/dotted design remains available.
