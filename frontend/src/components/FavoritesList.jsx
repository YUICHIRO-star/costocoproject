/**
 * FavoritesList — お気に入り一覧コンポーネント
 */
export default function FavoritesList({ favorites = [], products = [], trends = {}, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-border-default bg-bg-card p-8 text-center">
        <p className="text-4xl mb-3">💝</p>
        <p className="text-sm font-medium text-text-secondary">まだお気に入りがありません</p>
        <p className="mt-1 text-xs text-text-muted">気になる商品の ❤️ をタップして追加しましょう</p>
      </div>
    );
  }

  const getProduct = (productId) => products.find(p => p.id === productId);
  const getTrend = (productId) => trends[productId];

  return (
    <div className="space-y-3">
      {favorites.map(fav => {
        const product = getProduct(fav.product_id);
        const trend = getTrend(fav.product_id);
        if (!product) return null;

        return (
          <div
            key={fav.id}
            className="card-hover flex items-center gap-4 rounded-xl border border-border-default
                       bg-bg-card p-4"
          >
            {/* 商品名 */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-text-primary truncate">{product.name}</h4>
              <p className="text-xs text-text-muted">{product.brand} · {product.category}</p>
              {fav.keywords.length > 0 && (
                <div className="mt-1 flex gap-1">
                  {fav.keywords.map(kw => (
                    <span key={kw} className="rounded-full bg-costco-blue/10 px-2 py-0.5 text-[10px] text-costco-blue">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 価格 */}
            <div className="text-right">
              <p className="text-sm font-bold text-text-primary">
                ¥{(product.is_sale && product.sale_price ? product.sale_price : product.price).toLocaleString()}
              </p>
              {product.is_sale && (
                <span className="text-[10px] font-bold text-costco-red">SALE</span>
              )}
            </div>

            {/* トレンドスコア */}
            {trend && (
              <div className="text-center">
                <p className="text-lg">{trend.trend_label.split(' ')[0]}</p>
                <p className="text-[10px] text-text-muted">{trend.score.toFixed(0)}pt</p>
              </div>
            )}

            {/* 削除 */}
            <button
              onClick={() => onRemove?.(fav.id)}
              className="text-text-muted hover:text-costco-red transition-colors duration-200 text-lg"
              aria-label="お気に入りから削除"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
