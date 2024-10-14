import { useState } from "react";
import copyIcon from "../assets/copy.svg";

const GenerateLinkButton = ({
  linkGenerated,
  setLinkGenerated,
}: {
  linkGenerated: boolean;
  setLinkGenerated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [disabledState, setDisabledState] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleButtonClick = () => {
    setIsGenerating(true);
    setDisabledState(true);
    setTimeout(() => {
      const newLink = "https://typo.inc/123456";
      setGeneratedLink(newLink);
      setLinkGenerated(true);
      setIsGenerating(false);
      setDisabledState(false);
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied to clipboard!");
  };

  return (
    <button
      onClick={handleButtonClick}
      disabled={disabledState || generatedLink !== ""}
      className={`bg-[#F3F3F3BF] text-secondary px-4 py-2.5 rounded-full w-[250px] flex items-center gap-2 font-semibold ${
        disabledState ? "opacity-40 cursor-not-allowed" : ""
      } shadow-sm shadow-secondary`}
    >
      {linkGenerated ? (
        <div className="flex items-center gap-2">
          <img
            src={copyIcon}
            alt="Copy icon"
            className="w-4 h-4 cursor-pointer"
            onClick={handleCopyLink}
          />
          {generatedLink}
        </div>
      ) : isGenerating ? (
        <span className="w-full text-center">Generating link...</span>
      ) : (
        <span className="w-full text-center">Generate link</span>
      )}
    </button>
  );
};

export default GenerateLinkButton;
