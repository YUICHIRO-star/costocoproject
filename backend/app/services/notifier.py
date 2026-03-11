"""通知シミュレーションサービス"""

from __future__ import annotations

import uuid
from datetime import datetime

from ..models import Notification, NotificationType, Product, ProductTrend


def check_sale_notification(product: Product) -> Notification | None:
    """商品がセール中なら通知を生成する"""
    if product.is_sale and product.sale_price is not None:
        discount = product.price - product.sale_price
        return Notification(
            id=f"notif_{uuid.uuid4().hex[:8]}",
            product_id=product.id,
            type=NotificationType.SALE,
            title=f"🎉 {product.name}がセール中！",
            message=(
                f"「{product.name}」が ¥{product.price:,} → "
                f"¥{product.sale_price:,} に値下げ中！"
                f"{discount:,}円お得です。"
            ),
            created_at=datetime.now(),
        )
    return None


def check_trend_notification(
    product: Product, trend: ProductTrend
) -> Notification | None:
    """トレンドが急上昇なら通知を生成する"""
    if trend.score >= 80:
        return Notification(
            id=f"notif_{uuid.uuid4().hex[:8]}",
            product_id=product.id,
            type=NotificationType.TREND,
            title=f"🔥 {product.name}がバズってます！",
            message=(
                f"「{product.name}」のSNS言及数が24時間で"
                f"{trend.change_rate_24h:.0f}%増加。"
                f"トレンドスコア{trend.score:.1f}で急上昇中です。"
            ),
            created_at=datetime.now(),
        )
    return None


def check_keyword_match(
    product: Product, keywords: list[str]
) -> Notification | None:
    """キーワードが商品名やタグにマッチするか検査する"""
    product_text = (
        f"{product.name} {product.brand} {' '.join(product.tags)}"
    ).lower()

    for kw in keywords:
        if kw.lower() in product_text:
            return Notification(
                id=f"notif_{uuid.uuid4().hex[:8]}",
                product_id=product.id,
                type=NotificationType.KEYWORD,
                title=f"📢 {product.name}にキーワード一致",
                message=(
                    f"「{product.name}」がキーワード「{kw}」に一致しました。"
                    f"チェックしてみてください！"
                ),
                created_at=datetime.now(),
            )
    return None
