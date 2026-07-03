# Costco Sniper Roadmap

## Phase 0: Repository orientation

Goal: understand the current app without changing behavior.

Tasks:

- Read `README.md`.
- Run backend locally.
- Run frontend locally.
- Open FastAPI docs at `/docs`.
- Confirm `/api/dashboard` returns data.
- Confirm frontend can render dashboard data.

Completion criteria:

- Backend starts with no runtime error.
- Frontend starts with no runtime error.
- Dashboard endpoint returns expected JSON.

## Phase 1: Stabilize MVP

Goal: make the mock-data MVP clean and maintainable.

Tasks:

- Add basic backend tests for `/` and `/api/dashboard`.
- Add model validation tests for product, trend, watchlist, and notification models.
- Ensure mock data has consistent IDs across products, trends, watchlist, favorites, and notifications.
- Add clear error handling for missing mock data.
- Confirm frontend build passes.

Completion criteria:

- Backend tests pass.
- Frontend build passes.
- No dashboard-breaking model mismatch remains.

## Phase 2: Improve user-facing experience

Goal: make the app useful as a personal Costco deal dashboard.

Tasks:

- Improve watchlist UI.
- Add product detail view.
- Add sale-only and buzz-only filters.
- Add category filters.
- Add price history chart per product.
- Add notification list UI.

Completion criteria:

- User can check watched products quickly.
- User can understand why a product is being surfaced.
- User can compare current price with recent price history.

## Phase 3: Replace mock data carefully

Goal: move from mock data to semi-real data without breaking the MVP.

Tasks:

- Define data ingestion interface.
- Add manual import format, such as CSV or JSON.
- Add SQLite storage for local data.
- Implement product repository layer.
- Implement price snapshot persistence.
- Keep mock data mode available.

Completion criteria:

- App can run in mock mode.
- App can run in local data mode.
- Data source can be switched without frontend changes.

## Phase 4: Trend signal prototype

Goal: test whether trend/buzz scoring is useful.

Tasks:

- Define trend score formula.
- Add mock social trend importer.
- Add keyword normalization.
- Add score explanation field.
- Display why a product is considered trending.

Completion criteria:

- Trend score is explainable.
- User can see top keywords and buzz badges.

## Phase 5: Notification system

Goal: surface actionable changes.

Tasks:

- Generate notification when watched product goes on sale.
- Generate notification when watched product trend score exceeds threshold.
- Generate notification when restock flag changes.
- Add read/unread state.

Completion criteria:

- Notification rules are deterministic.
- Dashboard unread count matches unread notification data.

## Phase 6: Production hardening

Goal: prepare for real use.

Tasks:

- Add authentication if multi-user use is needed.
- Add persistent database.
- Add scheduled ingestion jobs.
- Add logging.
- Add deployment configuration.
- Add legal / terms review for external data usage.

Completion criteria:

- App can be deployed reproducibly.
- Data ingestion does not depend on manual code edits.
- User-specific watchlists can be persisted.
