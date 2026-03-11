/**
 * TrendBadge — 急上昇バッジコンポーネント
 */
export default function TrendBadge({ score, label, size = 'md' }) {
  const getStyle = () => {
    if (score >= 80) return {
      bg: 'bg-accent-hot/15',
      text: 'text-accent-hot',
      border: 'border-accent-hot/30',
      pulse: true,
    };
    if (score >= 55) return {
      bg: 'bg-accent-rising/15',
      text: 'text-accent-rising',
      border: 'border-accent-rising/30',
      pulse: false,
    };
    if (score >= 20) return {
      bg: 'bg-accent-stable/15',
      text: 'text-accent-stable',
      border: 'border-accent-stable/30',
      pulse: false,
    };
    return {
      bg: 'bg-accent-declining/15',
      text: 'text-accent-declining',
      border: 'border-accent-declining/30',
      pulse: false,
    };
  };

  const style = getStyle();
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-semibold
        ${style.bg} ${style.text} ${style.border} ${sizeClass}
        ${style.pulse ? 'animate-pulse-hot' : ''}
        transition-all duration-300
      `}
    >
      {label || `${score.toFixed(0)}pt`}
    </span>
  );
}
