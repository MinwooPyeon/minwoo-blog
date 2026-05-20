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
      {/* 소개 */}
      <section style={{ padding: "2rem 0 2.5rem", borderBottom: "1px solid var(--color-border)" }}>
        <p style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
          편민우
        </p>
        <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "1.2rem", wordBreak: "keep-all" }}>
          임베디드 시스템, AI, 안드로이드 앱 개발에 관심이 많은 개발자입니다.
          FreeRTOS, YOLOv5, LSTM 등 다양한 프로젝트 기록을 남기고 있습니다.
        </p>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem" }}>
          <a href="https://github.com/MinwooPyeon" target="_blank" rel="noreferrer" style={{ color: "var(--color-text-muted)" }}>
            GitHub
          </a>
          <a href="mailto:jh06041@naver.com" style={{ color: "var(--color-text-muted)" }}>
            이메일
          </a>
          <Link href="/about" style={{ color: "var(--color-text-muted)" }}>
            소개
          </Link>
        </div>
      </section>

      {/* 최근 포스트 */}
      <section style={{ paddingTop: "2rem" }}>
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
