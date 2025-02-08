import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import Image from "next/image";

export default function Recommended({ checkUserStatus }) {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [durations, setDurations] = useState({});
  const durationsRef = useRef({});
  const [loading, setLoading] = useState(true);

  async function getRecommendedBooks() {
    const { data } = await axios.get(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
    );
    setRecommendedBooks(data);

    const durationsObj = {};
    data.forEach((book) => {
      if (book.audioLink) {
        const audioElement = new Audio(book.audioLink);
        durationsRef.current[book.id] = audioElement;
        audioElement.addEventListener("loadedmetadata", () => {
          durationsObj[book.id] = audioElement.duration;
          setDurations({ ...durationsObj });
        });
      }
    });
    setLoading(false);
  }

  useEffect(() => {
    getRecommendedBooks();
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
    <>
      <div className="md:ml-[200px] md:w-[calc(100%-200px)]">
        {loading ? (
          <div>
            <div className="w-[25%] h-[30px] bg-[#e4e4e4]"></div>
            <div className="w-[20%] h-[20px] bg-[#e4e4e4]"></div>
            <div className="flex overflow-x-auto snap-x gap-[16px] mb-[16px]l">
              {new Array(5).fill(0).map((_, index) => (
                <div key={index}>
                  <div className="min-w-[200px] w-[200px]">
                    <div className="w-full h-[240px] bg-[#e4e4e4] mb-[8px]"></div>
                    <div className="w-full h-[20px] bg-[#e4e4e4] mb-[8px]"></div>
                    <div className="w-[90%] h-[20px] bg-[#e4e4e4] mb-[8px]"></div>
                    <div className="w-[80%] h-[40px] bg-[#e4e4e4] mb-[8px]"></div>
                    <div className="w-[90%] h-[20px] bg-[#e4e4e4] mb-[8px]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[22px] font-bold text-[#032b41] mb-[16px]">
              Recommended For You
            </div>
            <div className="font-light mb-[16px]">
              We think you’ll like these
            </div>
            <div className="flex overflow-x-auto snap-x gap-[16px] mb-[16px]">
              {recommendedBooks.map((book, index) => (
                <div key={index}>
                  <Link href={`/book/${book.id}`} key={book.id}>
                    <div className="max-w-[200px] pt-[32px] px-[12px] pb-[12px] hover:bg-[#f1f6f4] relative">
                      {!checkUserStatus && book.subscriptionRequired && (
                        <div className="w-[55px] absolute top-0 right-0 bg-[#032b41] h-[18px] flex items-center text-white text-[10px] px-[8px] rounded-[20px]">
                          Premium
                        </div>
                      )}
                      <figure className="w-[172px] h-[172px]">
                      <Image className="w-full h-full" src={book.imageLink} alt="book" width={172} height={172} />
                      </figure>
                      <div className="text-[16px] font-bold text-[#032b41] mb-[8px]">
                        {book.title}
                      </div>
                      <div className="text-[14px] font-light text-[#6b757b] mb-[8px]">
                        {book.author}
                      </div>
                      <div className="text-[14px] text-[#394547] mb-[8px]">
                        {book.subTitle}
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <div className="flex items-center gap-[4px]">
                          <AiOutlineClockCircle className="w-[16px] h-[16px] text-[#6b757b]" />
                          <div className="text-[14px] text-[#6b757b] font-light">
                            {formatTime(durations[book.id]) || "0:00"}
                          </div>
                        </div>
                        <div className="flex items-center gap-[4px]">
                          <AiOutlineStar className="w-[16px] h-[16px] text-[#6b757b]" />
                          <div className="text-[14px] text-[#6b757b] font-light">
                            {book.averageRating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}