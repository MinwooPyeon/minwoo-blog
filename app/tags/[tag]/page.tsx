import { getAllPosts } from "@/lib/posts";
import PostList from "@/components/PostList";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getAllPosts().filter((p) => p.tags.includes(tag));

  return (
    <div>
      <Link href="/tags" style={{ fontSize: "0.875rem", color: "#666" }}>← 태그 목록</Link>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "1rem 0 1.5rem" }}>
        #{tag} <span style={{ fontWeight: 400, color: "#666", fontSize: "0.9rem" }}>({posts.length})</span>
      </h1>
      <PostList posts={posts} />
    </div>
  );
}
