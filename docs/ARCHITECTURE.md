# Costco Sniper Architecture

## 1. Current architecture

```text
frontend/                 React + Vite + Tailwind CSS
  └── UI screens/components

backend/                  FastAPI application
  └── app/
      ├── main.py          FastAPI entry point and router registration
      ├── models.py        Pydantic domain models
      ├── routers/         Feature-specific API routes
      └── data/            Mock data for Phase 1
```

## 2. Backend

### 2.1 Framework

- Python
- FastAPI
- Pydantic
- Uvicorn

### 2.2 Current responsibility

The backend is responsible for:

- exposing product APIs
- exposing trend APIs
- exposing favorite APIs
- exposing watchlist APIs
- exposing price history APIs
- aggregating dashboard data
- loading mock data

### 2.3 Important endpoint

`GET /api/dashboard`

This endpoint aggregates:

- all products
- product trends
- notifications
- watchlist items
- sale products
- buzz products
- trending products

This should be treated as the current main contract between backend and frontend.

## 3. Frontend

### 3.1 Framework

- React
- Vite
- Tailwind CSS
- React Router
- Recharts

### 3.2 Frontend responsibility

The frontend should present:

- dashboard summary
- watchlist alert cards
- sale product cards
- trend ranking
- price history charts
- favorite product flows

## 4. Data flow

```text
Mock data JSON
   ↓
FastAPI routers / dashboard aggregation
   ↓
JSON API response
   ↓
React frontend
   ↓
Dashboard / product views / charts
```

## 5. Domain model structure

### Product domain

Represents Costco products and sale state.

### Trend domain

Represents social signal and buzz score.

### Watchlist domain

Represents user-defined keywords and matched product IDs.

### Notification domain

Represents generated alerts from sale, trend, restock, or keyword match events.

### Price history domain

Represents recent price movement and bottom-price judgment.

## 6. Recommended Phase 2 architecture

```text
External source adapters
   ├── costco_product_adapter.py
   ├── manual_sale_importer.py
   ├── social_trend_adapter.py
   └── price_snapshot_job.py
        ↓
Storage layer
   ├── SQLite for local MVP
   └── PostgreSQL later if needed
        ↓
Domain services
   ├── product_service.py
   ├── trend_service.py
   ├── watchlist_service.py
   ├── notification_service.py
   └── price_history_service.py
        ↓
FastAPI routers
        ↓
React frontend
```

## 7. Design principle

Do not directly mix external data ingestion into router functions.

Recommended layering:

1. Adapter: fetches or imports raw data.
2. Normalizer: converts raw data into app models.
3. Service: applies business rules.
4. Router: exposes API response.
5. Frontend: renders user-facing UI.

## 8. Local development

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

## 9. Stability rules

- Keep `/api/dashboard` stable.
- Add new endpoints instead of breaking existing response shape.
- Keep mock data available for frontend development.
- Add tests before replacing mock data behavior.
