import React, { useEffect, useRef, useState } from "react";
import Selected from "../components/Selected";
import Recommended from "../components/Recommended";
import Suggested from "../components/Suggested";
import { auth } from "@/firebase";
import usePremiumStatus from "@/stripe/usePremiumStatus";
import { onAuthStateChanged } from "firebase/auth";

export default function ForYouPage() {
  const audioRef = useRef(null);
  const audioDuration = useRef(0);
  const [user, setUser] = useState("");

  const checkUserStatus = usePremiumStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="row">
      <div className="container">
        <div className="for-you__wrapper">
          <Selected />
          <Recommended
            checkUserStatus={checkUserStatus}
            audioRef={audioRef}
            audioDuration={audioDuration}
          />
          <Suggested
            checkUserStatus={checkUserStatus}
            audioRef={audioRef}
            audioDuration={audioDuration}
          />
        </div>
      </div>
    </div>
  );
}
