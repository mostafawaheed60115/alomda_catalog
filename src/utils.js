const fmt = new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 });

export const formatPrice = (n) => fmt.format(n);

/** All category ids under `rootId`, including itself (supports the parentId hierarchy). */
export function descendantIds(categories, rootId) {
  const ids = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) {
      if (c.parentId && ids.has(c.parentId) && !ids.has(c.id)) {
        ids.add(c.id);
        grew = true;
      }
    }
  }
  return ids;
}

/**
 * Splits "الوصف: ...\nأهم المميزات: ..." into [{ label, text }] rows.
 * Lines without a short "label:" prefix become label-less paragraphs.
 */
export function parseDescription(description) {
  // The API sends `null` (not undefined) for products without a description.
  return String(description ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf(':');
      return i > 0 && i < 28
        ? { label: line.slice(0, i).trim(), text: line.slice(i + 1).trim() }
        : { label: '', text: line };
    });
}

/** Short teaser for cards: the first description row's text. */
export const teaser = (description) => parseDescription(description)[0]?.text ?? '';

/** "حماية قوية، مقاومة المياه، ..." -> ['حماية قوية', 'مقاومة المياه', ...] from the features row. */
export function featureList(description, max = 3) {
  const row = parseDescription(description).find((r) => r.label.includes('المميزات'));
  if (!row) return [];
  return row.text
    .split(/[،,]/)
    .map((s) => s.replace(/\.$/, '').trim())
    .filter(Boolean)
    .slice(0, max);
}

/** The "main use" row, shown as a one-line hint on cards. */
export const usageText = (description) =>
  parseDescription(description).find((r) => r.label.includes('الاستخدام'))?.text.replace(/\.$/, '') ?? '';
