import { Modal } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { BsFillPersonFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { openSignInModal } from "@/redux/modalReducer";
import SignUpModal from "./SignUpModal";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { setUser } from "@/redux/userReducer";
import { Ring } from "@uiball/loaders";
import { useRouter } from "next/router";

export default function SignInModal() {
  const isOpen = useSelector((state) => state.modals.SignInModalOpen);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [setValue] = useState("");
  const [error, setError] = useState("");
  const [guestAuth, setGuestAuth] = useState(false);
   

  async function handleSignIn() {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setError("");
      dispatch(openSignInModal());
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  function handleCloseModal() {
    setLoading(false);
    if (error) {
      setError("");
    }
    setEmail("");
    setPassword("");
    dispatch(openSignInModal());
  }

  async function handleGuestSignIn() {
    setGuestAuth(true);
    await signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
    setGuestAuth(false);
    dispatch(openSignInModal());
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setValue(localStorage.getItem("email"));
      if (router.pathname === "/") {
        if (currentUser) {
          router.push("/for-you");
        }
      }
      if (!currentUser) return;
      dispatch(
        setUser({
          email: currentUser?.email,
        })
      );
    });
    return unsubscribe;
  }, [dispatch, router, setValue]);

  return (
    <>
      <Modal
        className="flex justify-center items-center outline-none "
        open={isOpen}
        onClose={handleCloseModal}
      >
        <div className="bg-white w-[400px]  rounded-lg flex flex-col justify-center relative p-5">
          <RxCross2
            onClick={handleCloseModal}
            className="w-[30px] h-[30px] absolute top-[16px] right-[16px] cursor-pointer hover:opacity-50"
          />
          <div className="text-center text-[20px] font-bold m-[24px] text-[#032b41]">
            Log In to Summarist
          </div>
          {error && (
            <div
              style={{
                color: "#f56c6c",
                marginBottom: "16px",
                textAlign: "start",
              }}
            >
              {error}
            </div>
          )}
          <button
            onClick={handleGuestSignIn}
            className="flex items-center  bg-[#3a579d] w-full h-[40px] min-w-[180px] rounded-[4px] hover:opacity-70 "
          >
            <figure className="pl-[4px] flex">
              <BsFillPersonFill className="w-[40px] h-[40px] py-[4px]  fill-white" />
            </figure>
            {guestAuth ? (
              <div className="flex items-center  bg-[#3a579d] w-full h-[40px] min-w-[180px] rounded-[4px] hover:opacity-70">
                <Ring size={20} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              <div className="text-white">Login as a Guest</div>
            )}
          </button>

          <div className="m-[16px] flex">
            <span className="flex">or</span>
          </div>
          <form className="w-full">
            <input
              className="w-full h-[40px] rounded-md bg-transparent border-[2px] border-[#bac8ce] p-4 focus:outline-none focus:border-[#2bd97c]"
              type={"email"}
              placeholder="Email Address  guest@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              className="w-full h-[40px] rounded-md bg-transparent border-[2px] border-[#bac8ce] p-4 focus:outline-none focus:border-[#2bd97c] mt-5"
              type={"password"}
              placeholder="Password   guest123"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {loading ? (
              <div className="flex items-center w-full h-[40px] min-w-[180px] rounded-[4px] hover:opacity-70">
                <Ring size={20} lineWeight={5} speed={2} color="white" />
              </div>
            ) : (
              <div
                onClick={handleSignIn}
                style={{ cursor: "pointer" }}
                className="btn input__btn mt-5 mb-5"
              >
                Login
              </div>
            )}
            <SignUpModal />
          </form>
        </div>
      </Modal>
    </>
  );
}
