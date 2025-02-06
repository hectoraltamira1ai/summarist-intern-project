import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { User as FirebaseUser } from "firebase/auth";

type PremiumUser = FirebaseUser & {
  subscriptionStatus: "Premium" | "Premium Plus";
};

type RegularUser = FirebaseUser & {
  subscriptionStatus?: "Free" | "Basic";
};

type User = PremiumUser | RegularUser;

export default function usePremiumStatus(user: User | null) {
  const [premiumStatus, setPremiumStatus] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      if (user) {
        await auth.currentUser?.getIdToken(true);
        const decodedToken = await auth.currentUser?.getIdTokenResult();
        const isPremium = decodedToken?.claims.stripeRole === "premium" || user.subscriptionStatus === "Premium" || user.subscriptionStatus === "Premium Plus";
        setPremiumStatus(isPremium);
      }
    };
    checkPremium();
  }, [user]);

  return premiumStatus;
}