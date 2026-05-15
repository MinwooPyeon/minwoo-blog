import Link from "next/link";

export default function Header() {
  return (
    <header style={{ padding: "2.5rem 0 1.5rem", marginBottom: "1rem" }}>
      <div style={{ marginBottom: "0.25rem" }}>
        <Link href="/" style={{ color: "#111", fontWeight: 700, fontSize: "1.1rem" }}>
          편민우 기술 블로그
        </Link>
      </div>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
        임베디드 · AI · 안드로이드 개발 기록
      </p>
      <nav style={{ display: "flex", gap: "1rem", fontSize: "0.9rem" }}>
        <Link href="/">홈</Link>
        <Link href="/posts">포스트</Link>
        <Link href="/tags">태그</Link>
        <Link href="/about">소개</Link>
      </nav>
      <hr style={{ marginTop: "1.5rem" }} />
    </header>
  );
}
