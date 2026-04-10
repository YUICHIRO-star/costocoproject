/**
 * Navbar — Costco Sniper ナビバー
 */
export default function Navbar({ notificationCount = 0, onNotificationClick }) {
  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border-default">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
        {/* ロゴ */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🎯</span>
          <span className="text-lg font-black tracking-tight gradient-text-sniper">
            Costco Sniper
          </span>
          <span className="hidden sm:inline-block rounded-md bg-sniper-red/10 border border-sniper-red/15 px-2 py-0.5 text-[9px] font-bold text-sniper-red uppercase tracking-wider">
            Beta
          </span>
        </div>

        {/* 右側アクション */}
        <div className="flex items-center gap-4">
          <button
            onClick={onNotificationClick}
            className={`relative rounded-xl px-3 py-2 text-sm transition-all duration-200
              hover:bg-bg-card ${notificationCount > 0 ? 'notification-dot' : ''}`}
            aria-label="通知"
          >
            🔔
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center
                             rounded-full bg-sniper-red text-[10px] font-bold text-white shadow-lg">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
