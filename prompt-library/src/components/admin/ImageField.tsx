"use client";

import { useRef, useState } from 'react';
import styles from './admin.module.css';

interface ImageFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function adminBasePath() {
  return window.location.pathname.includes('/PromptLibrary/') ? '/PromptLibrary' : '';
}

export default function ImageField({ value, onChange }: ImageFieldProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async (body: FormData) => {
    setStatus('busy');
    setError('');
    try {
      const response = await fetch(`${adminBasePath()}/api/admin/upload-image`, {
        method: 'POST',
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save image');
      }
      onChange(data.url);
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save image');
      setStatus('error');
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.set('file', file);
    upload(body);
  };

  const handleFetchUrl = () => {
    if (!urlInput.trim()) return;
    const body = new FormData();
    body.set('url', urlInput.trim());
    upload(body);
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    setError('');
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div className={styles.imageModeToggle}>
        <button
          type="button"
          className={`${styles.imageModeButton} ${mode === 'upload' ? styles.imageModeButtonActive : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload
        </button>
        <button
          type="button"
          className={`${styles.imageModeButton} ${mode === 'url' ? styles.imageModeButtonActive : ''}`}
          onClick={() => setMode('url')}
        >
          From URL
        </button>
      </div>

      {mode === 'upload' ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          disabled={status === 'busy'}
        />
      ) : (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={status === 'busy'}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className={styles.imageModeButton}
            style={{ border: '1px solid var(--border-color)', borderRadius: '8px' }}
            onClick={handleFetchUrl}
            disabled={status === 'busy' || !urlInput.trim()}
          >
            Save
          </button>
        </div>
      )}

      {status === 'busy' && <p className={styles.imageStatus}>Saving image...</p>}
      {status === 'error' && <p className={`${styles.imageStatus} ${styles.imageStatusError}`}>{error}</p>}

      {value && (
        <div>
          <img src={value} alt="Preview" className={styles.imagePreview} />
          <button
            type="button"
            className={styles.imageModeButton}
            onClick={handleRemove}
          >
            Remove image
          </button>
        </div>
      )}
    </div>
  );
}
