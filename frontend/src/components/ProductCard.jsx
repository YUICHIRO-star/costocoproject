/**
 * ProductCard — 商品カードコンポーネント
 */
import TrendBadge from './TrendBadge';

export default function ProductCard({ product, trend, isFavorite, onToggleFavorite, style }) {
  const displayPrice = product.is_sale && product.sale_price
    ? product.sale_price
    : product.price;
  const discount = product.is_sale && product.sale_price
    ? product.price - product.sale_price
    : 0;

  // カテゴリごとの絵文字
  const categoryEmoji = {
    '乳製品': '🥛',
    'ベーカリー': '🍞',
    'デリ・惣菜': '🍗',
    '食品': '🥩',
    '飲料': '🍵',
    '菓子': '🍪',
    '冷凍食品': '🧊',
    'ヘルス＆ビューティー': '💊',
    '日用品': '🧹',
    '家電': '📱',
    'その他': '📦',
  };

  return (
    <div
      className="card-hover relative flex flex-col rounded-[var(--radius-card)] border border-border-default
                 bg-bg-card p-5 cursor-pointer animate-slide-up"
      style={style}
    >
      {/* セールバッジ */}
      {product.is_sale && (
        <div className="absolute top-3 left-3 rounded-full bg-costco-red px-3 py-1 text-xs font-bold text-white shadow-lg">
          SALE
        </div>
      )}

      {/* お気に入りボタン */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(product.id); }}
        className="absolute top-3 right-3 text-2xl transition-transform duration-200 hover:scale-125 active:scale-95"
        aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      {/* 商品イメージ（絵文字プレースホルダー） */}
      <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-bg-secondary text-5xl">
        {categoryEmoji[product.category] || '📦'}
      </div>

      {/* 商品情報 */}
      <div className="flex flex-1 flex-col gap-2">
        {/* ブランド + カテゴリ */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-muted">{product.brand}</span>
          <span className="text-xs text-text-muted">·</span>
          <span className="text-xs text-text-muted">{product.category}</span>
        </div>

        {/* 商品名 */}
        <h3 className="text-base font-bold leading-tight text-text-primary line-clamp-2">
          {product.name}
        </h3>

        {/* 内容量 */}
        {product.unit && (
          <p className="text-xs text-text-secondary">{product.unit}</p>
        )}

        {/* 価格 */}
        <div className="mt-auto flex items-end gap-2 pt-2">
          <span className="text-xl font-black text-text-primary">
            ¥{displayPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-text-muted line-through">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="rounded-full bg-costco-red/15 px-2 py-0.5 text-xs font-bold text-costco-red">
                -{discount.toLocaleString()}円
              </span>
            </>
          )}
        </div>

        {/* トレンドバッジ */}
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <TrendBadge score={trend.score} label={trend.trend_label} size="sm" />
            <span className="text-xs text-text-muted">
              {trend.total_mentions_24h.toLocaleString()} 言及/24h
            </span>
          </div>
        )}

        {/* タグ */}
        {product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs text-text-secondary">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
