# Costco Sniper Project Overview

## Project name

Costco Sniper

## Repository

`YUICHIRO-star/costocoproject`

## Product concept

Costco Sniper is a Costco-focused personalized deal and social trend tracking app.

Core concept:

> すべてのチラシを、あなた専用の1枚に。

The app watches user-defined keywords and extracts products that are currently worth attention because they match one or more of the following conditions:

- on sale
- socially trending
- matched to a user's watch keyword
- restocked or newly relevant

## Current implementation status

The repository already has a working Phase 1 structure:

- Backend: Python / FastAPI
- Frontend: React / Vite / Tailwind CSS
- Data source: mock data
- Main integrated endpoint: `/api/dashboard`
- API docs: `/docs` when backend is running

## Current core features

- Product catalog display
- Sale product extraction
- Buzz / trend ranking
- Watchlist keyword matching
- Favorite products
- Price history analysis
- Dashboard API aggregation

## Strategic direction

Phase 1 should remain a mock-data MVP.

Phase 2 should replace mock data with stable ingestion sources such as:

- Costco official online product data, where accessible
- manually curated sale data
- SNS trend signals
- price history snapshots

Do not add scraping or automation that violates site terms. Treat external data ingestion as a separate integration layer.

## Main product value

The app is not a generic shopping list app. Its value is narrowing Costco's large product and deal space into a small personalized view:

- items the user already cares about
- items that are discounted now
- items that are suddenly trending
- items that are likely worth buying soon

## Priority

Keep the MVP focused on decision support:

1. What should I buy now?
2. Why is it worth attention?
3. Is the price good compared with recent history?
4. Did it match one of my watch keywords?
