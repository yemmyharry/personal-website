# Activate visitor analytics

The owner’s Umami website ID and Cloud tracking script are configured in
`analytics-config.js`. Tracking will start after this configuration is deployed.
It cannot reconstruct traffic from before activation.

## Connect Umami

1. Create an account at https://cloud.umami.is/ or use your own Umami instance.
2. Add `yemmyharry.is-a.dev` as a website. Keep its statistics private.
3. Copy the **website ID** and **tracking script URL** from the website’s tracking code.
4. Set those two public values in `analytics-config.js`. Never add an API key, password,
   account token, or shared statistics link to this repository.
5. Keep `domains` set to the production hostname. Local and preview visits are excluded.
6. Run `npm run build` and `npm run check`, then deploy through GitHub Pages.
7. In a browser that permits analytics, visit the deployed site and a specialty page,
   open a project, and open a résumé. Check Umami’s realtime dashboard for those events.

Official setup: https://docs.umami.is/ — tracker configuration:
https://docs.umami.is/docs/tracker-configuration

## Daily, weekly, monthly, countries, and devices

Use the private Umami dashboard to choose Today, a seven-day range, or a calendar month.
Use its time grouping/report controls for daily, weekly, and monthly trends. Set reporting
preferences to your preferred timezone, and distinguish calendar periods from rolling windows.
Review unique visitors, visits/sessions, and pageviews separately; they measure different things.

The dashboard provides country and device-category breakdowns, with additional browser,
operating-system, referrer, and page-path information. Filter by `/frontend/`, `/backend/`,
or `/bitcoin/` to compare the perspectives. Country comes from approximate
network location; VPNs can affect it. These reports cannot identify a specific recruiter.
Ad blockers and privacy settings can also reduce measured counts.

## Application attribution

Use non-personal campaign tags when sharing application links, for example:

```
https://yemmyharry.is-a.dev/frontend/?utm_source=linkedin&utm_medium=application&utm_campaign=frontend_2026
https://yemmyharry.is-a.dev/backend/?utm_source=job_board&utm_medium=application&utm_campaign=backend_2026
```

Only `utm_source`, `utm_medium`, and `utm_campaign` are retained. Values must consist of
letters, numbers, underscores, or hyphens, up to 80 characters. All other query parameters
and fragments are removed before analytics sends them. Referrer queries/fragments are
removed too. Do not put recruiter names, email addresses, private application IDs, or
other personal data in URLs. No new identifying campaign is automatically created.

## Events

- `specialty_open`: opening a focused view from the home page
- `project_open`: following a project title/case-study link
- `project_evidence`: following a project’s evidence link
- `resume_open`, `resume_download`, `resume_print`
- `workbench_layer`: exploring a system layer (entry, core, state, rails)
- `hero_demo`, `payment_scenario`, `payment_replay`, `payment_retry`, `interface_state`
- `contribution_open`, `article_open`, `outbound_click`
- `contact_success`: only after a successful Formspree response

Events carry the current specialty and an allowlist of project/scenario/state properties.
Form contents are never sent. Print/download events measure the initiated action; they
cannot confirm that a PDF was saved, opened, or read. A visitor can also navigate directly
to a case study, which is counted as a pageview rather than a project-click event.

## Exclude your visits

Open `/privacy/` in each browser you use and select **Disable analytics for this browser**.
The preference is local to that browser and takes effect before tracker loading on future
visits. The before-send hook suppresses subsequent events immediately in an already open
page. The integration also honors Do Not Track and Global Privacy Control signals.

No analytics script is loaded when configuration is absent, when opted out, on an
unapproved hostname, or when those browser privacy signals are active. No session replay,
heatmap recorder, distinct user IDs, or form analytics are enabled.

## Security and reporting

The owner dashboard lives in Umami behind its normal sign-in. Do not embed an admin token
in a public static portfolio, and do not create a public `/admin` page with private stats.
A private Umami dashboard already provides the requested reporting without a custom backend.
