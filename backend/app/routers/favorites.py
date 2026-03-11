"""お気に入り API ルーター"""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..models import Favorite, Notification

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mock_data.json"

# ─── インメモリストア（MVP用の簡易実装） ──────────────────
_favorites: list[Favorite] = []
_notifications: list[Notification] = []
_initialized = False


def _init_store():
    """モックデータからお気に入りと通知を読み込み（初回のみ）"""
    global _favorites, _notifications, _initialized
    if _initialized:
        return
    with open(_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    _favorites = [Favorite(**fav) for fav in data.get("favorites", [])]
    _notifications = [
        Notification(**n) for n in data.get("notifications", [])
    ]
    _initialized = True


# ─── リクエストモデル ─────────────────────────────────────
class AddFavoriteRequest(BaseModel):
    product_id: str
    keywords: list[str] = []
    notify_on_sale: bool = True
    notify_on_trend: bool = True


# ─── エンドポイント ───────────────────────────────────────
@router.get("", summary="お気に入り一覧")
def list_favorites() -> list[Favorite]:
    _init_store()
    return _favorites


@router.post("", summary="お気に入り追加", status_code=201)
def add_favorite(req: AddFavoriteRequest) -> Favorite:
    _init_store()

    # 重複チェック
    for f in _favorites:
        if f.product_id == req.product_id:
            raise HTTPException(
                status_code=409,
                detail="この商品は既にお気に入りに登録されています",
            )

    fav = Favorite(
        id=f"fav_{uuid.uuid4().hex[:8]}",
        product_id=req.product_id,
        keywords=req.keywords,
        notify_on_sale=req.notify_on_sale,
        notify_on_trend=req.notify_on_trend,
        created_at=datetime.now(),
    )
    _favorites.append(fav)
    return fav


@router.delete("/{favorite_id}", summary="お気に入り削除")
def delete_favorite(favorite_id: str) -> dict:
    _init_store()
    for i, f in enumerate(_favorites):
        if f.id == favorite_id:
            _favorites.pop(i)
            return {"message": "お気に入りを削除しました", "id": favorite_id}

    raise HTTPException(
        status_code=404, detail="お気に入りが見つかりません"
    )


@router.get("/notifications", summary="通知一覧")
def list_notifications(unread_only: bool = False) -> list[Notification]:
    _init_store()
    if unread_only:
        return [n for n in _notifications if not n.is_read]
    return _notifications


@router.post(
    "/notifications/{notification_id}/read", summary="通知を既読にする"
)
def mark_notification_read(notification_id: str) -> dict:
    _init_store()
    for n in _notifications:
        if n.id == notification_id:
            n.is_read = True
            return {"message": "既読にしました", "id": notification_id}
    raise HTTPException(status_code=404, detail="通知が見つかりません")
