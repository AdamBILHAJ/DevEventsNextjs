<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new) — Client-side PostHog initialization using the Next.js 15.3+ `instrumentation-client` pattern. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and the `2026-01-30` defaults snapshot.
- **`next.config.ts`** — Added `rewrites` for the PostHog reverse proxy (`/ingest/static/*`, `/ingest/array/*`, `/ingest/*`) and `skipTrailingSlashRedirect: true`.
- **`src/components/ExploreBtn.tsx`** — Added `posthog.capture('explore_events_clicked')` inside the existing `onClick` handler.
- **`src/components/EventCard.tsx`** — Added `'use client'` directive and `posthog.capture('event_card_clicked', {...})` on the Link's `onClick`, with `event_title`, `event_slug`, `event_location`, and `event_date` properties.
- **`.env.local`** — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Events

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' CTA — marks entry into the discovery funnel | `src/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks through to a specific event card — signals conversion intent, with `event_title`, `event_slug`, `event_location`, `event_date` properties | `src/components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/408935/dashboard/1541404
- **Explore Events clicks over time**: https://us.posthog.com/project/408935/insights/IbC7Ejly
- **Event card clicks over time**: https://us.posthog.com/project/408935/insights/GO5kSbS7
- **Discovery to click-through funnel**: https://us.posthog.com/project/408935/insights/hG3IZI3v
- **Most clicked events** (breakdown by event title): https://us.posthog.com/project/408935/insights/IbkaLsFk
- **Total unique users engaging with events**: https://us.posthog.com/project/408935/insights/NmQptglr

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
