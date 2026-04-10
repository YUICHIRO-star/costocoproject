"""価格履歴 API ルーター"""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from ..models import PriceAnalysis, PricePoint, Product

router = APIRouter(prefix="/api/prices", tags=["prices"])

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mock_data.json"


def _load_data():
    with open(_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    products = {p["id"]: Product(**p) for p in data["products"]}
    price_history = {
        pid: [PricePoint(**pp) for pp in points]
        for pid, points in data.get("price_history", {}).items()
    }
    return products, price_history


# ─── エンドポイント ───────────────────────────────────────
@router.get("/{product_id}/history", summary="価格推移データ")
def get_price_history(product_id: str) -> list[PricePoint]:
    products, price_history = _load_data()

    if product_id not in products:
        raise HTTPException(status_code=404, detail="商品が見つかりません")

    return price_history.get(product_id, [])


@router.get("/{product_id}/analysis", summary="価格分析データ")
def get_price_analysis(product_id: str) -> PriceAnalysis:
    products, price_history = _load_data()

    if product_id not in products:
        raise HTTPException(status_code=404, detail="商品が見つかりません")

    product = products[product_id]
    history = price_history.get(product_id, [])

    if not history:
        # 価格履歴がない場合は現在価格のみで返す
        current = product.sale_price if product.is_sale and product.sale_price else product.price
        return PriceAnalysis(
            product_id=product_id,
            current_price=current,
            avg_price=float(current),
            min_price=current,
            max_price=current,
            is_near_bottom=False,
            savings_vs_avg=0,
            history=[],
        )

    prices = [p.price for p in history]
    current = product.sale_price if product.is_sale and product.sale_price else product.price
    avg = sum(prices) / len(prices)
    min_p = min(prices)
    max_p = max(prices)

    # 底値判定: 現在価格が過去最低価格の105%以内なら「底値付近」
    is_near_bottom = current <= min_p * 1.05
    savings = int(avg - current)

    return PriceAnalysis(
        product_id=product_id,
        current_price=current,
        avg_price=round(avg, 0),
        min_price=min_p,
        max_price=max_p,
        is_near_bottom=is_near_bottom,
        savings_vs_avg=max(0, savings),
        history=history,
    )
