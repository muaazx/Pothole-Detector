# Product Requirements Document (PRD)
## Road Pothole Reporter — Web MVP

**Version:** 1.0
**Status:** Draft
**Owner:** [Your Name]
**Last Updated:** July 20, 2026

---

## 1. Problem Statement

Potholes are a significant road safety hazard, and in several countries they are directly linked to a meaningful share of road accidents and fatalities. Government road-maintenance agencies typically rely on manual inspection or citizen complaints filed through disconnected channels (phone calls, letters, scattered social media posts), which means:

- Potholes go unreported until an accident happens
- Duplicate complaints for the same pothole waste admin time
- There's no easy way to prioritize which potholes are most dangerous or most reported
- Citizens have no visibility into whether their report was ever acted on

**Target markets — Western countries only (revised scope):**

| Country | Why it's a priority target |
|---|---|
| **USA** | Pothole-related fatal traffic accidents continue to rise alongside a very large overall vehicle fleet and road network, meaning high absolute exposure. |
| **UK** | Road safety groups warn the risk to life from potholes is severe, with nearly 30,000 people killed or seriously injured on UK roads in the past year. Local councils already have formal pothole-reporting duties and publish claims data via Freedom of Information requests, making both govt adoption and public data access easier. |
| **Canada** | Pothole damage claims are a recurring, well-documented civic issue — Nova Scotia alone processed 1,745 pothole-related compensation claims between 2024 and April 2026, denying 78% of them, and cities like Hamilton and Saskatoon regularly report claim volumes in the hundreds per season. |
| **Australia** | Similar freeze-thaw and storm-driven road damage patterns to Canada/UK, with state road authorities already running public pothole-reporting hotlines — an easier govt-adoption path than building trust from zero. |

**MVP launch focus:** Start with **one country/city** — recommend UK or Canada, since both already have public FOI-disclosed claims data and existing council reporting duties, which makes it easier to demonstrate real-world credibility and eventually plug into an existing government workflow. Expand to US/Australia after validating the model.

---

## 2. Goals & Non-Goals

### Goals (MVP)
- Let any citizen report a pothole with photo + location in under 60 seconds
- Show all reports on a live, filterable map
- Let citizens upvote existing reports instead of creating duplicates
- Give a local authority a simple dashboard to view, prioritize, and update status of reports
- Automatically detect and merge duplicate reports for the same physical pothole

### Non-Goals (explicitly out of scope for MVP)
- Native mobile apps (web-only, mobile-responsive)
- Payments / contractor bidding marketplace
- Automated pothole detection from dashcam/AI image analysis
- Multi-country/multi-language support (single country/language first)
- Public API for third parties

---

## 3. Users & Personas

| Persona | Description | Key need |
|---|---|---|
| **Citizen Reporter** | Anyone driving/walking who spots a pothole | Report it fast, know it was heard |
| **Repeat Commuter** | Regularly passes the same bad stretch of road | Upvote/confirm existing reports, get updates |
| **Ward/Municipal Officer** | Government employee responsible for road maintenance in an area | See a prioritized list, mark work done |
| **Super Admin (Govt IT)** | Manages officer accounts, oversees all wards | Assign reports, view analytics, export data |

---

## 4. MVP Feature List (Web Only)

### 4.1 Citizen Web App
| Feature | Priority | Notes |
|---|---|---|
| Sign up / login (email or Google OAuth) | P0 | Keep auth simple — no phone OTP for MVP |
| Report a pothole (photo + auto GPS/pin-drop + severity + description) | P0 | Browser geolocation API; manual pin fallback |
| Live map of all reports (pins, clustered) | P0 | Color-coded by status |
| Upvote a report | P0 | One upvote per user per report |
| Duplicate detection on submission ("Is this the same pothole?" prompt) | P0 | Radius-based check (e.g., 30m) before creating new entry |
| View own report status (Reported → Acknowledged → In Progress → Resolved) | P0 | |
| Comment on a report | P1 | |
| Email notification on status change | P1 | |
| Filter map by severity/status/date | P1 | |
| Public stats page (total reports, % resolved, avg resolution time) | P2 | Builds trust/transparency |
| **News & Alerts feed** — surfaces recent pothole-related news/accidents near the user | **P1** | See Section 6.5 for full spec |

