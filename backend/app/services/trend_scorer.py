"""トレンドスコア算出サービス"""

from __future__ import annotations

from ..models import ProductTrend, TrendScore


def calculate_trend_label(score: float) -> TrendScore:
    """スコア値からトレンドラベルを判定する"""
    if score >= 80:
        return TrendScore.HOT
    elif score >= 55:
        return TrendScore.RISING
    elif score >= 20:
        return TrendScore.STABLE
    else:
        return TrendScore.DECLINING


def calculate_trend_score(
    mentions_24h: int,
    mentions_prev_24h: int,
    mentions_7d: int,
    mentions_prev_7d: int,
) -> float:
    """
    SNS言及数の変化率からトレンドスコアを算出する。

    - 24h 変化率に重み 0.7
    - 7d  変化率に重み 0.3
    - 結果を 0-100 にクランプ
    """
    if mentions_prev_24h == 0:
        change_24h = 100.0 if mentions_24h > 0 else 0.0
    else:
        change_24h = (
            (mentions_24h - mentions_prev_24h) / mentions_prev_24h
        ) * 100

    if mentions_prev_7d == 0:
        change_7d = 100.0 if mentions_7d > 0 else 0.0
    else:
        change_7d = (
            (mentions_7d - mentions_prev_7d) / mentions_prev_7d
        ) * 100

    # 変化率をスコアにマッピング（0-100）
    raw_score = (change_24h * 0.7 + change_7d * 0.3) * 0.5
    return max(0.0, min(100.0, raw_score))


def enrich_trend(trend: ProductTrend) -> ProductTrend:
    """トレンドデータにラベルを再計算して付与する"""
    trend.trend_label = calculate_trend_label(trend.score)
    return trend
