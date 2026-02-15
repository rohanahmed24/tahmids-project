export const BASE_CATEGORIES = [
  "Technology",
  "Philosophy",
  "History",
  "Science",
  "Art",
  "Mystery",
  "Crime",
  "News",
  "Health",
  "Entertainment",
  "Design",
  "Culture",
  "Business",
  "Self",
  "Politics",
] as const;

const BASE_CATEGORY_BN: Record<(typeof BASE_CATEGORIES)[number], string> = {
  Technology: "প্রযুক্তি",
  Philosophy: "দর্শন",
  History: "ইতিহাস",
  Science: "বিজ্ঞান",
  Art: "শিল্প",
  Mystery: "রহস্য",
  Crime: "অপরাধ",
  News: "সংবাদ",
  Health: "স্বাস্থ্য",
  Entertainment: "বিনোদন",
  Design: "ডিজাইন",
  Culture: "সংস্কৃতি",
  Business: "ব্যবসা",
  Self: "আত্মউন্নয়ন",
  Politics: "রাজনীতি",
};

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

export function getBengaliCategoryName(value: string): string {
  const canonical = canonicalizeCategoryName(value);
  if (!canonical) return "";
  return BASE_CATEGORY_BN[canonical as keyof typeof BASE_CATEGORY_BN] ?? canonical;
}

export function getLocalizedCategoryName(value: string, locale: "en" | "bn"): string {
  if (locale === "bn") {
    return getBengaliCategoryName(value);
  }
  return canonicalizeCategoryName(value);
}
