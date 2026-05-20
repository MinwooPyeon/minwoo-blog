import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <div>
      <section style={{ paddingTop: "1rem" }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-subtle)", marginBottom: "0.75rem" }}>
          최근 포스트
        </p>

        {posts.map((post) => (
          <div
            key={post.slug}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
              padding: "0.9rem 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <time style={{ fontSize: "0.8rem", color: "var(--color-text-subtle)" }}>
              {formatDate(post.date)}
            </time>
            <Link
              href={`/posts/${post.slug}`}
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-text)",
                lineHeight: 1.4,
                wordBreak: "keep-all",
              }}
            >
              {post.title}
            </Link>
            {post.description && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-muted)",
                  margin: 0,
                  lineHeight: 1.6,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.description}
              </p>
            )}
          </div>
        ))}

        <div style={{ paddingTop: "1.25rem" }}>
          <Link href="/posts" style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            모든 포스트 보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
