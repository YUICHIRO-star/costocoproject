/**
 * SniperHero — メインヒーローセクション
 * 「ノイズゼロ設計」で監視中商品数とアラート状況を一目で把握
 */
import SearchBar from './SearchBar';

export default function SniperHero({
  watchingKeywords = 0,
  activeSales = 0,
  unreadNotifications = 0,
  totalProducts = 0,
  onSearch,
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-sniper bg-bg-card scan-overlay">
      {/* 背景デコレーション */}
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sniper-red/5 blur-[80px]" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sniper-blue/5 blur-[60px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sniper-red/30 to-transparent" />

      <div className="relative z-10 px-8 py-10">
        {/* ブランドヘッダー */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎯</span>
          <h1 className="text-3xl font-black tracking-tight gradient-text-brand">
            Costco Sniper
          </h1>
        </div>
        <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
          あなた専用のコストコ情報を<span className="text-sniper-red font-semibold">スナイプ</span>。
          監視キーワードに一致する商品の値下げ・バズをリアルタイムで検知。
        </p>

        {/* 統計バー */}
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            { icon: '🔍', label: '監視ワード', value: watchingKeywords, unit: '件', accent: 'text-sniper-blue' },
            { icon: '🏷️', label: 'セール中', value: activeSales, unit: '商品', accent: 'text-accent-sale' },
            { icon: '🔔', label: '未読通知', value: unreadNotifications, unit: '件', accent: 'text-sniper-red' },
            { icon: '📦', label: '追跡中', value: totalProducts, unit: '商品', accent: 'text-text-secondary' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex items-center gap-2.5 rounded-xl bg-bg-secondary/80 border border-border-default px-4 py-2.5"
            >
              <span className="text-lg">{stat.icon}</span>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className={`text-lg font-black leading-none ${stat.accent}`}>
                  {stat.value}
                  <span className="text-xs font-normal text-text-muted ml-0.5">{stat.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 検索バー */}
        <div className="mt-6 max-w-lg">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
