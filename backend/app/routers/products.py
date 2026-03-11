"""商品 API ルーター"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Query

from ..models import Category, Product

router = APIRouter(prefix="/api/products", tags=["products"])

# ─── モックデータ読み込み ─────────────────────────────────
_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mock_data.json"


def _load_products() -> list[Product]:
    with open(_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    return [Product(**p) for p in data["products"]]


# ─── エンドポイント ───────────────────────────────────────
@router.get("", summary="商品一覧")
def list_products(
    category: Optional[Category] = Query(None, description="カテゴリで絞り込み"),
    keyword: Optional[str] = Query(None, description="キーワード検索"),
    sale_only: bool = Query(False, description="セール品のみ"),
) -> list[Product]:
    products = _load_products()

    if category:
        products = [p for p in products if p.category == category]

    if keyword:
        kw = keyword.lower()
        products = [
            p
            for p in products
            if kw in p.name.lower()
            or kw in p.brand.lower()
            or (p.name_en and kw in p.name_en.lower())
            or any(kw in tag.lower() for tag in p.tags)
        ]

    if sale_only:
        products = [p for p in products if p.is_sale]

    return products


@router.get("/categories", summary="カテゴリ一覧")
def list_categories() -> list[str]:
    return [c.value for c in Category]


@router.get("/{product_id}", summary="商品詳細")
def get_product(product_id: str) -> Product | None:
    products = _load_products()
    for p in products:
        if p.id == product_id:
            return p
    return None
