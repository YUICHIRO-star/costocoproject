/**
 * BuzzFeed — SNSバズ商品セクション
 * AIがピックした「今バズっている商品」をカルーセルで表示
 */
import SniperCard from './SniperCard';

export default function BuzzFeed({
  buzzProducts = [],
  favoriteProductIds = new Set(),
  onToggleFavorite,
  onViewPrice,
}) {
  if (!buzzProducts.length) return null;

  return (
    <section className="animate-snipe-in">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-black gradient-text-hot">🔥 今、バズってる</h2>
        <span className="rounded-full bg-sniper-red/10 border border-sniper-red/15 px-3 py-0.5 text-[10px] font-bold text-sniper-red animate-glow-pulse">
          SNS TRENDING
        </span>
      </div>

      {/* ソーシャルプルーフ説明 */}
      <p className="text-xs text-text-muted mb-4">
        SNSの投稿数・感情分析をAIがリアルタイム解析。トレンドスコア70以上の商品をピックアップ。
      </p>

      {/* カルーセル */}
      <div className="scroll-x">
        {buzzProducts.map((item, idx) => (
          <div key={item.product.id} className="w-72 flex-shrink-0">
            <SniperCard
              product={item.product}
              trend={item.trend}
              isFavorite={favoriteProductIds.has(item.product.id)}
              onToggleFavorite={onToggleFavorite}
              onViewPrice={onViewPrice}
              style={{ animationDelay: `${idx * 100}ms` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
