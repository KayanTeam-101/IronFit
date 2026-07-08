import React, { useRef, useEffect } from "react";
import Post from "./Post";
import { usePostsPagination } from "../../../firebase/LoadMore"; // تأكد من المسار
import Loading from "../../../Components/layouts/Loading";

const PostsContainer = () => {
  const { posts, loading, allLoaded, loadMore } = usePostsPagination();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // تحميل الشاشة الأولية (عندما لا توجد منشورات والتحميل نشط)
  const initialLoad = loading && posts.length === 0;

  // مراقب التقاطع لتحميل المزيد عند نهاية القائمة
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !allLoaded) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, allLoaded, loadMore]);

  if (initialLoad) {
    return (
      <div className="w-screen h-screen flex items-center justify-center ">
          <div className="relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-50 blur-3xl animate-pulse" />
        <div className="absolute top-10 left-5 w-48 h-48 bg-indigo-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-5 w-56 h-56 bg-teal-400 rounded-full blur-3xl animate-pulse" />
      </div>
<div className="w-1/4">
          <Loading />
</div>
      </div>
    );
  }

  // (يمكن إضافة معالجة خطأ هنا إذا أضفت error في الهوك)

  return (
    <>
      {/* الخلفية الزخرفية */}
      <div className="relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400 rounded-full opacity-50 blur-3xl animate-pulse" />
        <div className="absolute top-10 left-5 w-48 h-48 bg-indigo-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-5 w-56 h-56 bg-teal-400 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* قائمة المنشورات */}
      <div className="flex flex-col mb-16">
        {posts.map((post) => (
        <>
          <Post
            key={post.id}
            id={post.id}
            text={post.text}
            UserName={post.UserName || "Unknown"}
            image={post.image || undefined}
            amountOfLikes={post.likes}
            Comments={post.comments || []}
          />
        </>
        ))}
        {/* عنصر استشعار نهاية القائمة */}
        <div ref={sentinelRef} className="-z-40" style={{ height: 20 }} />
        
        {loading && !initialLoad && (
          <p className="text-center p-4 text-gray-500 animate-pulse">جاري تحميل المزيد...</p>
        )}
        
        {allLoaded && (
          <p className="text-center p-4 text-gray-400 dark:text-white">لا توجد منشورات أخرى</p>
        )}
      </div>
    </>
  );
};

export default PostsContainer;