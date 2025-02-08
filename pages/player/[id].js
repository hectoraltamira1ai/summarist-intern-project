import Search from "@/components/Search";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { GrBackTen, GrForwardTen } from "react-icons/gr";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignInModal from "@/components/modals/SignInModal";
import CircularProgress from "@mui/material/CircularProgress";
import Sidebar from "../../components/SideBar";
import axios from "axios";
import Image from "next/image";

export async function getServerSideProps(context) {
  const bookRes = await axios.get(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${context.query.id}`
  );
  const bookData = bookRes.data;
  return { props: { bookData } };
}

export default function BookPlayer({ bookData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef();
  const progressBarRef = useRef();
  const playAnimationRef = useRef();
  
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [modalsNeedToOpen, setModalNeedsToOpen] = useState(false);
  const [loading] = useState(false);

  const repeat = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime;
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(progressBarRef.current.value / duration) * 100}%`
      );
      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [duration]);

  const onLoadedMetadata = useCallback(() => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  }, []);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      audioRef.current.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  };

  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
  };

  const skipForward = () => {
    setTimeProgress((audioRef.current.currentTime += 10));
  };

  const skipBack = () => {
    setTimeProgress((audioRef.current.currentTime -= 10));
  };

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

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [isPlaying, repeat]);

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

  return (
    <div className="w-full">
      <Sidebar />
      <Search />
      <div className="md:ml-[200px] md:w-[calc(100%-200px)]">
        <div className="w-full overflow-y-hidden h-[calc(100vh-280px)] md:h-[calc(100vh-180px)]">
          {modalsNeedToOpen ? <SignInModal /> : <></>}
          {loading ? (
            <div className="w-full flex justify-center items-center h-full">
              <CircularProgress size="4rem" style={{ color: "#032b41" }} />
            </div>
          ) : (
            <>
              <div className="whitespace-pre-line p-[24px] max-w-[800px] mx-auto">
                <div className="text-[#032b41] text-[20px] md:text-[24px] border-b-[1px] border-[#e1e7ea] border-solid pb-[16px] leading-normal font-semibold mb-[32px]">
                  {bookData?.title}
                </div>
                {user.email !== null ? (
                  <>
                    <div className="text-[14px] md:text-[18px] whitespace-pre-line leading-[1.4] text-[#032b41]">
                      {bookData?.summary}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="max-w-[460px] flex flex-col items-center mx-auto">
                      <Image src={"/assets/login.png"} alt="login" width={460} height={460} priority />
                      <div className="text-[24px] text-[#032b41] font-bold mb-[16px] text-center">
                        Log in to your account to read and listen to the book
                      </div>
                      <button
                        className="bg-[#2bd97c] text-[#032b41] h-[40px] rounded-[4px] text-[16px] flex items-center justify-center min-w-[180px] hover:opacity-70"
                        onClick={() => {
                          dispatch(SignInModal());
                          setModalNeedsToOpen(true);
                        }}
                      >
                        Login
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="h-[180px] py-[16px] px-[24px] w-full md:h-[80px] md:py-0 mt-auto flex-col md:flex-row flex items-center justify-between bg-[#042330] md:px-[40px] fixed bottom-0 left-0">
                <div className="flex justify-center w-full md:w-[calc(100%/3)] gap-[12px]">
                  {loading ? (
                    <div className="w-full flex gap-[12px]">
                      <div className="bg-white h-[48px] w-[48px]"></div>
                      <div className="flex flex-col">
                        <div className="bg-white h-[16px] w-[50px] mb-[12px]"></div>
                        <div className="bg-white h-[16px] w-[100px]"></div>
                      </div>
                    </div>
                  ) : (
                    <figure className="flex items-center max-w-[48px]">
                      <figure className="h-[48px] w-[48px] min-w-[48px]">
                        <Image
                          className="w-full h-full"
                          src={bookData.imageLink}
                          alt="book image"
                          width={48}
                          height={48}
                          priority
                        />
                      </figure>
                    </figure>
                  )}
                </div>
                <div className="w-full md:w-[calc(100%/3)]">
                  <div className="flex items-center justify-center gap-[24px]">
                    <button onClick={skipBack}>
                      <GrBackTen className="fillWhiteSvg w-[28px] h-[28px] stroke-white" />
                    </button>
                    <button
                      className="bg-white w-[40px] rounded-full h-[40px]"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <BsPauseFill className="w-[28px] h-[28px] text-[#042330] ml-[6px]" />
                      ) : (
                        <BsPlayFill className="w-[28px] h-[28px] text-[#042330] ml-[8px]" />
                      )}
                    </button>
                    <button onClick={skipForward}>
                      <GrForwardTen className="fillWhiteSvg w-[28px] h-[28px] stroke-white" />
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-[calc(100%/3)] flex justify-center items-center gap-[16px]">
                  <audio src={bookData?.audioLink} ref={audioRef} />
                  <div className="text-white text-[14px]">
                    {formatTime(timeProgress)}
                  </div>
                  <input
                    type="range"
                    ref={progressBarRef}
                    defaultValue="0"
                    onChange={handleProgressChange}
                  />
                  <div className="text-white text-[14px]">
                    {formatTime(duration)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}