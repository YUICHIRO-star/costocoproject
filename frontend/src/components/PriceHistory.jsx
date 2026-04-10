/**
 * PriceHistory — 価格推移チャート
 * Rechartsによる価格推移と底値判定の表示
 */
import { useApi } from '../hooks/useApi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-bg-card border border-border-default px-4 py-3 shadow-xl">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-lg font-black text-text-primary">
        ¥{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function PriceHistory({ productId, productName, onClose }) {
  const { data: analysis, loading } = useApi(
    productId ? `/prices/${productId}/analysis` : null
  );

  if (!productId) return null;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border-default bg-bg-card p-6 animate-snipe-in">
        <div className="flex items-center justify-center h-48">
          <span className="text-sm text-text-muted">読み込み中...</span>
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.history?.length) {
    return (
      <div className="rounded-2xl border border-border-default bg-bg-card p-6 animate-snipe-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-text-primary">📊 {productName}</h3>
          {onClose && (
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">✕</button>
          )}
        </div>
        <p className="text-sm text-text-muted text-center py-8">価格履歴データがありません</p>
      </div>
    );
  }

  const chartData = analysis.history.map(p => ({
    date: p.date.slice(5),
    price: p.price,
  }));

  return (
    <div className="rounded-2xl border border-border-default bg-bg-card p-6 animate-snipe-in">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-text-primary">📊 価格推移 — {productName}</h3>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors text-sm">✕</button>
        )}
      </div>

      {/* 判定結果 */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-lg bg-bg-secondary px-3 py-1.5">
          <span className="text-xs text-text-muted">現在価格</span>
          <span className="text-sm font-black text-text-primary">¥{analysis.current_price.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-bg-secondary px-3 py-1.5">
          <span className="text-xs text-text-muted">平均</span>
          <span className="text-sm font-bold text-text-secondary">¥{Math.round(analysis.avg_price).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-bg-secondary px-3 py-1.5">
          <span className="text-xs text-text-muted">最安</span>
          <span className="text-sm font-bold text-accent-sale">¥{analysis.min_price.toLocaleString()}</span>
        </div>
        {analysis.is_near_bottom && (
          <div className="flex items-center gap-1.5 rounded-lg bg-sniper-gold/10 border border-sniper-gold/20 px-3 py-1.5">
            <span className="text-sm">💰</span>
            <span className="text-xs font-bold text-sniper-gold">底値圏！今が買い時</span>
          </div>
        )}
        {analysis.savings_vs_avg > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-accent-sale/10 border border-accent-sale/20 px-3 py-1.5">
            <span className="text-xs font-bold text-accent-sale">
              平均より{analysis.savings_vs_avg.toLocaleString()}円お得
            </span>
          </div>
        )}
      </div>

      {/* チャート */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B0FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00B0FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 10 }} />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `¥${v.toLocaleString()}`}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={analysis.avg_price}
              stroke="#FF9100"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: '平均', position: 'right', fill: '#FF9100', fontSize: 10 }}
            />
            <ReferenceLine
              y={analysis.min_price}
              stroke="#00E676"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: '最安', position: 'right', fill: '#00E676', fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#00B0FF"
              strokeWidth={2}
              fill="url(#priceGrad)"
              dot={{ r: 3, fill: '#00B0FF', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#00B0FF', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
