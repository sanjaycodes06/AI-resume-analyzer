import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import { analyzeResume } from './services/analyzeResume';

function InfoCard({ title, bullets }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', marginBottom: 12 }}>
        {title}
      </p>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.45,
          }}>
            <span style={{ color: 'var(--purple)', flexShrink: 0, marginTop: 1 }}>•</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [selectedFile,   setSelectedFile]   = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing,    setIsAnalyzing]    = useState(false);
  const [results,        setResults]        = useState(null);
  const [error,          setError]          = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResults(null);
    setError('');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJobDescription('');
    setResults(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !jobDescription.trim()) {
      setError('Please upload a resume PDF or paste a job description.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    setResults(null);
    try {
      const data = await analyzeResume(selectedFile, jobDescription);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = (selectedFile || jobDescription.trim()) && !isAnalyzing;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,13,18,0.9)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 54,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: '#fff', fontSize: 13,
            }}>
              A
            </div>
            <span style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--text-1)' }}>
              ResumeAI
            </span>
          </div>
          <span className="pill" style={{ background: 'var(--purple-dim)', color: 'var(--purple)' }}>
            Smart ATS Analysis
          </span>
        </div>
      </nav>

      {/* PAGE BODY */}
      <div style={{ flex: 1, width: '100%', padding: '40px 32px 60px' }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 28 }}
        >
          <h1 style={{
            fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700,
            color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 6,
          }}>
            ATS Resume Checker
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', maxWidth: 560, lineHeight: 1.6 }}>
            Upload your resume and paste a job description. Get an instant ATS score, skill gaps, and actionable improvements.
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div
          className="two-col"
          style={{ display: 'grid', gridTemplateColumns: '62fr 38fr', gap: 24, alignItems: 'start' }}
        >

          {/* LEFT — inputs */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="card" style={{ padding: '22px 22px 18px' }}>

              {/* Upload */}
              <div style={{ marginBottom: 20 }}>
                <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>
                  Upload Resume
                </label>
                <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                {selectedFile && (
                  <p style={{ fontSize: 12, color: 'var(--green)', marginTop: 6 }}>
                    ✓ {selectedFile.name} ready
                  </p>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginBottom: 20 }} />

              {/* Job Description */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label className="section-label">
                    Job Description <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{jobDescription.length} chars</span>
                </div>
                <textarea
                  className="input"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a full ATS match. Leave blank for a general resume review."
                  rows={8}
                  style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: 14, padding: '9px 13px', borderRadius: 8,
                      background: 'var(--red-dim)',
                      border: '1px solid rgba(248,113,113,0.2)',
                      fontSize: 12.5, color: 'var(--red)',
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <motion.button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  whileHover={canAnalyze ? { scale: 1.01 } : {}}
                  whileTap={canAnalyze ? { scale: 0.98 } : {}}
                >
                  {isAnalyzing ? (
                    <>
                      <span style={{
                        width: 13, height: 13,
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                        display: 'inline-block',
                      }} />
                      Analyzing…
                    </>
                  ) : 'Check ATS Score'}
                </motion.button>

                <button className="btn btn-ghost" onClick={handleReset}>
                  Reset
                </button>
              </div>

            </div>
          </motion.div>

          {/* RIGHT — results or info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AnalysisResults results={results} />
                </motion.div>
              ) : (
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <InfoCard title="What You'll Get" bullets={[
                    'Overall ATS-style score and grade',
                    'Missing keywords for the role',
                    'Resume strengths and weaknesses',
                    'Actionable rewrite suggestions',
                    'Works with or without a job description',
                  ]} />

                  <InfoCard title="Privacy" bullets={[
                    'Your resume is processed in memory only — never stored.',
                    'The Gemini API key stays on the server, never in your browser.',
                  ]} />

                  <div className="card" style={{
                    padding: '20px', textAlign: 'center',
                    border: '1px dashed rgba(124,92,252,0.25)',
                    background: 'var(--purple-glow)',
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      border: '2px dashed rgba(124,92,252,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px', fontSize: 20, color: 'rgba(124,92,252,0.4)',
                    }}>?</div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 4 }}>
                      Your ATS score will appear here
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      Upload a resume or paste a job description to begin
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: 'center', padding: '16px 0 24px',
        fontSize: 12, color: 'var(--text-3)',
        borderTop: '1px solid var(--border)',
      }}>
        Built with Gemini AI · for educational purposes only
      </div>

    </div>
  );
}
