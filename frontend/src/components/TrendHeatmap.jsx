/**
 * TrendHeatmap — トレンドヒートマップコンポーネント
 * Recharts の AreaChart を使ってトレンド推移を可視化
 */
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendHeatmap({ data = [], productName = '' }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
    mentions: d.mentions,
    sentiment: Math.round(d.sentiment * 100),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-text-muted mb-1">{label}</p>
        <p className="text-sm font-bold text-text-primary">
          📢 {payload[0].value.toLocaleString()} 言及
        </p>
        {payload[1] && (
          <p className="text-sm text-accent-stable">
            😊 感情: {payload[1].value}%
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-border-default bg-bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">
          📈 {productName || 'トレンド推移'}（7日間）
        </h3>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="mentionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E31837" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E31837" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ed573" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2ed573" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6c6c88', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6c6c88', fontSize: 11 }}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="mentions"
              stroke="#E31837"
              strokeWidth={2}
              fill="url(#mentionGradient)"
            />
            <Area
              type="monotone"
              dataKey="sentiment"
              stroke="#2ed573"
              strokeWidth={1.5}
              fill="url(#sentimentGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
