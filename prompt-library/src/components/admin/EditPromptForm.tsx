"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CategoryData, Prompt } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { getCategoryDisplayName } from '@/lib/categoryLabels';
import ImageField from './ImageField';
import styles from './admin.module.css';

interface EditPromptFormProps {
  prompt: Prompt;
  categories: CategoryData[];
}

export default function EditPromptForm({ prompt, categories }: EditPromptFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [title, setTitle] = useState(prompt.title);
  const [description, setDescription] = useState(prompt.description);
  const [content, setContent] = useState(prompt.content);
  const [category, setCategory] = useState(prompt.category);
  const [image, setImage] = useState(prompt.image || '');
  const [rating, setRating] = useState(prompt.rating || 8.0);
  const [featured, setFeatured] = useState(prompt.featured);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const response = await fetch(`${basePath}/api/admin/prompts/${prompt.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, content, category, image, rating, featured }),
      });

      if (response.ok) {
        router.push(`/prompts/${prompt.slug}`);
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save prompt');
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      setError('Error saving prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const basePath = window.location.pathname.includes('/PromptLibrary/') ? '/PromptLibrary' : '';
      const response = await fetch(`${basePath}/api/admin/prompts/${prompt.slug}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/prompts');
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete prompt');
        setDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setError('Error deleting prompt');
      setDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link href={`/prompts/${prompt.slug}`} className={styles.backLink}>
        <i className="fa-solid fa-arrow-left"></i> Back to prompt
      </Link>
      <h1>Edit Prompt</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Title <span className={styles.required}>*</span></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label>Description <span className={styles.required}>*</span></label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label>Category <span className={styles.required}>*</span></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.nameKey ? t(cat.nameKey) : cat.name}
              </option>
            ))}
            {!categories.some((cat) => cat.name === category) && (
              <option value={category}>{getCategoryDisplayName(category)}</option>
            )}
          </select>
        </div>

        <div className={styles.field}>
          <label>Image</label>
          <ImageField value={image} onChange={setImage} />
        </div>

        <div className={styles.field}>
          <label>Prompt Content <span className={styles.required}>*</span></label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
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
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => setDeleteConfirm(true)}
          >
            Delete
          </button>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {deleteConfirm && (
        <div className={styles.deleteConfirm}>
          <div className={styles.deleteConfirmCard}>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete "{prompt.title}"? This cannot be undone.</p>
            <div className={styles.deleteConfirmActions}>
              <button className={styles.cancelButton} onClick={() => setDeleteConfirm(false)} disabled={isDeleting}>
                Cancel
              </button>
              <button className={styles.deleteButton} onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
