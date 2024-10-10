import React, { useImperativeHandle, useRef } from "react";
import "./TextBubble.css";
import AddFilesButton from "./AddFilesButton";
import brid from "../assets/brid.svg";
import loader from "../assets/loader.svg";

interface TextBubbleProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleAddFile: (file: File) => void;
  linkGenerated: boolean;
  setDisabledState: React.Dispatch<React.SetStateAction<boolean>>;
  step: number;
}

const TextBubble = React.forwardRef((props: TextBubbleProps, ref) => {
  const {
    selectedFiles,
    handleAddFile,
    linkGenerated,
    setDisabledState,
    step,
  } = props;
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const insertFileToken = (file: File) => {
    if (contentEditableRef.current) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const fileTokenElement = document.createElement("span");
        fileTokenElement.className = "file-token";
        fileTokenElement.contentEditable = "false"; // Make token non-editable
        fileTokenElement.style.background = "white";
        fileTokenElement.style.color = "blue";
        fileTokenElement.style.padding = "0 5px";
        fileTokenElement.style.borderRadius = "12px";
        fileTokenElement.style.margin = "0 5px";
        fileTokenElement.style.display = "inline-flex";
        fileTokenElement.style.width = "fit-content";

        const thumbnail = document.createElement("img");
        thumbnail.src = URL.createObjectURL(file);
        thumbnail.style.width = "12px";
        thumbnail.style.height = "12px";
        thumbnail.style.marginRight = "5px";
        thumbnail.style.borderRadius = "4px";

        const fileName = document.createElement("span");
        fileName.textContent = file.name;

        fileTokenElement.appendChild(thumbnail);
        fileTokenElement.appendChild(fileName);

        range.insertNode(fileTokenElement);
        range.collapse(false); // Move the cursor after the token
        contentEditableRef.current.focus();
      }
    }
  };

  useImperativeHandle(ref, () => ({
    insertFileToken,
  }));

  return (
    <div
      className={`bg-gradient-to-b from-[#3076FF] to-[#1D49E5] w-full h-full trunc rounded-2xl pb-2 -translate-y-16 relative ${
        step >= 2 && !linkGenerated ? "opacity-70" : ""
      }`}
    >
      <div className="text-bubble w-full">
        <div
          ref={contentEditableRef}
          className="text-input w-full"
          contentEditable={step < 2}
          suppressContentEditableWarning={true}
          onInput={() => {
            if (
              contentEditableRef.current &&
              contentEditableRef.current.textContent?.trim() !== ""
            ) {
              setDisabledState(false);
            } else {
              setDisabledState(true);
            }
          }}
        >
          {/* Inline file tokens and text will appear here */}
          {selectedFiles.map((_, index) => (
            <span key={index} className="file-token-button"></span>
          ))}
        </div>
      </div>
      <AddFilesButton handleAddFile={handleAddFile} />

      {/* Conditionally render brid and loader images when step is 2 */}
      {step >= 2 && (
        <>
          {/* Brid image with overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[85%] z-10">
            <img
              src={brid}
              alt="Brid"
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className={`absolute inset-0 bg-black/50 opacity-30 rounded-lg ${
                linkGenerated ? "hidden" : ""
              }`}
            ></div>
            <div
              className={`flex w-full justify-center ${
                linkGenerated ? "hidden" : ""
              }`}
            >
              <p className="text-white text-xs absolute bottom-4 text-center w-[150px] bg-[#19191980] py-1 px-2 rounded-full">
                1.9GB/2GB Uploaded
              </p>
            </div>

            {/* Loader image centered within the brid overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                linkGenerated ? "hidden" : ""
              }`}
            >
              <img src={loader} alt="Loader" className="w-full" />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default TextBubble;
