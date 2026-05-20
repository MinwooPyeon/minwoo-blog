import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post, TocEntry } from "./types";

const POSTS_DIR = path.join(process.cwd(), "posts");

function parseDate(raw: unknown): string {
  if (raw instanceof Date) {
    // gray-matter parses YAML timestamps as Date objects; use ISO string to
    // avoid locale-dependent String() output like "Mon May 14 2026 ..."
    return raw.toISOString().split("T")[0];
  }
  return String(raw ?? "").split(" ")[0];
}

function extractToc(content: string): TocEntry[] {
  const lines = content.split("\n");
  const toc: TocEntry[] = [];
  const seen: Record<string, number> = {};

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim().replace(/[*_`]/g, "");
    const base = text.toLowerCase().replace(/[^\w가-힣\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    seen[base] = (seen[base] ?? -1) + 1;
    const id = seen[base] === 0 ? base : `${base}-${seen[base]}`;
    toc.push({ id, text, level });
  }
  return toc;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

function parseFileMeta(filename: string): PostMeta {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug: slugFromFilename(filename),
    title: data.title ?? slugFromFilename(filename),
    date: parseDate(data.date),
    categories: Array.isArray(data.categories) ? data.categories.flat() : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description ?? "",
    readingTime: `${Math.ceil(stats.minutes)}분`,
  };
}

export function getAllPosts(): PostMeta[] {
  return listPostFiles()
    .map(parseFileMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const filename = listPostFiles().find((f) => slugFromFilename(f) === slug);
  if (!filename) return null;

  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    date: parseDate(data.date),
    categories: Array.isArray(data.categories) ? data.categories.flat() : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description ?? "",
    readingTime: `${Math.ceil(stats.minutes)}분`,
    content,
    toc: extractToc(content),
  };
}

export function getAllSlugs(): string[] {
  return listPostFiles().map(slugFromFilename);
}
