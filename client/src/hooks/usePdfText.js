/**
 * usePdfText.js
 * ─────────────
 * A custom React hook that extracts plain text from a PDF file.
 * We use the FileReader API to read the PDF as text.
 *
 * NOTE: For real PDF parsing you'd use a library like pdf.js,
 * but to keep things simple we read the raw text content.
 * This works well for text-based PDFs (not scanned images).
 */

import { useState } from 'react';

export function usePdfText() {
  // Stores the extracted text from the PDF
  const [pdfText, setPdfText] = useState('');
  // Tracks loading state while reading the file
  const [isReading, setIsReading] = useState(false);
  // Stores any error message
  const [readError, setReadError] = useState('');

  /**
   * extractText
   * @param {File} file - The PDF file object from a file input or drag-drop
   */
  const extractText = (file) => {
    if (!file) return;

    // Only accept PDF files
    if (file.type !== 'application/pdf') {
      setReadError('Please upload a valid PDF file.');
      return;
    }

    setIsReading(true);
    setReadError('');

    // Use FileReader to read the file as plain text
    const reader = new FileReader();

    reader.onload = (event) => {
      // The raw text content of the PDF
      const text = event.target.result;
      setPdfText(text);
      setIsReading(false);
    };

    reader.onerror = () => {
      setReadError('Failed to read the PDF. Please try another file.');
      setIsReading(false);
    };

    // Read as text (works for text-layer PDFs)
    reader.readAsText(file);
  };

  return { pdfText, isReading, readError, extractText };
}
