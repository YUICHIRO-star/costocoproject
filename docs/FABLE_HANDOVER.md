# Fable Handover: Costco Sniper

## Role

You are taking over development of Costco Sniper.

This is a Costco-focused personalized deal and social trend tracking app.

## Product goal

Build a dashboard that extracts only the Costco products worth attention now:

- products matching user watch keywords
- sale products
- buzz products
- products near recent bottom price
- unread notifications

## Current stack

Backend:

- Python
- FastAPI
- Pydantic
- Uvicorn
- mock JSON data

Frontend:

- React
- Vite
- Tailwind CSS
- React Router
- Recharts

## Start here

1. Read `README.md`.
2. Read `docs/PROJECT_OVERVIEW.md`.
3. Read `docs/SPEC.md`.
4. Read `docs/ARCHITECTURE.md`.
5. Run backend.
6. Run frontend.
7. Confirm `/api/dashboard`.

## Development commands

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Critical contract

Do not break `GET /api/dashboard` without updating the frontend and docs together.

The dashboard response is the current integration point between backend and frontend.

## First recommended implementation task

Add backend tests:

- root endpoint returns app metadata
- dashboard endpoint returns expected keys
- sale products contain products with `is_sale == true`
- buzz products contain trends with score >= 70
- watchlist alerts include matched products

## Second recommended implementation task

Refactor dashboard aggregation out of `main.py` into a service module.

Suggested file:

```text
backend/app/services/dashboard_service.py
```

Expected behavior:

- keep API response unchanged
- make logic testable
- keep `main.py` focused on app setup and routing

## Third recommended implementation task

Document mock data schema and validate mock data consistency.

Check:

- every trend product ID exists in products
- every watchlist matched product ID exists in products
- every notification product ID exists in products
- every favorite product ID exists in products

## Important constraints

- Keep mock data mode working.
- Avoid production scraping changes at this stage.
- Do not add authentication yet unless explicitly requested.
- Do not introduce a database until mock-data behavior is covered by tests.
- Prefer small changes with clear commit messages.

## Product interpretation

This is not just a shopping list.

It is a decision-support tool for Costco shoppers. The key output is a compressed view of what is worth buying, watching, or ignoring.

## Suggested implementation order

1. Tests
2. Dashboard service refactor
3. Mock data schema validation
4. Frontend loading/error states
5. Product detail page
6. Price history chart
7. Local persistence
8. External data integration

## Definition of done for the next PR

A good first PR should include:

- backend tests for current dashboard behavior
- no frontend regressions
- no API response shape breakage
- a short note explaining the current data assumptions
