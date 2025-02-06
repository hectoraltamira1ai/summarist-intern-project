"use strict";
import { auth } from "@/firebase";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { store } from "@/redux/store";
import { updateSubscriptionStatus } from "@/redux/userReducer";

export const getCheckoutUrl = async (app, priceId) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: window.location.origin + "/for-you",
    cancel_url: window.location.origin + "/for-you",
  });

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data();
      if (error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${error.message}`));
      }
      if (url) {
        unsubscribe();
        resolve(url);
      }
    });
  });
};

// Listen for changes in the user's subscription status
export const listenForSubscriptionStatus = (app) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const db = getFirestore(app);
  const userDocRef = doc(db, "users", userId);
  onSnapshot(userDocRef, (doc) => {
    const userData = doc.data();
    if (userData) {
      store.dispatch(updateSubscriptionStatus(userData.subscriptionStatus));
    }
  });
};