### 4.2 Government Admin Dashboard
| Feature | Priority | Notes |
|---|---|---|
| Login (role-based: super admin / ward officer) | P0 | |
| Table + map view of all reports in jurisdiction | P0 | |
| Sort/filter by upvotes, severity, age, ward | P0 | |
| Update report status + optional resolution photo | P0 | |
| Auto-priority score (upvotes + severity + age weighted) | P1 | Simple weighted formula, not ML |
| Assign report to officer/department | P1 | |
| Export reports as CSV | P1 | |
| Analytics: heatmap of density, avg resolution time per ward | P2 | |

---

## 5. Core User Flows

**Flow A — Report a pothole**
1. User logs in → clicks "Report Pothole"
2. Browser requests location permission → auto-fills coordinates (or user drops pin manually)
3. User uploads photo, selects severity, adds optional note
4. System checks for existing reports within ~30m radius
5. If match found → show "Is this the same pothole?" → if yes, convert to upvote; if no, proceed
6. Report created with status "Reported," visible on map instantly

**Flow B — Government resolves a report**
1. Officer logs into dashboard → sees prioritized list (sorted by score)
2. Opens a report → reviews photo, upvotes, comments
3. Updates status to "In Progress," assigns to field team
4. On completion, uploads "after" photo, marks "Resolved"
5. Citizen who reported (and upvoters) get notified

---

## 6. Duplicate Detection Logic (Key Technical Requirement)

- On new report submission, run a geospatial query: find existing **open** reports within a configurable radius (default 30 meters) using PostGIS `ST_DWithin`
- If matches exist, show them to the user before final submission
- If user confirms it's the same pothole → register as an upvote on the existing report instead of a new row
- If no match or user says "different pothole" → create new report
- This logic is the single most important thing to get right — it directly determines data quality and prevents the map from being cluttered with duplicates

---

## 6.5 News & Alerts Feed (New Feature)

**Goal:** Surface real, recent pothole-related news (accidents, damage claims, road-condition warnings) so users can see risk in their area beyond just crowdsourced reports, and take precautionary measures on known-dangerous stretches.

**Important constraint:** Do **not** scrape Google Search results directly — this violates Google's Terms of Service and results in IP blocking or account bans, and scraped snippets/headlines are still copyrighted content that can't be reproduced verbatim at scale. Instead, use a licensed/official data source:

| Option | Notes |
|---|---|
| **NewsAPI.org** | Easiest to integrate, free tier for dev, keyword + country + date filtering |
| **GNews API** | Similar to NewsAPI, good free tier |
| **Bing News Search API (Azure)** | More generous free tier, good relevance ranking |
| **Google Custom Search JSON API** | Official, licensed way to query Google's index (not raw scraping) — has a free daily quota, paid beyond that |
| **Direct RSS feeds** | Pull from specific outlets (BBC, CBC, local news) you know cover pothole stories regularly — no API key needed, fully compliant |

**Recommended for MVP:** NewsAPI.org or GNews (fastest to ship) + a curated list of RSS feeds from major outlets in your target country as a free supplementary source.

**How it works:**
1. A scheduled backend job (cron, e.g. every 6 hours) queries the news API with keywords like `"pothole" AND ("accident" OR "crash" OR "damage claim")`, scoped to the target country
2. Results are stored in a `news_alerts` table (headline, source, URL, published_date, matched_location if extractable, country)
3. Simple keyword-based severity tagging (e.g. contains "death"/"fatal"/"injury" → tagged "alarming"; contains "claim"/"repair"/"pothole season" → tagged "informational")
4. Only the **headline + source link** is shown in-app — no scraping/republishing of full article text (respects copyright; drives traffic back to the original publisher)
5. Alerts are shown in a dedicated feed tab, and an "alarming" tag can trigger a small banner/badge on the map if the news item includes extractable location data near the user

**What NOT to do:**
- Don't reproduce full article text or images in the app — display headline, source name, and a link out
- Don't hit any API/RSS source aggressively enough to violate its rate limits — respect `robots.txt` and documented API quotas
- Don't present unverified news as confirmed fact — always show source attribution

**Data model addition:**
- `news_alerts`: id, headline, source_name, source_url, published_at, country, matched_keywords, alarm_level (informational/alarming), created_at

