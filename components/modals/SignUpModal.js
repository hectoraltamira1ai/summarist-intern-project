import { Modal } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { openSignInModal, openSignUpModal } from "@/redux/modalReducer";
import { createUserWithEmailAndPassword, onAuthStateChanged, } from "firebase/auth";
import { useEffect, useState } from "react";
import { setUser } from "@/redux/userReducer";
import { Ring } from "@uiball/loaders";
import { auth, db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function SignUpModal() {
  const isOpen = useSelector((state) => state.modals.SignUpModalOpen);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = {
        email: email,
      };
      addDoc(collection(db, "users"), user);
      dispatch(openSignInModal());
      dispatch(openSignUpModal());
      setError("");
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  function handleCloseModal() {
    setError("");
    dispatch(openSignUpModal());
    setEmail("");
    setPassword("");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;
      dispatch(
        setUser({
          email: currentUser?.email,
        })
      );
    });
    return unsubscribe;
  });

  return (
    <>
      <div
        onClick={() => dispatch(openSignUpModal())}
        className="flex items-center justify-center w-full bg-[#f1f6f4] h-[40px] text-[#116be9] text-[14px] font-light cursor-pointer"
      >
        Don't have an account?
      </div>
      <Modal
        className="flex justify-center items-center outline-none"
        open={isOpen}
        onClose={handleCloseModal}
      >
        <div
          className="bg-white w-[400px]  rounded-lg flex flex-col justify-center relative p-5"
          style={{ minHeight: "initial" }}
        >
          <RxCross2
            onClick={handleCloseModal}
            className="w-[30px] h-[30px] absolute top-[16px] right-[16px] cursor-pointer hover:opacity-50"
          />
          <div className="text-center text-[20px] font-bold m-[24px] text-[#032b41]">
            Sign Up for Summarist
          </div>
          {error && (
            <div style={{ color: "#f56c6c", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <form className="w-full">
            <input
              className="w-full h-[40px] rounded-md bg-transparent border-[2px] border-[#bac8ce] p-4 focus:outline-none focus:border-[#2bd97c]"
              type={"email"}
              placeholder="guest@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              className="w-full h-[40px] rounded-md bg-transparent border-[2px] border-[#bac8ce] p-4 focus:outline-none focus:border-[#2bd97c] mt-5 mb-5"
              placeholder="guest123"
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {loading ? (
              <div className="btn loader__btn">
                <Ring size={20} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              <div
                onClick={handleSignUp}
                style={{ cursor: "pointer" }}
                className="btn input__btn"
              >
                Sign Up
              </div>
            )}
            <div
              onClick={handleCloseModal}
              className="flex items-center justify-center w-full bg-[#f1f6f4] h-[40px] text-[#116be9] text-[14px] font-light cursor-pointer mt-5"
            >
              Already have an account?
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
