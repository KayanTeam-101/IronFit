// components/CommentSection.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  listenToComments,
  addComment,
  toggleCommentLike,
  type CommentType,
} from "../../../firebase/Comments";
import { getAvatarColorClasses } from "./Post";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";

interface CommentSectionProps {
  postId: string;
  currentUserName: string;
  onClose?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserName,
  onClose,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const userClasses = getAvatarColorClasses(currentUserName);
  const userInitial = currentUserName?.charAt(0).toUpperCase() || "?";

  // Subscribe to real-time comments
  useEffect(() => {
    const unsubscribe = listenToComments(postId, (freshComments) => {
      setComments(freshComments);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [postId]);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments]);

  // Check daily comment limit (once per day for XP, but still allow unlimited comments? We'll allow only one comment per day to prevent spam)
  const canCommentToday = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const GetCommentDays = localStorage.getItem("CommentDays") || "[]";
    const CommentDays = JSON.parse(GetCommentDays);
    return !CommentDays.includes(today);
  }, []);

  // Add a new comment
  const handleAddComment = useCallback(async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !currentUserName) return;

    // Check daily limit
    if (!canCommentToday()) {
      setDailyLimitReached(true);
      setTimeout(() => setDailyLimitReached(false), 2000);
      return;
    }

    try {
      await addComment(postId, trimmed, currentUserName);

      // Record today for XP
      const today = new Date().toISOString().split("T")[0];
      const GetCommentDays = localStorage.getItem("CommentDays") || "[]";
      const CommentDays = JSON.parse(GetCommentDays);
      if (!CommentDays.includes(today)) {
        CommentDays.push(today);
        localStorage.setItem("CommentDays", JSON.stringify(CommentDays));
      }

      setNewComment("");
      // Scroll to bottom after adding
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  }, [newComment, postId, currentUserName, canCommentToday]);

  // Like / unlike a comment with optimistic UI
  const handleLikeComment = useCallback(
    async (commentId: string) => {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment || !currentUserName) return;

      const alreadyLiked = comment.likes.includes(currentUserName);

      // Optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likes: alreadyLiked
                  ? c.likes.filter((name) => name !== currentUserName)
                  : [...c.likes, currentUserName],
                likeCount: alreadyLiked ? c.likeCount - 1 : c.likeCount + 1,
              }
            : c
        )
      );

      try {
        await toggleCommentLike(postId, commentId, currentUserName, alreadyLiked);
      } catch (err) {
        console.error("Failed to toggle like:", err);
        // Revert on error (refetch would be better, but for simplicity we keep optimistic)
      }
    },
    [comments, currentUserName, postId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="w-full overflow-hidden transition-all">
      {/* Header with close button */}
      {onClose && (
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
            التعليقات
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FaTimes className="text-gray-500 dark:text-gray-300" size={14} />
          </button>
        </div>
      )}

      {/* Comment list */}
      <div
        ref={listRef}
        className="max-h-64 overflow-y-auto px-4 py-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && comments.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">
            لا توجد تعليقات بعد، كن أول من يعلق!
          </p>
        )}

        {comments.map((comment) => {
          const commentClasses = getAvatarColorClasses(comment.userName);
          const commentInitial = comment.userName?.charAt(0).toUpperCase() || "?";
          const likedByMe = comment.likes.includes(currentUserName);

          return (
            <div
              key={comment.id}
              className="flex items-start gap-2 group animate-fade-in-up"
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 p-2 flex items-center justify-center rounded-full ${commentClasses} flex-shrink-0 shadow-sm`}
              >
                <span className="font-bold text-xs">{commentInitial}</span>
              </div>

              {/* Comment bubble */}
              <div className="flex-1">
                <div className="bg-gray-100/80 dark:bg-gray-700/60 rounded-2xl px-3 py-2 backdrop-blur-sm border border-white/20 dark:border-gray-600/30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {comment.userName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {comment.createdAt
                        ? new Date(comment.createdAt.seconds * 1000).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "الآن"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words mt-0.5">
                    {comment.text}
                  </p>
                </div>

                {/* Like button below the comment */}
                <div className="flex items-center mt-1 ml-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-500 transition-all active:scale-110"
                  >
                    {likedByMe ? (
                      <BsHeartFill className="text-rose-500 text-[0.8rem] animate-heart-pop" />
                    ) : (
                      <BsHeart className="text-[0.8rem]" />
                    )}
                    <span>{comment.likeCount > 0 ? comment.likeCount : ""}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily limit warning */}
      {dailyLimitReached && (
        <div className="px-4 pb-2">
          <p className="text-amber-600 dark:text-amber-400 text-xs text-center">
            يمكنك إضافة تعليق واحد فقط في اليوم للحصول على XP
          </p>
        </div>
      )}

      {/* Add comment input (sticky) */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-white/50 dark:border-gray-700/50">
        <div
          className={`w-8 h-8 p-2 flex items-center justify-center rounded-full ${userClasses} flex-shrink-0 shadow-sm`}
        >
          <span className="font-bold text-xs">{userInitial}</span>
        </div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أضف تعليقاً..."
          className="flex-1 bg-gray-100/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400 border border-gray-200/50 dark:border-gray-600/30 focus:ring-2 focus:ring-amber-400 transition"
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="p-2 rounded-full bg-amber-400 hover:bg-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 5.657a.75.75 0 00.767.554h7.11a.75.75 0 010 1.5h-7.11a.75.75 0 00-.767.554l-1.414 5.657a.75.75 0 00.826.95 20.712 20.712 0 0016.764-8.571.75.75 0 000-1.08A20.712 20.712 0 003.105 2.289z" />
          </svg>
        </button>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes heartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-heart-pop {
          animation: heartPop 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CommentSection;