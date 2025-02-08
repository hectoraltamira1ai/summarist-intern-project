import Sidebar from "@/components/SideBar";
import Search from "@/components/Search";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { openSignInModal } from "@/redux/modalReducer";
import SignInModal from "@/components/modals/SignInModal";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Settings() {
  const user = useSelector((state) => state.user);
  const [modalsNeedToOpen, setModalNeedsToOpen] = useState(false);
  const dispatch = useDispatch();
  const subscriptionStatus = useSelector(
    (state) => state.user.subscriptionStatus
  );
  const router = useRouter();

  useEffect(() => {
    // Check if the user has been redirected after an upgrade
    if (router.query.upgradeSuccess) {
      // Handle any post-upgrade logic here
    }
  }, [router.query]);

  function handleLogIn() {
    dispatch(openSignInModal());
    setModalNeedsToOpen(true);
  }

  return (
    <>
      <div className="w-full ">
        <Sidebar />
        <Search />
        <div className="md:ml-[200px] md:w-[calc(100%-200px)]">
          <div className="w-full py-[40px]">
            <div className="max-w-[1070px] w-full mx-auto px-[24px]">
              <div className="text-left border-b-[1px] border-solid border-[#e1e7ea] pb-[16px] text-[32px] text-[#032b41] mb-[32px] font-bold">
                Settings
              </div>
              {modalsNeedToOpen ? <SignInModal /> : <></>}
              {user.email ? (
                <>
                  <div className="flex flex-col items-start gap-[8px] mb-[32px] border-b-[2px] border-solid border-[#e1e7ea] pb-[24px]">
                    <div className="text-[18px] font-bold text-[#032b41]">
                      Your Subscription Plan:
                    </div>
                    <div className="text-[#032b41]">{subscriptionStatus}</div>
                    {user.subscriptionStatus === "Basic" ? (
                      <>
                        <Link href={"/plan"}>
                          <button className="bg-[#2bd97c] text-[#032b41] h-[40px] rounded-[4px] text-[16px] flex items-center justify-center min-w-[180px]  hover:opacity-70">
                            Upgrade to Premium
                          </button>
                        </Link>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-[8px]">
                    <div className="text-[18px] font-bold text-[#032b41]">
                      Email
                    </div>
                    <div className="text-[#032b41]">{user.email}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="max-w-[460px] flex flex-col items-center mx-auto">
                    <Image src="/assets/login.png" alt="login logo" width={460} height={320} />
                    <div className="text-[24px] text-[#032b41] font-bold mb-[16px] text-center">
                      Log in to your account to see your details.
                    </div>
                    <button
                      className="bg-[#2bd97c] text-[#032b41] h-[40px] rounded-[4px] text-[16px] flex items-center justify-center min-w-[180px] hover:opacity-70"
                      onClick={handleLogIn}
                    >
                      Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
