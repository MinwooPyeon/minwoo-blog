import { getPost, getAllSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <Link href="/posts" style={{ fontSize: "0.875rem", color: "#666" }}>
        ← 포스트 목록
      </Link>

      <header style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
          <time>{formatDate(post.date)}</time>
          {post.categories.length > 0 && (
            <span style={{ marginLeft: "0.5rem" }}>· {post.categories.join(" / ")}</span>
          )}
        </div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.3, wordBreak: "keep-all" }}>
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${tag}`} style={{ fontSize: "0.8rem", color: "#666" }}>
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <hr />

      <div className="prose">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
