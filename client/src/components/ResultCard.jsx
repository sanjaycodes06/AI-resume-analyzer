import { motion } from 'framer-motion';

export default function ResultCard({ title, items, icon, color, dimColor, delay = 0 }) {
  return (
    <motion.div
      className="card"
      style={{ padding: '16px 18px' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 12, paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 7,
          background: dimColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, flexShrink: 0,
        }}>
          {icon}
        </span>
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-1)' }}>{title}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 11, fontWeight: 500,
          color, background: dimColor, borderRadius: 99, padding: '1px 8px',
        }}>
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 9,
                fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5,
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: '50%', background: color,
                flexShrink: 0, marginTop: 6,
              }} />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: 12.5, color: 'var(--text-3)', fontStyle: 'italic' }}>
          None identified
        </p>
      )}
    </motion.div>
  );
}
