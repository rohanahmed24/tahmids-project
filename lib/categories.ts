export const BASE_CATEGORIES = [
  "Technology",
  "Design",
  "Culture",
  "Business",
  "Self",
  "Politics",
] as const;

const baseCategoryBySlug = new Map(
  BASE_CATEGORIES.map((category) => [categoryToSlug(category), category]),
);

export function normalizeCategoryName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function categoryToSlug(value: string): string {
  return normalizeCategoryName(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function canonicalizeCategoryName(value: string): string {
  const normalized = normalizeCategoryName(value);
  if (!normalized) return "";

  const normalizedSlug = categoryToSlug(normalized);
  return baseCategoryBySlug.get(normalizedSlug) ?? normalized;
}
