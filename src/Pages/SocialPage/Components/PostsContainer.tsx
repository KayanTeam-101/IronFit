import React, { useEffect, useState } from "react";
import Post from "./Post"; // Your styled Post component
import { getPosts } from "../../../firebase/post";

const PostsContainer = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Could not load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Full‑screen loading state (while fetching)
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 animate-pulse">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Background decorative blobs – fixed invalid top values */}
      <div className="relative top-70">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-400 rounded-full opacity-50 blur-3xl animate-pulse" />
        <div className="absolute top-10 left-5 w-48 h-48 bg-indigo-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-5 w-56 h-56 bg-teal-400 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Posts list */}
      <div className="flex flex-col mb-16 ">
        {posts.map((post) => (
          <Post
            key={post.id}
            text={post.text}
            author={post.authorId || "Unknown"} // adjust if you later join with a user name
            image={post.image || undefined}
          />
        ))}
      </div>
    </>
  );
};

export default PostsContainer;