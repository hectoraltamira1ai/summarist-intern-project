import Search from "@/components/Search";
import Sidebar from "@/components/SideBar";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { AiOutlineStar } from "react-icons/ai";
import { BiMicrophone } from "react-icons/bi";
import { BsBook, BsBookmark } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { HiOutlineLightBulb, HiOutlineMicrophone } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import SignInModal from "@/components/modals/SignInModal";
import usePremiumStatus from "@/stripe/usePremiumStatus";
import axios from "axios";
import Image from "next/image"; // Add this import

export async function getServerSideProps(context) {
  const bookRes = await axios.get(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${context.query.id}`
  );
  const bookData = bookRes.data;
  return { props: { bookData } };
}

export default function BookPage({ bookData }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalsNeedToOpen, setModalNeedsToOpen] = useState(false);
  const audioRef = useRef();
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState();
  const user = useSelector((state) => state.user);
  const premiumStatus = usePremiumStatus(user);

  function handlePlayer(bookSubscription) {
    if (!user.email) {
      dispatch(SignInModal());
      setModalNeedsToOpen(true);
    } else if (bookSubscription && !premiumStatus) {
      router.push("/plan");
    } else {
      router.push(`/player/${bookData.id}`);
    }
  }

  const onLoadedMetadata = useCallback(() => {
    if (!loading) {
      setDuration(audioRef.current?.duration);
    }
  }, [loading]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("loadedmetadata", onLoadedMetadata);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("loadedmetadata", onLoadedMetadata);
      }
    };
  }, [onLoadedMetadata]);

  useEffect(() => {
    setDuration(audioRef.current?.duration);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  return (
    <div className="w-full">
      <Sidebar />
      <Search />
      <div className="md:ml-[200px] md:w-[calc(100%-200px)]">
        <div className="max-w-[1070px] w-full mx-auto px-[24px]">
          <div className="w-full py-[40px]">
            <div className="flex gap-[16px] flex-col-reverse lg:flex-row">
              {loading ? (
                <>
                  <div className="w-full">
                    <div className="w-[70%] h-[32px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[40%] h-[32px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[100%] h-[32px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[45%] h-[64px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[50%] h-[32px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[20%] h-[32px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[50%] h-[64px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[80%] h-[180px] bg-[#e4e4e4] mb-[16px]"></div>
                    <div className="w-[80%] h-[268px] bg-[#e4e4e4] mb-[16px]"></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full">
                    <div className="text-[24px] text-[#032b41] mb-[16px] font-bold lg:text-[32px]">
                      {bookData?.title}
                    </div>
                    <div className="text-[14px] lg:text-[16px] text-[#032b41] font-bold mb-[16px]">
                      {bookData?.author}
                    </div>
                    <div className="text-[18px] font-light text-[#032b41] lg:text-[20px] mb-[16px]">
                      {bookData?.subTitle}
                    </div>
                    <div className="border-solid border-y p-[16px] mb-[24px]">
                      <div className="flex flex-wrap max-w-[400px] gap-y-[12px]">
                        <div className="flex items-center w-[50%] text-[#032b41] text-[14px] font-semibold">
                          <AiOutlineStar className="w-[24px] h-[24px] mr-[4px]" />
                          <div className="mr-[4px]">
                            {bookData.averageRating}
                          </div>
                          ({bookData.totalRating} ratings)
                        </div>
                        <div className="flex items-center w-[50%] text-[#032b41] text-[14px] font-semibold">
                          <FiClock className="w-[24px] h-[24px] mr-[4px]" />
                          <audio src={bookData.audioLink} ref={audioRef} />
                          <div className="mr-[4px]">{formatTime(duration)}</div>
                        </div>
                        <div className="flex items-center w-[50%] text-[#032b41] text-[14px] font-semibold">
                          <HiOutlineMicrophone className="w-[24px] h-[24px] mr-[4px]" />
                          <div className="mr-[4px]">{bookData.type}</div>
                        </div>
                        <div className="flex items-center w-[50%] text-[#032b41] text-[14px] font-semibold">
                          <HiOutlineLightBulb className="w-[24px] h-[24px] mr-[4px]" />
                          <div className="mr-[4px]">
                            {bookData.keyIdeas} Key ideas
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-[16px] mb-[24px] text-white">
                      {modalsNeedToOpen ? <SignInModal /> : <></>}
                      <button
                        onClick={() =>
                          handlePlayer(bookData.subscriptionRequired)
                        }
                        className="flex items-center justify-center w-[144px] h-[48px] bg-[#032b41] rounded-[4px] cursor-pointer gap-[8px] hover:opacity-70"
                      >
                        <BsBook className="w-[24px] h-[24px]" />
                        <div className="text-[16px]">Read</div>
                      </button>
                      <button
                        onClick={() =>
                          handlePlayer(bookData.subscriptionRequired)
                        }
                        className="flex items-center justify-center w-[144px] h-[48px] bg-[#032b41] rounded-[4px] cursor-pointer gap-[8px] hover:opacity-70"
                      >
                        <BiMicrophone className="w-[24px] h-[24px]" />
                        <div className="text-[16px]">Listen</div>
                      </button>
                    </div>
                    <div className="flex items-center gap-[8px] text-[#0365f2] cursor-not-allowed mb-[40px] text-[18px] hover:text-[#044298] font-semibold ">
                      <BsBookmark className="w-[20px] h-[20px]" />
                      <div>Add title to My Library</div>
                    </div>
                    <div className="text-[18px] mb-[16px] text-[#032b42] font-semibold">
                      What&apos;s it about?
                    </div>
                    <div className="flex flex-wrap gap-[16px] mb-[16px]">
                      <div className="bg-[#f1f6f4] text-[14px] lg:text-[16px] px-[16px] h-[48px] flex items-center cursor-not-allowed text-[#032b41] font-semibold rounded-[4px]">
                        {bookData?.tags[0]}
                      </div>
                      <div className="bg-[#f1f6f4] text-[14px] lg:text-[16px] px-[16px] h-[48px] flex items-center cursor-not-allowed text-[#032b41] font-semibold rounded-[4px]">
                        {bookData?.tags[1]}
                      </div>
                    </div>
                    <div className="text-[#023b41] text-[14px] md:text-[16px] mb-[16px] leading-normal">
                      {bookData?.bookDescription}
                    </div>
                    <div className="text-[18px] mb-[16px] text-[#032b42] font-semibold">
                      About the author
                    </div>
                    <div className="text-[#023b41] text-[14px] md:text-[16px] mb-[16px] leading-normal">
                      {bookData?.authorDescription}
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-center ">
                {loading ? (
                  <>
                    <div className="w-full">
                      <div className="bg-[#e4e4e4] w-[300px] h-[300px]"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <figure className="h-[300px] w-[300px] min-w-[300px]">
                      <Image src={bookData?.imageLink} alt="bookData" width={300} height={300} /> {/* Use next/image */}
                    </figure>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}