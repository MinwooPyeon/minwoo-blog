import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostMeta, Post } from "./types";

const POSTS_DIR = path.join(process.cwd(), "posts");

function parseDate(raw: string): string {
  // "2026-05-14 09:00:00 +0900" → "2026-05-14"
  return String(raw).split(" ")[0];
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = files.map((filename): PostMeta => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const slug = filename.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
    const stats = readingTime(content);

    return {
      slug,
      title: data.title ?? slug,
      date: parseDate(data.date ?? ""),
      categories: Array.isArray(data.categories) ? data.categories.flat() : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description ?? "",
      readingTime: `${Math.ceil(stats.minutes)}분`,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const filename = files.find((f) => f.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "") === slug);
  if (!filename) return null;

  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    date: parseDate(data.date ?? ""),
    categories: Array.isArray(data.categories) ? data.categories.flat() : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description ?? "",
    readingTime: `${Math.ceil(stats.minutes)}분`,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""));
}
