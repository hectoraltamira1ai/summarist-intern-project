import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";

export default async function isUserPremiumPlus() {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User is not authenticated");

    const db = getFirestore();
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.subscriptionStatus === "PremiumPlus";
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
}