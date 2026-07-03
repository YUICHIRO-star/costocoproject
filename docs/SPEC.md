# Costco Sniper Specification

## 1. Purpose

Costco Sniper helps users identify Costco products that are worth checking now by combining sale status, trend status, watchlist keyword matching, favorites, and price history.

## 2. Target user

Primary user:

- Costco shopper who wants to save time checking deals
- user who repeatedly buys specific products such as yogurt, fruit, drinks, snacks, household goods, and prepared foods
- user who wants alerts for price drops or buzz rather than reading all flyers manually

## 3. Core user stories

### 3.1 Watch keywords

As a user, I want to register keywords such as `オイコス`, `バナナ`, `サーモン`, or `プロテイン`, so that I can see only relevant sale or trend information.

Acceptance criteria:

- User can add a watch keyword.
- A watch keyword can match multiple products.
- Matched products show whether they are on sale, trending, or both.
- User can separately enable sale, restock, and buzz notifications.

### 3.2 Check dashboard

As a user, I want a dashboard that summarizes what matters now.

Dashboard should show:

- watchlist alerts
- buzz products
- sale products
- trend ranking
- unread notifications
- product count
- active sale count
- watch keyword count

### 3.3 Identify sale products

As a user, I want to see products currently on sale and the remaining sale period.

Acceptance criteria:

- Product has `is_sale`.
- Sale product has `sale_price`.
- Optional `sale_ends_at` is converted into a readable remaining time.

### 3.4 Identify buzz products

As a user, I want to identify products that are being discussed heavily on SNS.

Acceptance criteria:

- Product trend has a score from 0 to 100.
- Products with score >= 70 are treated as buzz products.
- Trend labels include hot, rising, stable, and declining states.

### 3.5 Check price history

As a user, I want to know whether the current price is close to the recent bottom.

Acceptance criteria:

- Price analysis returns current price, average price, minimum price, maximum price, and savings versus average.
- `is_near_bottom` indicates whether the current price is near the recent low.

### 3.6 Favorite products

As a user, I want to keep important products as favorites.

Acceptance criteria:

- Favorite entry references product ID.
- Favorite can include notification keywords.
- Favorite can enable sale and trend notification flags.

## 4. Main data models

### Product

Fields:

- `id`
- `name`
- `name_en`
- `brand`
- `category`
- `price`
- `unit`
- `description`
- `image_url`
- `in_stock`
- `is_sale`
- `sale_price`
- `sale_ends_at`
- `tags`

### ProductTrend

Fields:

- `product_id`
- `score`
- `trend_label`
- `total_mentions_24h`
- `total_mentions_7d`
- `change_rate_24h`
- `change_rate_7d`
- `history`
- `top_keywords`
- `buzz_badges`

### WatchItem

Fields:

- `id`
- `user_id`
- `keyword`
- `matched_product_ids`
- `notify_on_sale`
- `notify_on_restock`
- `notify_on_buzz`
- `created_at`

### Notification

Fields:

- `id`
- `product_id`
- `type`
- `title`
- `message`
- `is_read`
- `created_at`

## 5. API specification

### GET `/`

Returns basic API metadata.

Expected fields:

- app name
- version
- docs path

### GET `/api/dashboard`

Returns dashboard data in one response.

Expected response:

- `watchlist_alerts`
- `buzz_products`
- `sale_products`
- `trending`
- `total_products`
- `active_sales`
- `watching_keywords`
- `unread_notifications`
- `notifications`

## 6. Phase 1 constraints

- Use mock data.
- Avoid login/auth unless necessary.
- Keep default user as `default_user`.
- Keep local development simple.
- Do not add paid external services yet.

## 7. Non-goals for Phase 1

- Payment integration
- Full Costco account integration
- Real-time push notification infrastructure
- Production scraping pipeline
- Native mobile app
- Multi-user account system

## 8. Quality expectations

- Existing API behavior should not be broken.
- Dashboard response shape should remain stable unless intentionally versioned.
- Frontend should continue to work with mock data.
- New features should be implemented behind clearly named modules or routes.
