import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./main.ts";

export interface UserType {
  id: string,
  // Customize these fields to match your user documents
  UserName: string,
  email: string,
  photoURL?: string,
  createdAt: number,
  Unique?: string,
  UserId_:number,
  SubscriptionPeriod: number,
  mycodeUsed:boolean // or Timestamp
}

export const getUsers = async (): Promise<UserType[]> => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("CreatedAt", "desc"),
    );
    const snap = await getDocs(usersQuery);
    return snap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as UserType,
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const SetUser = async (
  UserName: string,
  email: string,
  photoURL: string,
  UserId_:number
) => {
  const docRef = await addDoc(collection(db, "users"), {
    CreatedAt:serverTimestamp(),
    UserName: UserName, // keep the original casing
    UserNameLower: UserName.toLowerCase(),
    email: email,
    photoURL: photoURL,
    SubscriptionPeriod: 0,
    UserId_:UserId_,
    mycodeUsed:false
  });
  console.log("Post saved with ID:", docRef.id);
  return docRef.id; // optionally return the new ID
};

export const updateUserSubscription = async (
  userId: string,
  subscriptionPeriod: number,
  mycodeUsed: boolean
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      SubscriptionPeriod: subscriptionPeriod,
      mycodeUsed: mycodeUsed,
      updatedAt: serverTimestamp(),   // optional: track when it was changed
    });
    console.log(`User ${userId} updated successfully.`);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;   // or handle as you prefer
  }
};