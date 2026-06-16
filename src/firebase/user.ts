import { collection, getDocs, query, orderBy ,addDoc,doc ,serverTimestamp} from "firebase/firestore";
import { db } from "./main.ts";

export interface UserType {
  id: string;
  // Customize these fields to match your user documents
  UserName: string;
  email: string;
  photoURL?: string;
  createdAt: number; // or Timestamp
}

export const getUsers = async (): Promise<UserType[]> => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")   // optional ordering
    );
    const snap = await getDocs(usersQuery);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as UserType));
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // or throw the error depending on your error handling
  }
};


export const SetUser = async (UserName :string,email :string,photoURL :string) => {

  const docRef = await addDoc(collection(db, "users"), {
   UserName: UserName,         // keep the original casing
  UserNameLower: UserName.toLowerCase(),
    email: email,
    photoURL : photoURL
});
  console.log("Post saved with ID:", docRef.id);
  return docRef.id; // optionally return the new ID
};
