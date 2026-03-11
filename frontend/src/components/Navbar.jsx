/**
 * Navbar — ナビゲーションバーコンポーネント
 */
import { useState } from 'react';

export default function Navbar({ notificationCount = 0, onNotificationClick }) {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-border-default">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* ロゴ */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-costco-red to-costco-blue text-lg font-black text-white shadow-lg">
            CT
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight gradient-text-brand">
              CostcoTrend
            </h1>
            <p className="text-[10px] font-medium text-text-muted tracking-wider uppercase">
              Tracker
            </p>
          </div>
        </div>

        {/* 中央ナビリンク */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: 'ダッシュボード', icon: '📊', active: true },
            { label: 'トレンド', icon: '🔥' },
            { label: 'お気に入り', icon: '❤️' },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200
                ${item.active
                  ? 'bg-bg-card text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* 右側アクション */}
        <div className="flex items-center gap-3">
          {/* 通知ベル */}
          <button
            onClick={onNotificationClick}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl
                       bg-bg-card text-text-secondary transition-all duration-200
                       hover:bg-bg-card-hover hover:text-text-primary
                       ${notificationCount > 0 ? 'notification-dot' : ''}`}
            aria-label="通知"
            id="notification-bell"
          >
            🔔
          </button>
        </div>
      </div>
    </nav>
  );
}
