import { t } from './i18n';

/**
 * Prompt/category data still stores category names in Chinese (they're the
 * literal `category:` values in prompts/*.md, which are untouched content
 * data) — this maps that raw value to its English display label.
 */
const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  '内容创作': 'categories.content_creation',
  '编程开发': 'categories.programming',
  '创意设计': 'categories.creative_design',
  '数据分析': 'categories.data_analysis',
  '营销推广': 'categories.marketing',
  '教育学习': 'categories.education',
  '其他': 'categories.other',
};

export function getCategoryDisplayName(category: string): string {
  const key = CATEGORY_TRANSLATION_KEYS[category];
  return key ? t(key) : category;
}
