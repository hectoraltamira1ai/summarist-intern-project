import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { store } from "../redux/store";
import { setSubscriptionStatus } from "../redux/userReducer";

export async function createCheckoutSession(uid: string, priceId: string) {
  try {
    const firestore = firebase.firestore();

    const checkoutSessionRef = await firestore
      .collection("users")
      .doc(uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    checkoutSessionRef.onSnapshot(async (snap) => {
      const data = snap.data();
      const sessionId: string | undefined = data?.sessionId;
      const stripe = await loadStripe(
          "process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY"
      );
      if (stripe && sessionId) {
        stripe.redirectToCheckout({ sessionId });
      }
    });

    // Listen for changes in the user's subscription status
    const userDocRef = firestore.collection("users").doc(uid);
    userDocRef.onSnapshot((doc) => {
      const userData = doc.data();
      if (userData) {
        store.dispatch(setSubscriptionStatus(userData.subscriptionStatus));
      }
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
}