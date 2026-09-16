import namespaces from './translations';

/**
 * Looks up a dot-path key (e.g. 'nav.home') in the given namespace and
 * interpolates any `{{param}}` placeholders. Falls back to the key itself
 * if it isn't found, so a typo'd key is visible rather than silently blank.
 */
export function t(key: string, params?: Record<string, string>, namespace: string = 'common'): string {
  const keys = key.split('.');
  let value: unknown = namespaces[namespace];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) => str.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue),
      value
    );
  }

  return value;
}

export function useTranslation(namespace: string = 'common') {
  return { t: (key: string, params?: Record<string, string>) => t(key, params, namespace) };
}
