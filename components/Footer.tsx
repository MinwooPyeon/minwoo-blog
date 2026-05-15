import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #e5e5e5",
      padding: "2rem 1.25rem",
      maxWidth: 680,
      margin: "0 auto",
      fontSize: "0.875rem",
      color: "#555",
    }}>
      <p style={{ fontWeight: 700, color: "#111", marginBottom: "0.5rem" }}>편민우 기술 블로그</p>
      <p style={{ marginBottom: "0.75rem" }}>임베디드 · AI · 안드로이드 개발 기록</p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a href="mailto:jh06041@naver.com">이메일</a>
        <a href="https://github.com/MinwooPyeon" target="_blank" rel="noreferrer">GitHub</a>
        <Link href="/about">소개</Link>
      </div>
    </footer>
  );
}
