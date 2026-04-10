/**
 * SniperCard — 新・商品カードコンポーネント
 * カウントダウン・底値バッジ・バズバッジを搭載
 */
import { useState, useEffect } from 'react';
import TrendBadge from './TrendBadge';

const CATEGORY_EMOJI = {
  '乳製品': '🥛', 'ベーカリー': '🍞', 'デリ・惣菜': '🍗',
  '食品': '🥩', '飲料': '🍵', '菓子': '🍪', '冷凍食品': '🧊',
  'ヘルス＆ビューティー': '💊', '日用品': '🧹', '家電': '📱', 'その他': '📦',
};

function useCountdown(endsAt) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!endsAt) return;

    const calc = () => {
      const now = new Date();
      const end = new Date(endsAt);
      const diff = end - now;
      if (diff <= 0) { setRemaining('終了'); return; }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);

      if (days > 0) setRemaining(`${days}日${hours}時間`);
      else if (hours > 0) setRemaining(`${hours}時間${mins}分`);
      else setRemaining(`${mins}分`);
    };

    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return remaining;
}

export default function SniperCard({
  product,
  trend,
  priceAnalysis,
  isFavorite,
  onToggleFavorite,
  onViewPrice,
  style,
}) {
  const displayPrice = product.is_sale && product.sale_price
    ? product.sale_price : product.price;
  const discount = product.is_sale && product.sale_price
    ? product.price - product.sale_price : 0;
  const countdown = useCountdown(product.sale_ends_at);

  const isNearBottom = priceAnalysis?.is_near_bottom;
  const isBuzzing = trend && trend.score >= 70;

  // カードのステータスクラス
  const statusClass = product.is_sale && isBuzzing ? 'sale-buzz'
    : product.is_sale ? 'on-sale'
    : isBuzzing ? 'buzzing' : '';

  return (
    <div
      className={`sniper-card ${statusClass} relative flex flex-col rounded-2xl border border-border-default
                  bg-bg-card p-5 cursor-pointer animate-snipe-in`}
      style={style}
    >
      {/* セール終了カウントダウン */}
      {product.is_sale && countdown && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
          <span className="countdown-badge -mt-3 rounded-full bg-bg-card border border-sniper-red/30
                         px-3 py-1 text-[10px] font-bold text-sniper-red animate-countdown">
            ⏰ 残り{countdown}
          </span>
        </div>
      )}

      {/* バッジ群 */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {product.is_sale && (
          <span className="rounded-lg bg-accent-sale/15 border border-accent-sale/20 px-2.5 py-0.5
                         text-[10px] font-bold text-accent-sale">
            SALE
          </span>
        )}
        {isNearBottom && (
          <span className="rounded-lg bg-sniper-gold/15 border border-sniper-gold/20 px-2.5 py-0.5
                         text-[10px] font-bold text-sniper-gold">
            💰 底値圏
          </span>
        )}
      </div>

      {/* お気に入りボタン */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(product.id); }}
        className="absolute top-3 right-3 text-xl transition-transform duration-200 hover:scale-125 active:scale-95"
        aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      {/* 商品イメージ */}
      <div className="mt-2 mb-4 flex h-24 items-center justify-center rounded-xl bg-bg-secondary/60 text-4xl">
        {CATEGORY_EMOJI[product.category] || '📦'}
      </div>

      {/* 商品情報 */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-text-muted">{product.brand}</span>
          <span className="text-[10px] text-text-muted">·</span>
          <span className="text-[10px] text-text-muted">{product.category}</span>
        </div>

        <h3 className="text-sm font-bold leading-tight text-text-primary line-clamp-2">
          {product.name}
        </h3>

        {product.unit && (
          <p className="text-[10px] text-text-secondary">{product.unit}</p>
        )}

        {/* 価格 */}
        <div className="mt-auto flex items-end gap-2 pt-2">
          <span className={`text-xl font-black ${product.is_sale ? 'gradient-text-sale' : 'text-text-primary'}`}>
            ¥{displayPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-text-muted line-through">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="rounded-full bg-accent-sale/15 px-1.5 py-0.5 text-[10px] font-bold text-accent-sale">
                -{discount.toLocaleString()}円
              </span>
            </>
          )}
        </div>

        {/* 平均価格との比較 */}
        {priceAnalysis && priceAnalysis.savings_vs_avg > 0 && (
          <p className="text-[10px] text-accent-sale font-medium">
            📊 平均より{priceAnalysis.savings_vs_avg.toLocaleString()}円お得
          </p>
        )}

        {/* トレンドバッジ */}
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <TrendBadge score={trend.score} label={trend.trend_label} size="sm" />
            <span className="text-[10px] text-text-muted">
              {trend.total_mentions_24h.toLocaleString()} 言及/24h
            </span>
          </div>
        )}

        {/* バズバッジ */}
        {trend?.buzz_badges?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {trend.buzz_badges.slice(0, 2).map(badge => (
              <span key={badge} className="rounded-full bg-sniper-red/8 border border-sniper-red/10
                                         px-2 py-0.5 text-[9px] font-medium text-sniper-red/80">
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* 価格推移を見る */}
        {onViewPrice && (
          <button
            onClick={(e) => { e.stopPropagation(); onViewPrice(product.id); }}
            className="mt-2 text-[10px] text-sniper-blue hover:text-sniper-blue/80 font-medium transition-colors"
          >
            📈 価格推移を見る →
          </button>
        )}
      </div>
    </div>
  );
}
