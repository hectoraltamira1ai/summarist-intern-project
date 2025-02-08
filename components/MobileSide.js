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
import { BiMenu } from "react-icons/bi";
import Image from "next/image"; 

export default function MobileSide() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = useSelector((state) => state.user);
  const [modalsNeedToOpen, setModalNeedsToOpen] = useState(false);
  const dispatch = useDispatch();
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
  }

  function handleLogIn() {
    dispatch(openSignInModal());
    setModalNeedsToOpen(true);
  }
  return (
    <>
      {modalsNeedToOpen ? <SignInModal /> : <></>}
      <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        <BiMenu
          className={`${isOpen ? "hidden" : "inline"} w-[32px] h-[32px]`}
        />
        <div className={`sidebar__overlay ${isOpen ? "inline" : "hidden"}`}>
          {" "}
        </div>
        <div className={`phone__menu ${isOpen ? "phone__menu--active" : " "}`}>
          <div className="flex justify-center">
            <figure className="max-w-[160px] flex justify-center items-center mt-[20px]">
              <Image className="" src="/assets/logo.png" alt="logo" width={160} height={36} />
            </figure>
          </div>
          <div className="mt-[40px]">
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
              <div className="flex items-center h-[56px]  cursor-not-allowed">
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
          <div className="fixed bottom-10">
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
