/**
 * Dashboard — メインダッシュボードコンポーネント
 */
import { useState, useMemo } from 'react';
import { useApi, apiPost, apiDelete } from '../hooks/useApi';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import TrendBadge from './TrendBadge';
import TrendHeatmap from './TrendHeatmap';
import FavoritesList from './FavoritesList';

export default function Dashboard() {
  const { data: dashboard, loading, error } = useApi('/dashboard');
  const { data: allProducts } = useApi('/products');
  const { data: favorites, refetch: refetchFavorites } = useApi('/favorites');
  const { data: trendRanking } = useApi('/trends?limit=12');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTrendProduct, setSelectedTrendProduct] = useState(null);

  // お気に入り商品IDセット
  const favoriteProductIds = useMemo(() => {
    return new Set((favorites || []).map(f => f.product_id));
  }, [favorites]);

  // 検索・フィルタ済み商品
  const filteredProducts = useMemo(() => {
    if (!trendRanking) return [];
    let items = trendRanking;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.product.name.toLowerCase().includes(q) ||
        item.product.brand.toLowerCase().includes(q) ||
        (item.product.name_en && item.product.name_en.toLowerCase().includes(q)) ||
        item.product.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      items = items.filter(item => item.product.category === selectedCategory);
    }

    return items;
  }, [trendRanking, searchQuery, selectedCategory]);

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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl animate-pulse-hot">🛒</div>
          <p className="text-text-secondary text-sm">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center rounded-2xl border border-costco-red/30 bg-costco-red/5 px-8 py-6">
          <p className="text-3xl mb-3">⚠️</p>
          <p className="text-sm font-medium text-costco-red">接続エラー</p>
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
      <section className="relative overflow-hidden rounded-3xl border border-border-default bg-gradient-to-br from-costco-red/10 via-bg-card to-costco-blue/10 p-8">
        <div className="relative z-10">
          <h2 className="text-3xl font-black gradient-text-brand">
            今、コストコで何がバズってる？
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            SNSの声をリアルタイム解析。{dashboard?.total_products || 0}商品のトレンドを追跡中
          </p>
          <div className="mt-5">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>

        {/* デコレーション */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-costco-red/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-costco-blue/5 blur-3xl" />
      </section>

      {/* ─── タブ切り替え ─────────────────────────────── */}
      <div className="flex items-center gap-2">
        {[
          { id: 'dashboard', label: '🏠 ダッシュボード' },
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

      {/* ─── ダッシュボードタブ ──────────────────────── */}
      {activeTab === 'dashboard' && (
        <>
          {/* 🔥 急上昇セクション */}
          {dashboard?.hot_products?.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-xl font-black gradient-text-hot">🔥 急上昇</h3>
                <span className="rounded-full bg-accent-hot/10 px-3 py-1 text-xs font-bold text-accent-hot">
                  HOT
                </span>
              </div>
              <div className="scroll-x">
                {dashboard.hot_products.map((item) => (
                  <div key={item.product.id} className="w-72 flex-shrink-0"
                    onClick={() => setSelectedTrendProduct(item)}
                  >
                    <ProductCard
                      product={item.product}
                      trend={item.trend}
                      isFavorite={favoriteProductIds.has(item.product.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 📈 上昇中セクション */}
          {dashboard?.trending_products?.length > 0 && (
            <section>
              <div className="mb-4">
                <h3 className="text-xl font-black text-text-primary">📈 上昇中のトレンド</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dashboard.trending_products.map((item, idx) => (
                  <div key={item.product.id}
                    onClick={() => setSelectedTrendProduct(item)}
                  >
                    <ProductCard
                      product={item.product}
                      trend={item.trend}
                      isFavorite={favoriteProductIds.has(item.product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 📊 トレンドチャート */}
          {selectedTrendProduct?.trend?.history && (
            <section className="animate-slide-up">
              <TrendHeatmap
                data={selectedTrendProduct.trend.history}
                productName={selectedTrendProduct.product.name}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTrendProduct.trend.top_keywords?.map(kw => (
                  <span key={kw} className="rounded-full bg-costco-blue/10 px-3 py-1 text-xs font-medium text-costco-blue">
                    #{kw}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 📊 統計サマリー */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '追跡商品数', value: dashboard?.total_products || 0, icon: '📦', suffix: '商品' },
              { label: '急上昇', value: dashboard?.hot_products?.length || 0, icon: '🔥', suffix: '商品' },
              { label: '上昇中', value: dashboard?.trending_products?.length || 0, icon: '📈', suffix: '商品' },
              { label: '未読通知', value: dashboard?.notifications?.length || 0, icon: '🔔', suffix: '件' },
            ].map(stat => (
              <div key={stat.label}
                className="glass rounded-xl p-5 transition-all duration-200 hover:border-border-hover">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                    <p className="text-2xl font-black text-text-primary">
                      {stat.value}
                      <span className="text-sm font-normal text-text-muted ml-1">{stat.suffix}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {/* ─── 全商品タブ ──────────────────────────────── */}
      {activeTab === 'all' && (
        <section>
          {/* カテゴリフィルタ */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
                ${!selectedCategory
                  ? 'bg-costco-red text-white shadow-md'
                  : 'bg-bg-card text-text-secondary hover:text-text-primary'
                }`}
            >
              すべて
            </button>
            {(dashboard?.categories || []).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200
                  ${selectedCategory === cat
                    ? 'bg-costco-blue text-white shadow-md'
                    : 'bg-bg-card text-text-secondary hover:text-text-primary'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 商品グリッド */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((item, idx) => (
              <div key={item.product.id}
                onClick={() => setSelectedTrendProduct(item)}
              >
                <ProductCard
                  product={item.product}
                  trend={item.trend}
                  isFavorite={favoriteProductIds.has(item.product.id)}
                  onToggleFavorite={handleToggleFavorite}
                  style={{ animationDelay: `${idx * 80}ms` }}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm text-text-secondary">
                {searchQuery ? `「${searchQuery}」に一致する商品が見つかりません` : '該当する商品がありません'}
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
            products={allProducts || []}
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
          © 2026 CostcoTrendTracker — Built with ❤️ by ユウイチロウ
        </p>
      </footer>
    </div>
  );
}
