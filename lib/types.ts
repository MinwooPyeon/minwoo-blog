export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  description?: string;
  readingTime?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export type CategoryColor = {
  accent: string;
  surface: string;
};

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  "프로젝트":  { accent: "oklch(63% 0.21 302)",  surface: "oklch(95% 0.03 300)" },
  "임베디드":  { accent: "oklch(69% 0.16 165)",  surface: "oklch(96% 0.03 168)" },
  "AI":        { accent: "oklch(72% 0.17 324)",  surface: "oklch(96% 0.03 320)" },
  "안드로이드": { accent: "oklch(67% 0.16 244)", surface: "oklch(95% 0.03 242)" },
  "Python":    { accent: "oklch(76% 0.17 82)",   surface: "oklch(96% 0.04 86)"  },
  "C":         { accent: "oklch(70% 0.18 210)",  surface: "oklch(95% 0.03 210)" },
  "C++":       { accent: "oklch(65% 0.20 260)",  surface: "oklch(95% 0.03 260)" },
  "공지":      { accent: "oklch(60% 0.05 100)",  surface: "oklch(96% 0.01 100)" },
};

export function getCategoryColor(categories: string[]): CategoryColor {
  for (const cat of categories) {
    if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  }
  return { accent: "oklch(60% 0.05 240)", surface: "oklch(96% 0.01 240)" };
}
