import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts().slice(0, 7);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} wide={i === 0} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Link
          href="/posts"
          style={{
            fontSize: "0.9rem",
            color: "#666",
            border: "1px solid #e5e5e5",
            borderRadius: "999px",
            padding: "0.5rem 1.5rem",
          }}
        >
          모든 포스트 보기 →
        </Link>
      </div>
    </div>
  );
}
