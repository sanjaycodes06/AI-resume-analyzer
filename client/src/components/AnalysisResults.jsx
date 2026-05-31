import { motion } from 'framer-motion';
import ScoreRing from './ScoreRing';
import ResultCard from './ResultCard';

export default function AnalysisResults({ results }) {
  const { atsScore, missingSkills, strengths, weaknesses, suggestions } = results;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Score card */}
      <div className="card" style={{ padding: '20px 22px' }}>
        <ScoreRing score={atsScore} />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, marginTop: 18, paddingTop: 16,
          borderTop: '1px solid var(--border)',
        }}>
          {[
            { n: missingSkills.length, label: 'Missing', color: 'var(--red)',   dim: 'var(--red-dim)'   },
            { n: strengths.length,     label: 'Strengths', color: 'var(--green)', dim: 'var(--green-dim)' },
            { n: weaknesses.length,    label: 'Weaknesses', color: 'var(--amber)', dim: 'var(--amber-dim)' },
          ].map(({ n, label, color, dim }) => (
            <div key={label} style={{
              textAlign: 'center', padding: '10px 8px',
              borderRadius: 10, background: dim,
            }}>
              <p style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{n}</p>
              <p style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2x2 result cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <ResultCard title="Missing Skills" items={missingSkills} icon="🔍"
          color="var(--red)"    dimColor="var(--red-dim)"    delay={0.05} />
        <ResultCard title="Strengths"      items={strengths}     icon="✓"
          color="var(--green)"  dimColor="var(--green-dim)"  delay={0.1}  />
        <ResultCard title="Weaknesses"     items={weaknesses}    icon="⚠"
          color="var(--amber)"  dimColor="var(--amber-dim)"  delay={0.15} />
        <ResultCard title="Suggestions"    items={suggestions}   icon="→"
          color="var(--purple)" dimColor="var(--purple-dim)" delay={0.2}  />
      </div>
    </motion.div>
  );
}
