"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";

const PAGE_SIZE = 10;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function PostSearch({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [posts, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <input
        type="search"
        placeholder="제목, 태그, 카테고리 검색..."
        value={query}
        onChange={handleQuery}
        style={{
          width: "100%",
          padding: "0.6rem 1rem",
          fontSize: "0.95rem",
          border: "1px solid var(--color-border)",
          borderRadius: "0.5rem",
          background: "var(--color-card-bg)",
          color: "var(--color-text)",
          outline: "none",
          marginBottom: "1.5rem",
          boxSizing: "border-box",
        }}
      />

      {paginated.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
          검색 결과가 없습니다.
        </p>
      ) : (
        <div>
          {paginated.map((post) => (
            <div key={post.slug} style={{ marginBottom: "1.75rem" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.2rem" }}>
                {formatDate(post.date)}
                {post.categories.length > 0 && (
                  <span style={{ marginLeft: "0.5rem" }}>· {post.categories.join(" / ")}</span>
                )}
                {post.readingTime && (
                  <span style={{ marginLeft: "0.5rem" }}>· {post.readingTime}</span>
                )}
              </div>
              <Link href={`/posts/${post.slug}`} style={{ fontSize: "1rem", fontWeight: 600 }}>
                {post.title}
              </Link>
              {post.description && (
                <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.2rem", marginBottom: 0 }}>
                  {post.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={btnStyle(page === 1)}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={btnStyle(false, n === page)}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={btnStyle(page === totalPages)}
          >
            →
          </button>
        </div>
      )}

      <p style={{ fontSize: "0.8rem", color: "#999", textAlign: "right", marginTop: "1rem" }}>
        {filtered.length}개 포스트
      </p>
    </div>
  );
}

function btnStyle(disabled: boolean, active = false): React.CSSProperties {
  return {
    padding: "0.35rem 0.75rem",
    borderRadius: "0.4rem",
    border: "1px solid #e5e5e5",
    background: active ? "#111" : "transparent",
    color: active ? "#fff" : disabled ? "#ccc" : "#333",
    cursor: disabled ? "default" : "pointer",
    fontSize: "0.875rem",
    fontWeight: active ? 700 : 400,
  };
}
