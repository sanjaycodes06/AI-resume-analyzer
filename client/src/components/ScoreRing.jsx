import { motion } from 'framer-motion';

export default function ScoreRing({ score }) {
  const r     = 42;
  const circ  = 2 * Math.PI * r;
  const empty = circ - (score / 100) * circ;

  const color    = score >= 75 ? 'var(--green)'     : score >= 50 ? 'var(--amber)'     : 'var(--red)';
  const dimColor = score >= 75 ? 'var(--green-dim)' : score >= 50 ? 'var(--amber-dim)' : 'var(--red-dim)';
  const grade    = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D';
  const label    = score >= 75 ? 'Strong Match' : score >= 50 ? 'Decent Match' : 'Needs Work';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: empty }}
            transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.span
            style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {score}
          </motion.span>
          <span style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>/100</span>
        </div>
      </div>

      <div>
        <p className="section-label" style={{ marginBottom: 6 }}>ATS Score</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-1)' }}>
            {score}
          </span>
          <span style={{ fontSize: 14, color: 'var(--text-3)' }}>/ 100</span>
          <span style={{
            fontSize: 13, fontWeight: 700, color,
            background: dimColor, borderRadius: 6, padding: '1px 8px', marginLeft: 2,
          }}>
            {grade}
          </span>
        </div>
        <span className="pill" style={{ background: dimColor, color, fontSize: 11.5 }}>
          {label}
        </span>
      </div>
    </div>
  );
}
