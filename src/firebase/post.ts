import { 
  addDoc, collection, getDocs, query, orderBy, serverTimestamp, 
  Timestamp, updateDoc, increment, doc, limit, startAfter 
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




export const sendPost = async (text: string, UserName?: string,image?: string) => {
  if (!text || !text.trim()) throw new Error("Post text cannot be empty.");
  if (text.length > 1200) throw new Error("Post is too long."); // example

  const docRef = await addDoc(collection(db, "posts"), {
    text: text.trim(),
    createdAt: serverTimestamp(),
    UserName: UserName ?? null,
    image: image ?? null,
    comments: [],
    likes : 0
  });
  console.log("Post saved with ID:", docRef.id);
  return docRef.id; // optionally return the new ID
};
 

export const getPosts = async (
  limitCount: number = 5,
  startAfterDoc: any = null
): Promise<{ posts: PostType[]; lastVisible: any }> => {
  const constraints: any[] = [
    orderBy("createdAt", "desc"),
    orderBy("__name__", "desc"),
    limit(limitCount),
  ];

  if (startAfterDoc) {
    constraints.splice(2, 0, startAfter(startAfterDoc.data().createdAt, startAfterDoc.id));
  }

  const postsQuery = query(collection(db, "posts"), ...constraints);
  const snap = await getDocs(postsQuery);

  const posts = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as PostType));

  const lastVisible = snap.docs[snap.docs.length - 1] || null;

  return { posts, lastVisible };
};

export const likeThePost = async (id: string): Promise<void> => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, { likes: increment(1) });
};