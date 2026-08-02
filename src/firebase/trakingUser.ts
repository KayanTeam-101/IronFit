import { doc, setDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "./main";

export const incrementOnboardingStep = async ( step: number) => {
  const userRef = doc(db, "userProgress", "d399a254-37f9-4eb8-8aa1-14d8310679b2");
  const fieldName = `page_${step}`;

  try {
    // أنشئ المستند إن لم يكن موجوداً (merge = true)
    await setDoc(userRef, { currentStep: step, lastUpdated: serverTimestamp() }, { merge: true });
    // زِد العداد
    await updateDoc(userRef, {
      [fieldName]: increment(1),
      currentStep: step,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to increment step:", error);
    throw error;
  }
};