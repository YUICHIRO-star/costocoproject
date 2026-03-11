/**
 * NotificationPanel — 通知パネルコンポーネント
 */
export default function NotificationPanel({ notifications = [], isOpen, onClose }) {
  if (!isOpen) return null;

  const typeEmoji = {
    'セール': '🎉',
    'トレンド急上昇': '🔥',
    '再入荷': '📦',
    'キーワードマッチ': '📢',
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* パネル */}
      <div className="fixed right-4 top-16 z-50 w-96 max-h-[80vh] overflow-y-auto
                      rounded-2xl border border-border-default bg-bg-secondary shadow-2xl
                      animate-slide-up">
        {/* ヘッダー */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border-default
                        bg-bg-secondary/80 backdrop-blur-md px-5 py-4 rounded-t-2xl">
          <h2 className="text-base font-bold text-text-primary">通知</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-costco-red/15 px-2.5 py-0.5 text-xs font-bold text-costco-red">
              {notifications.filter(n => !n.is_read).length}件 未読
            </span>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 通知リスト */}
        <div className="divide-y divide-border-default p-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-sm">通知はまだありません</p>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <div
                key={notif.id}
                className={`flex gap-3 rounded-xl p-4 transition-colors duration-200
                           hover:bg-bg-card ${!notif.is_read ? 'bg-bg-card/50' : ''}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className="text-2xl flex-shrink-0">
                  {typeEmoji[notif.type] || '📢'}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold leading-tight ${!notif.is_read ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {notif.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="mt-2 text-[10px] text-text-muted">
                    {new Date(notif.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>
                {!notif.is_read && (
                  <div className="h-2 w-2 rounded-full bg-costco-red mt-1.5 flex-shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
