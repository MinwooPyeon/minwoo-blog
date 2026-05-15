import Link from "next/link";
import type { PostMeta } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.slug} style={{ marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.2rem" }}>
            {formatDate(post.date)}
            {post.categories.length > 0 && (
              <span style={{ marginLeft: "0.5rem" }}>· {post.categories.join(" / ")}</span>
            )}
          </div>
          <Link href={`/posts/${post.slug}`} style={{ fontSize: "1rem", fontWeight: 600 }}>
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
