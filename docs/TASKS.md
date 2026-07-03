# Costco Sniper Task List

## Immediate tasks

- [ ] Run backend locally.
- [ ] Run frontend locally.
- [ ] Check `/api/dashboard` response.
- [ ] Check `/docs` API documentation.
- [ ] Inspect existing routers.
- [ ] Inspect mock data consistency.

## Backend tasks

- [ ] Add test for root endpoint.
- [ ] Add test for dashboard endpoint.
- [ ] Add tests for product model validation.
- [ ] Add tests for trend score threshold behavior.
- [ ] Add tests for watchlist matched product aggregation.
- [ ] Refactor dashboard aggregation into a service function.
- [ ] Keep router thin after refactor.
- [ ] Add error handling for missing data files.
- [ ] Add type checks where practical.

## Frontend tasks

- [ ] Confirm routing structure.
- [ ] Confirm dashboard page renders all dashboard sections.
- [ ] Add loading state.
- [ ] Add API error state.
- [ ] Add empty state for no watchlist matches.
- [ ] Add sale filter.
- [ ] Add buzz filter.
- [ ] Add category filter.
- [ ] Add product detail page.
- [ ] Add price history chart.

## Data tasks

- [ ] Document mock data schema.
- [ ] Validate product IDs across products, trends, watchlist, favorites, and notifications.
- [ ] Add sample products for frequently purchased Costco items.
- [ ] Add price history examples.
- [ ] Add sale end date examples.
- [ ] Add trend history examples.

## Future integration tasks

- [ ] Design SQLite schema.
- [ ] Add repository layer.
- [ ] Add manual JSON import.
- [ ] Add manual CSV import.
- [ ] Add price snapshot job.
- [ ] Add trend signal adapter.
- [ ] Add notification generation service.

## Rules for Fable

- [ ] Do not rewrite the whole app at once.
- [ ] Do not break `/api/dashboard` without updating frontend and docs together.
- [ ] Prefer small commits.
- [ ] Keep mock mode working.
- [ ] Add tests before major refactors.
- [ ] Record assumptions in docs.
