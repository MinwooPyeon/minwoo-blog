"use client";
import Link from "next/link";
import { useState } from "react";

export default function TagLink({ tag, count }: { tag: string; count: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/tags/${tag}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        padding: "0.5rem 1rem", borderRadius: "999px",
        background: "var(--color-tag-bg)", color: "var(--color-tag-text)",
        fontSize: "0.9rem", fontWeight: 600,
        border: `1px solid ${hovered ? "var(--color-highlight)" : "var(--color-border)"}`,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tag}
      <span style={{ fontSize: "0.78rem", color: "var(--color-text-subtle)" }}>{count}</span>
    </Link>
  );
}
