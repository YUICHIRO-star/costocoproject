/**
 * WatchList — 監視リスト表示コンポーネント
 * 登録キーワードに紐づく商品の現在ステータスを一覧表示
 */
import { useState } from 'react';
import { apiPost, apiDelete } from '../hooks/useApi';

const STATUS_STYLES = {
  '🟢 セール中': { bg: 'bg-accent-sale/10', text: 'text-accent-sale', border: 'border-accent-sale/20' },
  '🔥 バズ中': { bg: 'bg-accent-buzz/10', text: 'text-accent-buzz', border: 'border-accent-buzz/20' },
  '⚡ セール＆バズ': { bg: 'bg-accent-sale-buzz/10', text: 'text-accent-sale-buzz', border: 'border-accent-sale-buzz/20' },
  '⚪ 通常': { bg: 'bg-bg-secondary', text: 'text-text-muted', border: 'border-border-default' },
};

export default function WatchList({ watchlistAlerts = [], onRefresh, onProductClick }) {
  const [newKeyword, setNewKeyword] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newKeyword.trim()) return;
    try {
      setAdding(true);
      await apiPost('/watchlist', { keyword: newKeyword.trim() });
      setNewKeyword('');
      onRefresh?.();
    } catch (err) {
      console.error('Watch add error:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (watchId) => {
    try {
      await apiDelete(`/watchlist/${watchId}`);
      onRefresh?.();
    } catch (err) {
      console.error('Watch delete error:', err);
    }
  };

  // アクティブなアラートがあるアイテムを上に
  const sorted = [...watchlistAlerts].sort((a, b) => {
    const aHasAlert = a.matched_products.some(p => p.status !== '⚪ 通常');
    const bHasAlert = b.matched_products.some(p => p.status !== '⚪ 通常');
    return bHasAlert - aHasAlert;
  });

  return (
    <section className="animate-snipe-in">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔍</span>
          <h2 className="text-lg font-black text-text-primary">監視リスト</h2>
          <span className="rounded-full bg-sniper-blue/10 px-2.5 py-0.5 text-xs font-bold text-sniper-blue">
            {watchlistAlerts.length}キーワード
          </span>
        </div>
      </div>

      {/* キーワード追加フォーム */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="監視キーワードを追加..."
          className="flex-1 rounded-xl border border-border-default bg-bg-secondary px-4 py-2.5 text-sm
                   text-text-primary placeholder:text-text-muted
                   focus:outline-none focus:border-sniper-blue/40 focus:ring-1 focus:ring-sniper-blue/20
                   transition-all duration-200"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newKeyword.trim()}
          className="rounded-xl bg-sniper-blue/15 border border-sniper-blue/20 px-5 py-2.5
                   text-sm font-semibold text-sniper-blue
                   hover:bg-sniper-blue/25 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all duration-200"
        >
          {adding ? '追加中...' : '＋ 追加'}
        </button>
      </div>

      {/* 監視リスト */}
      <div className="space-y-3">
        {sorted.map(({ watch, matched_products }) => (
          <div
            key={watch.id}
            className="rounded-xl border border-border-default bg-bg-card/80 p-4
                     hover:border-border-hover transition-all duration-200"
          >
            {/* キーワードヘッダー */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-primary">「{watch.keyword}」</span>
                <span className="text-xs text-text-muted">
                  {matched_products.length}商品マッチ
                </span>
              </div>
              <button
                onClick={() => handleDelete(watch.id)}
                className="text-xs text-text-muted hover:text-sniper-red transition-colors"
                title="監視を解除"
              >
                ✕
              </button>
            </div>

            {/* マッチ商品リスト */}
            {matched_products.length > 0 ? (
              <div className="space-y-2">
                {matched_products.map(({ product, status, trend, sale_remaining }) => {
                  const styles = STATUS_STYLES[status] || STATUS_STYLES['⚪ 通常'];
                  const displayPrice = product.is_sale && product.sale_price
                    ? product.sale_price
                    : product.price;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onProductClick?.(product.id)}
                      className={`flex items-center gap-3 rounded-lg border ${styles.border} ${styles.bg} px-3 py-2.5 cursor-pointer
                                hover:border-border-hover transition-all duration-200`}
                    >
                      {/* ステータスドット */}
                      <span className={`text-xs font-bold ${styles.text} whitespace-nowrap`}>
                        {status}
                      </span>

                      {/* 商品情報 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-text-muted">{product.brand}</p>
                      </div>

                      {/* 価格 */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-text-primary">
                          ¥{displayPrice.toLocaleString()}
                        </p>
                        {product.is_sale && product.sale_price && (
                          <p className="text-[10px] text-text-muted line-through">
                            ¥{product.price.toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* 残り時間 */}
                      {sale_remaining && (
                        <span className="rounded-full bg-sniper-red/15 px-2 py-0.5 text-[10px] font-bold text-sniper-red animate-countdown whitespace-nowrap">
                          {sale_remaining}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-muted py-2">マッチする商品がまだありません</p>
            )}
          </div>
        ))}
      </div>

      {watchlistAlerts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm text-text-secondary">監視キーワードを追加して、商品をスナイプしましょう</p>
        </div>
      )}
    </section>
  );
}
