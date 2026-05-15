import { getAllPosts } from "@/lib/posts";
import PostList from "@/components/PostList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "포스트" };

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        포스트 <span style={{ fontWeight: 400, color: "#666", fontSize: "0.9rem" }}>({posts.length})</span>
      </h1>
      <PostList posts={posts} />
    </div>
  );
}
