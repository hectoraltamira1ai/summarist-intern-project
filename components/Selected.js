import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TbPlayerPlayFilled } from "react-icons/tb";
import Image from "next/image"; 

export default function SelectedBook() {
  const [selectedBook, setSelectedBook] = useState("");
  const [loading, setLoading] = useState(true);

  async function getSelectedBook() {
    const { data } = await axios.get(
      "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
    );
    setSelectedBook(data[0]);
    setLoading(false);
  }

  useEffect(() => {
    getSelectedBook();
  }, []);

  return (
    <>
      <div className="md:ml-[200px] md:w-[calc(100%-200px)]">
        {loading ? (
          <>
            <div className="h-[200px] bg-[#e4e4e4] w-[60%] mb-[24px] "></div>
          </>
        ) : (
          <>
            <div className="text-[22px] font-bold text-[#032b41] mb-[16px]">
              Selected just for you
            </div>
            <Link
              href={`book/${selectedBook.id}`}
              className="w-full flex-col md:flex-row flex justify-between lg:w-[675px] bg-[#fbefd6] rounded-[4px] p-[24px] mb-[24px] gap-[24px]"
            >
              <div className="w-full text-[14px] md:w-[40%] md:text-[16px]">
                {selectedBook.subTitle}
              </div>
              <div className="hidden md:inline-block w-[1px] bg-[#bac8ce]"></div>
              <div className="w-full flex gap-[16px] md:w-[60%]">
                <figure className="h-[140px] w-[140px] min-w-[140px]">
                  <Image className="book__image" src={selectedBook.imageLink} alt="selectedbook" height={140} width={140} />
                </figure>
                <div className="align-center" style={{ width: "100%" }}>
                  <div className="text-[16px] font-semibold text-[#032b41] mb-[8px]">
                    {selectedBook.title}
                  </div>
                  <div className="text-[14px] text-[#394547] mb-[16px]">
                    {selectedBook.author}
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center w-[35px] m-w-[20px] h-[35px]">
                      <TbPlayerPlayFilled className="w-[100%] h-[100%]  bg-white flex content-center rounded-[50%] align-center p-8px " />
                    </div>
                    <div> Access Now!</div>
                  </div>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
