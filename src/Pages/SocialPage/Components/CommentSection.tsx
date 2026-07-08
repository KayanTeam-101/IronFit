// components/CommentSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import { listenToComments, addComment, toggleCommentLike,type CommentType } from "../../../firebase/Comments";
import { getAvatarColorClasses } from "./Post";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface CommentSectionProps {
  postId: string;
  currentUserName: string;
  onClose?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserName,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Add a new comment
  const handleAddComment = useCallback(async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !currentUserName) return;
    try {
      await addComment(postId, trimmed, currentUserName);
      const today = new Date().toISOString().split("T")[0];
    const GetCommentDays = localStorage.getItem("CommentDays") || "[]";
    const LikedDays = JSON.parse(GetCommentDays);
    if (!LikedDays.includes(today)) {
      LikedDays.push(today);
      localStorage.setItem("CommentDays", JSON.stringify(LikedDays));
    } else {
      return; // Already liked today, exit early
    }
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  }, [newComment, postId, currentUserName]);

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
        // Revert on error (re-fetch from server)
        console.error("Failed to toggle like:", err);
        // Optionally refetch comments or revert state
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
    <div className="w-full bg-white dark:bg-gray-800/20 max-h-40  border-t border-gray-200 dark:border-gray-700/50 overflow-y-scroll mb-12">
      {/* Comment list */}
      <div className="max-h-64 overflow-y-scroll px-4 py-2 space-y-3 ">
        {loading && (
          <p className="text-center text-gray-400 text-sm">Loading comments...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-center text-gray-400 text-sm p-2">أضف أول تعليق </p>
        )}
        {comments.map((comment) => {
          const commentClasses = getAvatarColorClasses(comment.userName);
          const commentInitial = comment.userName?.charAt(0).toUpperCase() || "?";
          const likedByMe = comment.likes.includes(currentUserName);

          return (
            <div key={comment.id} className="flex items-start gap-2 group show-first">
              {/* Avatar */}
              <div
                className={`w-8 h-8 p-2 flex items-center justify-center rounded-full ${commentClasses} flex-shrink-0`}
              >
                <span className="font-bold text-sm">{commentInitial}</span>
              </div>

              {/* Comment bubble */}
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700/60 rounded-2xl px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {comment.createdAt
                        ? new Date(comment.createdAt.seconds * 1000).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "now"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words mt-0.5">
                    {comment.text}
                  </p>
                </div>

                {/* Like button below the comment (Facebook style) */}
                <div className="flex items-center mt-1 ml-1">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-500 transition-colors"
                  >
                    {likedByMe ? (
                      <BsHeartFill className="text-rose-500 text-[0.8rem]" />
                    ) : (
                      <BsHeart className="text-[0.8rem]" />
                    )}
                    <span>{comment.likeCount > 0 ? comment.likeCount : "Like"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add comment input */}
      <div className="fixed bottom-0 w-full flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white dark:bg-gray-700/50 dark:border-gray-700/50">
        <div
          className={`w-8 h-8 p-2 flex items-center justify-center rounded-full ${userClasses} flex-shrink-0`}
        >
          <span className="font-bold text-sm">{userInitial}</span>
        </div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أضف تعليقاً..."
          className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-full px-4 py-2 text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default CommentSection;