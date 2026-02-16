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
  return normalizeCategoryName(value);
}

export function getBengaliCategoryName(value: string): string {
  return normalizeCategoryName(value);
}

export function getLocalizedCategoryName(value: string, locale: "en" | "bn"): string {
  if (locale === "bn") {
    return getBengaliCategoryName(value);
  }
  return canonicalizeCategoryName(value);
}
