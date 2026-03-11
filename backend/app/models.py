"""CostcoTrendTracker データモデル"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ─── カテゴリ ─────────────────────────────────────────────
class Category(str, Enum):
    FOOD = "食品"
    BAKERY = "ベーカリー"
    DELI = "デリ・惣菜"
    DRINK = "飲料"
    SNACK = "菓子"
    FROZEN = "冷凍食品"
    DAIRY = "乳製品"
    HEALTH = "ヘルス＆ビューティー"
    HOUSEHOLD = "日用品"
    ELECTRONICS = "家電"
    OTHER = "その他"


# ─── 商品 ─────────────────────────────────────────────────
class Product(BaseModel):
    id: str
    name: str
    name_en: Optional[str] = None
    brand: str
    category: Category
    price: int = Field(..., description="価格（税込・円）")
    unit: str = Field(default="", description="内容量（例: 900g x 3）")
    description: str = ""
    image_url: str = ""
    in_stock: bool = True
    is_sale: bool = False
    sale_price: Optional[int] = None
    tags: list[str] = Field(default_factory=list)


# ─── トレンドデータ ───────────────────────────────────────
class TrendDataPoint(BaseModel):
    timestamp: datetime
    mentions: int = Field(..., description="SNS言及数")
    sentiment: float = Field(
        default=0.0, ge=-1.0, le=1.0, description="感情スコア（-1〜1）"
    )


class TrendScore(str, Enum):
    HOT = "🔥 急上昇"
    RISING = "📈 上昇中"
    STABLE = "➡️ 安定"
    DECLINING = "📉 下降中"


class ProductTrend(BaseModel):
    product_id: str
    score: float = Field(
        default=0.0, ge=0.0, le=100.0, description="トレンドスコア（0-100）"
    )
    trend_label: TrendScore = TrendScore.STABLE
    total_mentions_24h: int = 0
    total_mentions_7d: int = 0
    change_rate_24h: float = Field(
        default=0.0, description="24h変化率（%）"
    )
    change_rate_7d: float = Field(default=0.0, description="7日変化率（%）")
    history: list[TrendDataPoint] = Field(default_factory=list)
    top_keywords: list[str] = Field(default_factory=list)


# ─── お気に入り ───────────────────────────────────────────
class Favorite(BaseModel):
    id: str
    user_id: str = "default_user"
    product_id: str
    keywords: list[str] = Field(
        default_factory=list, description="通知キーワード"
    )
    notify_on_sale: bool = True
    notify_on_trend: bool = True
    created_at: datetime = Field(default_factory=datetime.now)


# ─── 通知 ─────────────────────────────────────────────────
class NotificationType(str, Enum):
    SALE = "セール"
    TREND = "トレンド急上昇"
    RESTOCK = "再入荷"
    KEYWORD = "キーワードマッチ"


class Notification(BaseModel):
    id: str
    product_id: str
    type: NotificationType
    title: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.now)


# ─── API レスポンス ───────────────────────────────────────
class ProductWithTrend(BaseModel):
    """商品情報 + トレンドスコアの統合レスポンス"""

    product: Product
    trend: Optional[ProductTrend] = None


class DashboardData(BaseModel):
    """ダッシュボード用の統合データ"""

    hot_products: list[ProductWithTrend] = Field(default_factory=list)
    trending_products: list[ProductWithTrend] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)
    total_products: int = 0
    notifications: list[Notification] = Field(default_factory=list)
