"use client";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import { getCategoryColor } from "@/lib/types";

export default function PostCard({ post, wide = false }: { post: PostMeta; wide?: boolean }) {
  const color = getCategoryColor(post.categories);
  const mainCategory = post.categories[0] ?? "";

  return (
    <Link
      href={`/posts/${post.slug}`}
      style={{
        display: "block",
        padding: wide ? "2.25rem 2.4rem" : "1.45rem",
        borderRadius: wide ? "2.5rem" : "2rem",
        background: `radial-gradient(ellipse at top left, color-mix(in oklch, ${color.surface} 60%, var(--color-card-bg)), var(--color-card-bg))`,
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
        backdropFilter: "blur(18px)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        gridColumn: wide ? "span 2" : "span 1",
        animation: "fadeUp 0.5s ease both",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-0.45rem)";
        el.style.boxShadow = "var(--shadow-card-hover)";
        el.style.borderColor = color.accent;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.boxShadow = "var(--shadow-card)";
        el.style.borderColor = "var(--color-border)";
      }}
    >
      {/* 카테고리 accent bar */}
      <div style={{
        width: "2.5rem", height: "0.25rem",
        borderRadius: "999px",
        background: color.accent,
        marginBottom: "1rem",
      }} />

      <div style={{
        display: "flex", flexDirection: "column",
        gap: wide ? "1rem" : "0.75rem",
      }}>
        {mainCategory && (
          <span style={{
            fontSize: "0.78rem", fontWeight: 700,
            color: color.accent, letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            {mainCategory}
          </span>
        )}

        <h2 style={{
          fontSize: wide ? "1.7rem" : "1.2rem",
          fontWeight: 800, lineHeight: 1.2,
          letterSpacing: "-0.04em",
          color: "var(--color-text)",
          wordBreak: "keep-all",
        }}>
          {post.title}
        </h2>

        {post.description && (
          <p style={{
            fontSize: "0.95rem", color: "var(--color-text-muted)",
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: wide ? 3 : 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.description}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <time style={{ fontSize: "0.85rem", color: "var(--color-text-subtle)" }}>
            {post.date}
          </time>
          {post.readingTime && (
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-subtle)" }}>
              · {post.readingTime}
            </span>
          )}
        </div>

        {post.tags.length > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} style={{
                padding: "0.3rem 0.65rem",
                borderRadius: "999px",
                fontSize: "0.78rem", fontWeight: 600,
                background: "var(--color-tag-bg)",
                color: "var(--color-tag-text)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
