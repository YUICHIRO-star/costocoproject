/**
 * Dashboard — Costco Sniper メインダッシュボード
 * 「ノイズキャンセリングUI」コンセプトで全面刷新
 */
import { useState, useMemo } from 'react';
import { useApi, apiPost, apiDelete } from '../hooks/useApi';
import SniperHero from './SniperHero';
import WatchList from './WatchList';
import BuzzFeed from './BuzzFeed';
import SniperCard from './SniperCard';
import PriceHistory from './PriceHistory';
import TrendBadge from './TrendBadge';
import FavoritesList from './FavoritesList';

export default function Dashboard() {
  const { data: dashboard, loading, error, refetch: refetchDashboard } = useApi('/dashboard');
  const { data: favorites, refetch: refetchFavorites } = useApi('/favorites');
  const { data: trendRanking } = useApi('/trends?limit=12');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sniper');
  const [priceViewProduct, setPriceViewProduct] = useState(null);

  // お気に入り商品IDセット
  const favoriteProductIds = useMemo(() =>
    new Set((favorites || []).map(f => f.product_id)),
    [favorites],
  );

  // 検索フィルタ済み商品
  const filteredTrending = useMemo(() => {
    if (!trendRanking) return [];
    if (!searchQuery) return trendRanking;
    const q = searchQuery.toLowerCase();
    return trendRanking.filter(item =>
      item.product.name.toLowerCase().includes(q) ||
      item.product.brand.toLowerCase().includes(q) ||
      (item.product.name_en && item.product.name_en.toLowerCase().includes(q)) ||
      item.product.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [trendRanking, searchQuery]);

  // お気に入りトグル
  const handleToggleFavorite = async (productId) => {
    try {
      const existing = (favorites || []).find(f => f.product_id === productId);
      if (existing) {
        await apiDelete(`/favorites/${existing.id}`);
      } else {
        await apiPost('/favorites', { product_id: productId });
      }
      refetchFavorites();
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  // 価格推移表示
  const handleViewPrice = (productId) => {
    const prod = trendRanking?.find(t => t.product.id === productId);
    if (prod) {
      setPriceViewProduct({ id: productId, name: prod.product.name });
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl animate-pulse-hot">🎯</div>
          <p className="text-text-secondary text-sm">ターゲットをスキャン中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center rounded-2xl border border-sniper-red/30 bg-sniper-red/5 px-8 py-6">
          <p className="text-3xl mb-3">⚠️</p>
          <p className="text-sm font-medium text-sniper-red">接続エラー</p>
          <p className="mt-1 text-xs text-text-muted">バックエンドサーバーが起動しているか確認してください</p>
          <p className="mt-2 text-xs text-text-muted font-mono bg-bg-secondary rounded-lg px-3 py-1.5">
            uvicorn app.main:app --reload
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">

      {/* ─── ヒーローセクション ───────────────────────── */}
      <SniperHero
        watchingKeywords={dashboard?.watching_keywords || 0}
        activeSales={dashboard?.active_sales || 0}
        unreadNotifications={dashboard?.unread_notifications || 0}
        totalProducts={dashboard?.total_products || 0}
        onSearch={setSearchQuery}
      />

      {/* ─── タブ切り替え ─────────────────────────────── */}
      <div className="flex items-center gap-2">
        {[
          { id: 'sniper', label: '🎯 スナイプ' },
          { id: 'all', label: '📦 全商品' },
          { id: 'favorites', label: '❤️ お気に入り' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-bg-card text-text-primary shadow-md border border-border-hover'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── スナイプタブ（メイン） ──────────────────── */}
      {activeTab === 'sniper' && (
        <div className="space-y-8">

          {/* 監視リスト */}
          {dashboard?.watchlist_alerts?.length > 0 && (
            <WatchList
              watchlistAlerts={dashboard.watchlist_alerts}
              onRefresh={refetchDashboard}
              onProductClick={handleViewPrice}
            />
          )}

          {/* セクションディバイダー */}
          <div className="section-divider" />

          {/* バズ商品 */}
          <BuzzFeed
            buzzProducts={dashboard?.buzz_products || []}
            favoriteProductIds={favoriteProductIds}
            onToggleFavorite={handleToggleFavorite}
            onViewPrice={handleViewPrice}
          />

          {/* 価格推移チャート */}
          {priceViewProduct && (
            <>
              <div className="section-divider" />
              <PriceHistory
                productId={priceViewProduct.id}
                productName={priceViewProduct.name}
                onClose={() => setPriceViewProduct(null)}
              />
            </>
          )}

          {/* セクションディバイダー */}
          <div className="section-divider" />

          {/* セール中商品 */}
          {dashboard?.sale_products?.length > 0 && (
            <section className="animate-snipe-in">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-black text-text-primary">🏷️ セール中</h2>
                <span className="rounded-full bg-accent-sale/10 px-3 py-0.5 text-[10px] font-bold text-accent-sale">
                  {dashboard.sale_products.length}商品
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dashboard.sale_products.map((item, idx) => (
                  <SniperCard
                    key={item.product.id}
                    product={item.product}
                    trend={item.trend}
                    isFavorite={favoriteProductIds.has(item.product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onViewPrice={handleViewPrice}
                    style={{ animationDelay: `${idx * 80}ms` }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 統計サマリー */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '追跡商品数', value: dashboard?.total_products || 0, icon: '📦', suffix: '商品' },
              { label: 'セール中', value: dashboard?.active_sales || 0, icon: '🏷️', suffix: '商品' },
              { label: '監視キーワード', value: dashboard?.watching_keywords || 0, icon: '🔍', suffix: '件' },
              { label: '未読通知', value: dashboard?.unread_notifications || 0, icon: '🔔', suffix: '件' },
            ].map(stat => (
              <div key={stat.label}
                className="glass rounded-xl p-5 transition-all duration-200 hover:border-border-hover">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-text-primary">
                      {stat.value}
                      <span className="text-xs font-normal text-text-muted ml-1">{stat.suffix}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ─── 全商品タブ ──────────────────────────────── */}
      {activeTab === 'all' && (
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTrending.map((item, idx) => (
              <SniperCard
                key={item.product.id}
                product={item.product}
                trend={item.trend}
                isFavorite={favoriteProductIds.has(item.product.id)}
                onToggleFavorite={handleToggleFavorite}
                onViewPrice={handleViewPrice}
                style={{ animationDelay: `${idx * 80}ms` }}
              />
            ))}
          </div>

          {filteredTrending.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm text-text-secondary">
                {searchQuery ? `「${searchQuery}」に一致する商品が見つかりません` : '商品を読み込み中...'}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ─── お気に入りタブ ──────────────────────────── */}
      {activeTab === 'favorites' && (
        <section>
          <h3 className="mb-4 text-xl font-black text-text-primary">❤️ お気に入り</h3>
          <FavoritesList
            favorites={favorites || []}
            products={trendRanking ? trendRanking.map(t => t.product) : []}
            trends={trendRanking
              ? Object.fromEntries(trendRanking.map(t => [t.product.id, t.trend]))
              : {}
            }
            onRemove={async (favId) => {
              try {
                await apiDelete(`/favorites/${favId}`);
                refetchFavorites();
              } catch (err) {
                console.error(err);
              }
            }}
          />
        </section>
      )}

      {/* ─── フッター ────────────────────────────────── */}
      <footer className="border-t border-border-default pt-6 pb-8 text-center">
        <p className="text-xs text-text-muted">
          © 2026 Costco Sniper — Built with 🎯 by ユウイチロウ
        </p>
      </footer>
    </div>
  );
}
