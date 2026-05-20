import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

type ExpType = "인턴" | "교육" | "활동" | "수상";

const TYPE_COLOR: Record<ExpType, { bg: string; text: string }> = {
  인턴: { bg: "#dbeafe", text: "#1d4ed8" },
  교육: { bg: "#dcfce7", text: "#15803d" },
  활동: { bg: "#fef9c3", text: "#a16207" },
  수상: { bg: "#fce7f3", text: "#be185d" },
};

const EXPERIENCES: { type: ExpType; name: string; period: string; detail?: string }[] = [
  { type: "인턴", name: "한국수자원공사", period: "2026.04 ~", detail: "정보통신 직무" },
  { type: "교육", name: "삼성 청년 SW AI 아카데미 (SSAFY)", period: "2025.01 ~ 2025.12", detail: "1,600시간 SW·AI 개발" },
  { type: "활동", name: "Google Developer Groups on Campus", period: "2024.01 ~ 2025.07" },
  { type: "활동", name: "Big Data Association (BDA)", period: "2023.09 ~ 2024.09", detail: "데이터 분석 파트" },
  { type: "교육", name: "Google Coursera 데이터 애널리틱스", period: "2024.01 ~ 2024.03", detail: "240시간" },
  { type: "교육", name: "Google Coursera IT 인프라", period: "2024.01 ~ 2024.02", detail: "120시간" },
  { type: "수상", name: "SSAFY 기업연계 우수상", period: "2025.11", detail: "8팀 중 2위" },
];

export default function Home() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <div>
      {/* 최근 포스트 */}
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

      {/* 경험 */}
      <section style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-subtle)", marginBottom: "0.75rem" }}>
          경험
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {EXPERIENCES.map((exp, i) => {
            const color = TYPE_COLOR[exp.type];
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: color.bg,
                  color: color.text,
                  flexShrink: 0,
                }}>
                  {exp.type}
                </span>
                <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--color-text)", wordBreak: "keep-all" }}>
                  {exp.name}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>
                  {exp.period}
                </span>
                {exp.detail && (
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {exp.detail}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
