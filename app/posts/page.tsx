import { getAllPosts } from "@/lib/posts";
import PostSearch from "@/components/PostSearch";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "포스트" };

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <div>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        포스트
      </h1>
      <PostSearch posts={posts} />
    </div>
  );
}
