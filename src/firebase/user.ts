import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "./main.ts";

export interface UserType {
  id: string;
  UserName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  Unique?: string;
  UserId_: number;
  SubscriptionPeriod: number;
  mycodeUsed: boolean;
  Xp: number;
}

// --- Existing functions ---

export const getUsers = async (): Promise<UserType[]> => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("Xp", "desc"),
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
  UserId_: number
) => {
  const docRef = await addDoc(collection(db, "users"), {
    CreatedAt: serverTimestamp(),
    UserName: UserName,
    UserNameLower: UserName.toLowerCase(),
    email: email,
    photoURL: photoURL,
    Gender: "",
    SubscriptionPeriod: 0,
    UserId_: UserId_,
    mycodeUsed: false,
    Xp: 0,
    activeDays: 0,
    followers: [],
    follow: [],
    Status: "",
  });
  console.log("Post saved with ID:", docRef.id);
  return docRef.id;
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
      updatedAt: serverTimestamp(),
    });
    console.log(`User ${userId} updated successfully.`);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateXp = async (
  userId: string,
  Xp: number
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      Xp: Xp,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// --- NEW ranking functions ---

/**
 * Returns the rank (1-indexed) of a user based on their XP.
 * @param userId - The Firestore document ID of the user.
 * @returns The rank number, or null if the user is not found.
 */
export const getUserRank = async (userId: string): Promise<number | null> => {
  try {
    // Fetch all users ordered by XP descending
    const usersQuery = query(
      collection(db, "users"),
      orderBy("Xp", "desc"),
    );
    const snap = await getDocs(usersQuery);
    const users = snap.docs.map((doc) => ({
      id: doc.id,
      Xp: doc.data().Xp || 0,
    }));

    const index = users.findIndex((u) => u.id === userId);
    return index === -1 ? null : index + 1; // rank starts at 1
  } catch (error) {
    console.error("Error getting user rank:", error);
    return null;
  }
};

/**
 * Returns the top N users by XP.
 * @param limitCount - Number of users to return (default 10).
 */
export const getTopUsers = async (limitCount: number = 10): Promise<UserType[]> => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("Xp", "desc"),
      limit(limitCount),
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
    console.error("Error fetching top users:", error);
    return [];
  }
};