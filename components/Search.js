import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import { AiOutlineSearch} from "react-icons/ai";
import { FiClock } from "react-icons/fi";
import MobileSide from "./MobileSide";
import axios from "axios";

export default function SearchBar() {
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);


  const searchEndpoint = (query) =>
    `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`;
  
  const onChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query);
    if (query.length) {
      const timer = setTimeout(() => {
        axios.get(searchEndpoint(query))
          .then((response) => {
            setResults(response.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, []);

  const onFocus = useCallback(() => {
    setActive(true);
    window.addEventListener("click", onclick);
  });

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false);
      setQuery("");
      setResults([]);
      window.removeEventListener("click", onClick);
    }
  });

  const audioRef = useRef();
  const [duration, setDuration] = useState(0);
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

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", onLoadedMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          onLoadedMetadata
        );
      }
    };
  }, []);

  useEffect(() => {
    setDuration(audioRef.current?.duration);
  }, []);


  return (
    <>
      <div className="md:ml-[200px] md:w-[calc(100%-200px)] ">
        <div className=" border-b-[1px] border-solid border-[#e1e7ea] h-[80px] flex items-center">
          <div className="w-full px-[24px] md:px-[32px] flex items-center justify-end  md:justify-between max-w-[1070px] mx-auto relative">
            <figure></figure>
            <div className="flex items-center max-w-[340px] ml-[4px] md:ml-0 w-full">
              <div
                className=" h-[40px] w-[90%] flex bg-[#f1f6f4] border-2 border-solid border-[#e1e7ea] rounded-[8px] items-center"
                ref={searchRef}
              >
                <input
                  className="h-[40px] w-full px-[16px] bg-transparent focus:text-[#042330] focus:outline-none text-[14px]"
                  placeholder="Search for books"
                  type="text"
                  onFocus={onFocus}
                  onChange={onChange}
                  value={query}
                />
                <AiOutlineSearch className="w-[36px] h-[36px] mr-[6px] border-l-[2px] border-solid border-[#e1e7ea] pl-[8px] " />
              </div>
            </div>
            {query ? (
              <>
                <div className="flex flex-col max-w-[440px] w-full max-h-[640px] ml-auto overflow-y-hidden p-[16px] absolute top-[80px] right-[64px] bg-white border-[1px] border-[#e1e7ea] border-solid shadow-sm z-[199]">
                  {results.length ? (
                    <>
                      {results.map((book, index) => (
                        <div key={index}>
                        <Link
                          key={index}
                          href={`book/${book.id}`}
                          className="flex items-center p-[16px] gap-[24px] h-[120px] hover:bg-[#f1f6f4]"
                        >
                          <figure className="w-[80px] h-[80px] min-w-[80px]">
                            <img src={book.imageLink} alt="book image" />
                          </figure>
                          <div>
                            <div className="text-[16px] font-semibold text-[#032b41] mb-[8px]">
                              {book.title}
                            </div>
                            <div className="text-[14px] font-light text-[#6b757b] mb-[8px]">
                              {book.author}
                            </div>
                            <div className="flex items-center gap-[4px]">
                              <FiClock className="w-[16px] h-[16px] text-[#6b757b]" />
                              <audio src={book.audioLink} ref={audioRef} />
                              <div className="text-[14px] text-[#6b757b] font-light ">
                                {formatTime(duration)}
                              </div>
                            </div>
                          </div>
                        </Link>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="w-full h-[120px] mb-[8px] bg-[#e4e4e4]"></div>
                      <div className="w-full h-[120px] mb-[8px] bg-[#e4e4e4]"></div>
                      <div className="w-full h-[120px] mb-[8px] bg-[#e4e4e4]"></div>
                      <div className="w-full h-[120px] mb-[8px] bg-[#e4e4e4]"></div>
                      <div className="w-full h-[120px] mb-[8px] bg-[#e4e4e4]"></div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
            
            <MobileSide />
          </div>
        </div>
      </div>
    </>
  );
}