**Tech addition:** a lightweight job scheduler (e.g. `node-cron` if using Node, or a simple cron-triggered serverless function) to run the fetch job periodically — no need for a separate microservice at MVP scale.

---

## 7. Priority Score Formula (MVP version — simple, explainable)

```
priority_score = (upvotes × 2) + (severity_weight) + (days_open × 0.5)

severity_weight: minor = 1, moderate = 3, severe = 6
```

Sort admin dashboard by this score descending. Keep it transparent and tunable — avoid an opaque ML model for MVP.

---

## 8. Tech Stack (MVP)

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | React + TypeScript | Fast to build, huge ecosystem |
| Map | Leaflet + OpenStreetMap tiles | Free, no API key, good enough for MVP |
| Backend | Node.js + Express (or NestJS) | Simple REST API, JS end-to-end |
| Database | PostgreSQL + PostGIS | Geospatial queries are core to this product |
| DB hosting | Supabase or Neon | Free tier, managed Postgres with PostGIS support |
| Auth | Firebase Auth (Google + email) | Fastest to integrate, free tier |
| Image storage | Cloudinary | Simple upload API, free tier, auto image optimization |
| Hosting — frontend | Vercel | Free, fast, great with React |
| Hosting — backend | Render or Railway | Free/cheap tier, simple deploy |
| Notifications (P1) | SendGrid (email) | Free tier sufficient for MVP volume |
| News aggregation | NewsAPI.org or GNews API (+ RSS feeds) | Licensed source for pothole-related news; avoids scraping Google directly |
| Job scheduler | node-cron or serverless cron trigger | Runs the news-fetch job every few hours |

---

## 9. Data Model (MVP)

- **users**: id, name, email, role (citizen/officer/admin), ward_id, created_at
- **reports**: id, user_id, lat, lng, description, severity, status, image_url, priority_score, ward_id, created_at, updated_at
- **upvotes**: id, report_id, user_id, created_at (unique on report_id + user_id)
- **comments**: id, report_id, user_id, text, created_at
- **status_history**: id, report_id, old_status, new_status, changed_by, changed_at
- **wards**: id, name, boundary (geometry, optional for MVP — can hardcode city/region for v1)
- **news_alerts**: id, headline, source_name, source_url, published_at, country, matched_keywords, alarm_level, created_at

---

## 10. Success Metrics

| Metric | Target (first 3 months post-launch) |
|---|---|
| Reports submitted | 500+ in pilot city |
| Duplicate-detection accuracy | >80% of true duplicates caught |
| % reports acknowledged by govt within 7 days | >50% |
| % reports resolved within 30 days | >30% |
| Citizen return rate (users who report/upvote more than once) | >20% |

---

## 11. Risks & Open Questions

- **Government buy-in**: Without a real municipal partner, the admin side has no live users. *Mitigation:* pilot with one ward/city officer, or simulate with a "demo govt" account for showcase purposes initially.
- **Fake/spam reports**: Need basic image validation and rate-limiting per user.
- **Location accuracy**: Browser geolocation can be inaccurate indoors/urban canyons — always allow manual pin adjustment.
- **Legal/data ownership**: Who owns the report data if a real government partners later? Clarify before scaling.

---

## 12. MVP Build Timeline (Suggested, solo/small team)

| Phase | Duration | Deliverable |
|---|---|---|
| 1. Setup & schema | 3–4 days | Postgres+PostGIS, repo, auth wired up |
| 2. Report creation + map | 1 week | Citizens can report, see pins on map |
| 3. Upvote + duplicate detection | 4–5 days | Core differentiator working |
| 4. Admin dashboard | 1 week | Govt-side status management |
| 5. Notifications + news feed + polish | 5–6 days | Email alerts, news API integration, UI cleanup |
| 6. Testing + demo prep | 3–4 days | Bug fixes, demo script, deploy |

**Total: ~5 weeks** for a working MVP.

---

## 13. Out of Scope for MVP (Future Roadmap)

- Native mobile apps
- AI-based pothole detection from images
- Multi-city/multi-country expansion with localization
- Contractor marketplace / payments
- Public API
- SMS notifications for low-connectivity areas
