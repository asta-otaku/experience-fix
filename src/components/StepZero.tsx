import { useState } from "react";
import brid from "../assets/brid.svg";
import links from "../assets/chain.svg";
import plusIcon from "../assets/plus.svg";

function StepZero({ handleNext }: { handleNext: () => void }) {
  const [selectedToken1, setSelectedToken1] = useState("token1");

  return (
    <div className="w-full h-full flex justify-center items-center flex-col pb-16 relative">
      <div className="w-[345px] mx-auto">
        <article className="bg-gradient-to-b from-[#3076FF] to-[#1D49E5] text-white text-[17px] pt-3 rounded-2xl">
          <div className="px-3 font-light">
            Typo is the best way to share your ideas. <br />
            They can be{" "}
            <button
              onClick={() => setSelectedToken1("token1")}
              className={`inline-flex items-center gap-0.5 text-xs py-1 px-2 rounded-3xl w-fit cursor-pointer ${
                selectedToken1 === "token1"
                  ? "bg-white text-secondary"
                  : "bg-[#FFFFFF33] text-white"
              }`}
            >
              <div className="tokenPill">
                <div className="thumbnail">
                  <img
                    src={brid}
                    alt="Token Thumbnail"
                    className="thumbnailImg"
                  ></img>
                </div>

                <span>video.mp4</span>
              </div>
            </button>{" "}
            <button
              onClick={() => setSelectedToken1("token2")}
              className={`inline-flex items-center gap-0.5 text-xs py-1 px-2 rounded-3xl w-fit cursor-pointer ${
                selectedToken1 === "token2"
                  ? "bg-white text-secondary"
                  : "bg-[#FFFFFF33] text-white"
              }`}
            >
              <div className="tokenPill">
                <div className="thumbnail">
                  <img
                    src={brid}
                    alt="Token Thumbnail"
                    className="thumbnailImg"
                  ></img>
                </div>

                <span>songs.mp3</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedToken1("token3")}
              className={`inline-flex items-center gap-0.5 text-xs py-1 px-2 rounded-3xl w-fit cursor-pointer ${
                selectedToken1 === "token3"
                  ? "bg-white/80 text-secondary"
                  : "bg-[#FFFFFF33] text-white"
              }`}
            >
              <div className="tokenPill">
                <div className="thumbnail">
                  <img src={links}></img>
                </div>

                <span>links</span>
              </div>
            </button>{" "}
            or all of the above... Upload and share up to 5GBs for free
          </div>
          <div className="bubble-bottom mt-2 translate-y-2">
            <img
              src={brid}
              alt="Whiteboarding"
              style={{
                width: "100%",
                // borderRadius: "10px",
              }}
            />
          </div>
        </article>
      </div>
      <button
        onClick={handleNext}
        className="bg-[#F3F3F3BF] text-primary px-4 py-2.5 rounded-full flex items-center font-semibold absolute bottom-12"
      >
        <img src={plusIcon} alt="plus icon" className="inline-block mr-2" />{" "}
        Create an idea
      </button>
    </div>
  );
}

export default StepZero;
