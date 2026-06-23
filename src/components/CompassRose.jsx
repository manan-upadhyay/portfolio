// Shared cartographer compass rose. Sizing/opacity come from `className`
// (default = the 64px / 60%-opacity used in the Map overlay).
const CompassRose = ({ className = 'w-16 h-16 opacity-60' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="22" fill="none" stroke="var(--color-ember)" strokeWidth="0.6" strokeDasharray="1 2" />
    <polygon points="32,8 36,32 32,30 28,32" fill="var(--color-ember)" />
    <polygon points="32,56 28,32 32,34 36,32" fill="var(--color-gold)" opacity="0.7" />
    <polygon points="8,32 32,28 30,32 32,36" fill="var(--color-gold)" opacity="0.5" />
    <polygon points="56,32 32,36 34,32 32,28" fill="var(--color-gold)" opacity="0.5" />
    <text x="32" y="6" textAnchor="middle" fontSize="6" fill="var(--color-ember)" fontFamily="monospace">N</text>
  </svg>
);

export default CompassRose;
