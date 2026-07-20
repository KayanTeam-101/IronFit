import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  increment,
  doc,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./main.ts";

export interface PostType {
  id: string;
  text: string;
  createdAt: Timestamp;
  UserName?: string;
  image?: string;
  comments: any[];
  likes: number;
}

// ─── Send a new post ─────────────────────────────────────────────
export const sendPost = async (
  text: string,
  UserName?: string,
  image?: string
) => {
  if (!text || !text.trim()) throw new Error("Post text cannot be empty.");
  if (text.length > 1200) throw new Error("Post is too long.");

  const docRef = await addDoc(collection(db, "posts"), {
    text: text.trim(),
    createdAt: serverTimestamp(),
    UserName: UserName ?? null,
    image: image ?? null,
    comments: [],
    likes: 0,
  });
  console.log("Post saved with ID:", docRef.id);
  return docRef.id;
};

// ─── Get posts with pagination ──────────────────────────────────
export const getPosts = async (
  limitCount: number = 3,
  startAfterDoc: DocumentSnapshot | null = null
): Promise<{ posts: PostType[]; lastVisible: DocumentSnapshot | null }> => {
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    // orderBy("__name__", "desc"),    // 👈 document ID as tie‑breaker
    limit(limitCount),
  ];

  // If we have a cursor, insert startAfter before limit
  if (startAfterDoc) {
    constraints.splice(2, 0, startAfter(startAfterDoc));
  }

  const postsQuery = query(collection(db, "posts"), ...constraints);
  const snap = await getDocs(postsQuery);

  const posts = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as PostType));

  const lastVisible = snap.docs[snap.docs.length - 1] || null;
  return { posts, lastVisible };
};

// ─── Like a post ──────────────────────────────────────────────────
export const likeThePost = async (id: string): Promise<void> => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, { likes: increment(1) });
};