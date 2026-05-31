import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, selectedFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()    => setIsDragging(false);
  const handleDrop      = (e)   => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  };
  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onFileSelect(f);
  };

  const zoneClass = [
    'upload-zone',
    isDragging  ? 'drag-over' : '',
    selectedFile ? 'has-file'  : '',
  ].join(' ');

  return (
    <div
      className={zoneClass}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{ padding: '28px 20px', textAlign: 'center' }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: selectedFile ? 'var(--purple-dim)' : 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 12px', fontSize: 20,
      }}>
        {selectedFile ? '📄' : '↑'}
      </div>

      {selectedFile ? (
        <>
          <p style={{ fontWeight: 500, color: 'var(--text-1)', fontSize: 13.5, marginBottom: 4 }}>
            {selectedFile.name}
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: 12 }}>Click to replace</p>
        </>
      ) : (
        <>
          <p style={{ fontWeight: 500, color: 'var(--text-1)', fontSize: 13.5, marginBottom: 5 }}>
            Drag & drop your resume here
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 14 }}>
            PDF files only · max 5 MB
          </p>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12.5, padding: '7px 16px' }}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Choose File
          </button>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
