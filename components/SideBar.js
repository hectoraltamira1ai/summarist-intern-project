import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { usePathname } from "next/navigation";
import { IoBookmarkOutline } from "react-icons/io5";
import { RiBallPenLine } from "react-icons/ri";
import { SlSettings } from "react-icons/sl";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { openSignInModal } from "@/redux/modalReducer";
import Link from "next/link";
import { signOutUser } from "@/redux/userReducer";
import { auth } from "@/firebase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import SignInModal from "@/components/modals/SignInModal";
import { setUser } from "@/redux/userReducer";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const [modalsNeedToOpen, setModalNeedsToOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;
      dispatch(
        setUser({
          email: currentUser.email,
          uid: currentUser.uid,
        })
      );
    });

    return unsubscribe;
  }, [dispatch]);

  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
    router.reload();
  }

  function handleLogIn() {
    dispatch(openSignInModal());
    setModalNeedsToOpen(true);
  }

  return (
    <>
      {modalsNeedToOpen ? <SignInModal /> : <></>}
      <div className="bg-[#f7faf9] w-[200px] h-screen fixed hidden md:inline sidebar">
        <div className="flex justify-center">
          <figure className="max-w-[160px] flex justify-center items-center mt-[20px]">
            <Image className="" src={"/assets/logo.png"} alt="logo" height={36} width={160} priority />
          </figure>
        </div>
        <div className="flex flex-col justify-between pb-[20px] flex-1">
          <div className="mt-[40px] ">
            <Link href={"/for-you"}>
              <div className="flex items-center h-[56px] hover:bg-[#f0efef]">
                <div
                  className={`w-[5px] ${
                    pathname == "/for-you" ? "bg-[#2bd97c]" : ""
                  } h-[56px] mr-[16px]`}
                ></div>
                <AiOutlineHome className="w-[24px] h-[24px] mr-[8px]" />
                <div>For you</div>
              </div>
            </Link>
            <div>
              <div className="flex items-center h-[56px] cursor-not-allowed">
                <div className="w-[5px] h-[56px] mr-[16px]"></div>
                <IoBookmarkOutline className="w-[24px] h-[24px] mr-[8px]" />
                <div>My Library</div>
              </div>
            </div>
            <div className="cursor-not-allowed">
              <div className="flex items-center h-[56px] ">
                <div className="w-[5px] h-[56px] mr-[16px]"></div>
                <RiBallPenLine className="w-[24px] h-[24px] mr-[8px]" />
                <div>Highlights</div>
              </div>
            </div>
            <div className="cursor-not-allowed">
              <div className="flex items-center h-[56px] ">
                <div className="w-[5px] h-[56px] mr-[16px]"></div>
                <AiOutlineSearch className="w-[24px] h-[24px] mr-[8px]" />
                <div>Search</div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-20">
            <Link href={"/settings"}>
              <div className="flex items-center h-[56px] hover:bg-[#f0efef]">
                <div
                  className={`w-[5px] ${
                    pathname == "/settings" ? "bg-[#2bd97c]" : ""
                  } h-[56px] mr-[16px]`}
                ></div>
                <SlSettings className="w-[24px] h-[24px] mr-[8px]" />
                <div>Settings</div>
              </div>
            </Link>
            <div className="cursor-not-allowed">
              <div className="flex items-center h-[56px] ">
                <div className="w-[5px]  h-[56px] mr-[16px]"></div>
                <AiOutlineQuestionCircle className="w-[24px] h-[24px] mr-[8px]" />
                <div>Help & Support</div>
              </div>
            </div>
            {user.email ? (
              <>
                <div
                  className="flex items-center h-[56px] hover:bg-[#f0efef] cursor-pointer"
                  onClick={handleSignOut}
                >
                  <div className="w-[5px]  h-[56px] mr-[16px]"></div>
                  <FiLogOut className="w-[24px] h-[24px] mr-[8px]" />
                  <div>Log Out</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex items-center h-[56px] hover:bg-[#f0efef] cursor-pointer"
                  onClick={handleLogIn}
                >
                  <div className="w-[5px]  h-[56px] mr-[16px]"></div>
                  <FiLogIn className="w-[24px] h-[24px] mr-[8px]" />
                  <div>Login</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
