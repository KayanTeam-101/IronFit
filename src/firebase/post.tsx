import { addDoc, collection, getDocs, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./main.tsx";

export interface PostType {
  id: string;
  text: string;
  createdAt: Timestamp; // or number if you keep Date.now()
  authorId?: string;    // good to add
}

export const sendPost = async (text: string, authorId?: string,image?: string) => {
  if (!text || !text.trim()) throw new Error("Post text cannot be empty.");
  if (text.length > 500) throw new Error("Post is too long."); // example

  const docRef = await addDoc(collection(db, "posts"), {
    text: text.trim(),
    createdAt: serverTimestamp(),
    authorId: authorId ?? null,
    image: image ?? null,
  });
  console.log("Post saved with ID:", docRef.id);
  return docRef.id; // optionally return the new ID
};

export const getPosts = async (): Promise<PostType[]> => {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(postsQuery);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as PostType));
};