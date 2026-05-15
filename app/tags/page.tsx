import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "태그" };

export default function TagsPage() {
  const posts = getAllPosts();
  const tagCount: Record<string, number> = {};
  posts.forEach((p) => p.tags.forEach((t) => { tagCount[t] = (tagCount[t] ?? 0) + 1; }));
  const tags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        태그 <span style={{ fontWeight: 400, color: "#666", fontSize: "0.9rem" }}>({tags.length})</span>
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}>
        {tags.map(([tag, count]) => (
          <Link key={tag} href={`/tags/${tag}`} style={{ fontSize: "0.95rem" }}>
            #{tag} <span style={{ color: "#888", fontSize: "0.8rem" }}>{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
