// firebase/comments.ts
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  runTransaction,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./main";

export interface CommentType {
  id: string;
  text: string;
  userName: string;
  createdAt: Timestamp;
  likeCount: number;
  likes: string[];   // usernames who liked this comment
}

// Add a comment to the subcollection "comments" under a post
export const addComment = async (
  postId: string,
  text: string,
  userName: string
) => {
  const commentsRef = collection(db, "posts", postId, "comments");
  await addDoc(commentsRef, {
    text,
    userName,
    createdAt: serverTimestamp(),
    likeCount: 0,
    likes: [],
  });
};

// Real-time listener for comments of a post
export const listenToComments = (
  postId: string,
  onComments: (comments: CommentType[]) => void
) => {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentType[];
    onComments(comments);
  });
};

// Toggle like on a comment (transaction for atomicity)
export const toggleCommentLike = async (
  postId: string,
  commentId: string,
  userName: string,
  alreadyLiked: boolean
) => {
  const commentRef = doc(db, "posts", postId, "comments", commentId);

  await runTransaction(db, async (transaction) => {
    const commentSnap = await transaction.get(commentRef);
    if (!commentSnap.exists()) throw new Error("Comment does not exist");

    const currentLikes: string[] = commentSnap.data().likes || [];
    const currentCount: number = commentSnap.data().likeCount || 0;

    if (alreadyLiked) {
      // Unlike
      transaction.update(commentRef, {
        likes: currentLikes.filter((name) => name !== userName),
        likeCount: currentCount - 1,
      });
    } else {
      // Like
      transaction.update(commentRef, {
        likes: [...currentLikes, userName],
        likeCount: currentCount + 1,
      });
    }
  });
};