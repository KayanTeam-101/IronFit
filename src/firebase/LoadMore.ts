  import { useState, useEffect, useCallback } from "react";
  import { getPosts, type PostType } from "./post"; // adjust the import path
  import { DocumentSnapshot } from "firebase/firestore";

  const POSTS_PER_PAGE = 5;

  export const usePostsPagination = () => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

    // ── Initial load ───────────────────────────────────────────────
    useEffect(() => {
      const fetchInitial = async () => {
        setLoading(true);
        try {
          const { posts: initialPosts, lastVisible } = await getPosts(POSTS_PER_PAGE);
          setPosts(initialPosts);
          setLastDoc(lastVisible);
          if (initialPosts.length < POSTS_PER_PAGE) setAllLoaded(true);
        } catch (err) {
          console.error("Error loading posts:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchInitial();
    }, []);

    // ── Load more ──────────────────────────────────────────────────
    const loadMore = useCallback(async () => {
      if (loading || allLoaded || !lastDoc) return;

      setLoading(true);
      try {
        const { posts: newPosts, lastVisible } = await getPosts(POSTS_PER_PAGE, lastDoc);
        console.log(`📥 Received ${newPosts.length} posts. lastVisible id: ${lastVisible?.id}`);

        setPosts((prev) => [...prev, ...newPosts]);
        setLastDoc(lastVisible);
        if (newPosts.length < POSTS_PER_PAGE) setAllLoaded(true);
      } catch (err) {
        console.error("Error loading more posts:", err);
      } finally {
        setLoading(false);
      }
    }, [loading, allLoaded, lastDoc]);

    return { posts, loading, allLoaded, loadMore };
  };