"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryData } from '@/types';
import { useTranslation } from '@/lib/i18n';
import ImageField from './ImageField';
import styles from './admin.module.css';

interface NewPromptFormProps {
  categories: CategoryData[];
}

export default function NewPromptForm({ categories }: NewPromptFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(8.0);
  const [featured, setFeatured] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const basePath = window.location.pathname.includes('/PromptLibrary/') ? '/PromptLibrary' : '';
      const response = await fetch(`${basePath}/api/admin/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          image,
          rating,
          featured,
          customFileName: customFileName.trim() || undefined,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        router.push(`/prompts/${created.slug}`);
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create prompt');
      }
    } catch (err) {
      console.error('Error creating prompt:', err);
      setError('Error creating prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link href="/prompts" className={styles.backLink}>
        <i className="fa-solid fa-arrow-left"></i> Back to all prompts
      </Link>
      <h1>New Prompt</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Title <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The prompt's title"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Description <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of what this prompt does"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Category <span className={styles.required}>*</span></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.nameKey ? t(cat.nameKey) : cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Image</label>
          <ImageField value={image} onChange={setImage} />
        </div>

        <div className={styles.field}>
          <label>Custom File Name</label>
          <input
            type="text"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder="Optional, will be auto-generated if left blank"
          />
          <p className={styles.hint}>Letters, numbers, hyphens, and underscores only — no file extension needed</p>
        </div>

        <div className={styles.field}>
          <label>Prompt Content <span className={styles.required}>*</span></label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the prompt content here (Markdown supported)"
            required
          />
        </div>

        <div className={styles.field}>
          <label>Rating (1-10)</label>
          <div className={styles.ratingRow}>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
            />
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured">Mark as featured prompt</label>
        </div>

        <div className={styles.actions}>
          <span />
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Prompt'}
          </button>
        </div>
      </form>
    </div>
  );
}
