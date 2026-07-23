import { addDoc, collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { db } from "./main"

export interface StoryType {
    id:string;
    UserName:string;
    CreateAt: string;
    imageUrl:string;
    text:string;
    liked:Array<string>;
    userId:string

} 

export const  sendStory = async (id:string,UserName: string,text:string,image:string) =>{
    const docRef = await addDoc(collection(db,"Stories"),{
        UserName:UserName,
        imageUrl:image,
        userId:id,
        text:text,
        liked:[],
        CreateAt:new Date().toISOString()
    })
}

export const getStories = async (
  limitCount: number = 5,
  startAfterDoc: any = null
) => {
  const constraints: any[] = [
    orderBy("CreateAt", "desc"),
    limit(limitCount),
  ];

  if (startAfterDoc) {
    constraints.splice(
      1,
      0,
      startAfter(startAfterDoc)
    );
  }

  const StoriesQuery = query(
    collection(db, "Stories"),
    ...constraints
  );

  const snap = await getDocs(StoriesQuery);

  const Stories = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }) as StoryType);

  const lastVisible =
    snap.docs[snap.docs.length - 1] || null;

  return {
    Stories,
    lastVisible,
  };
};