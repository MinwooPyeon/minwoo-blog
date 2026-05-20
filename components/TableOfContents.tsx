import type { TocEntry } from "@/lib/types";

export default function TableOfContents({ toc }: { toc: TocEntry[] }) {
  if (toc.length < 2) return null;

  return (
    <nav
      aria-label="목차"
      style={{
        background: "var(--color-tag-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "0.5rem",
        padding: "1rem 1.25rem",
        marginBottom: "2rem",
        fontSize: "0.875rem",
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: "0.6rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
        목차
      </p>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {toc.map((entry) => (
          <li key={entry.id} style={{ paddingLeft: entry.level === 3 ? "1rem" : "0" }}>
            <a
              href={`#${entry.id}`}
              style={{
                color: "var(--color-text-muted)",
                textDecoration: "none",
                lineHeight: 1.5,
              }}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
