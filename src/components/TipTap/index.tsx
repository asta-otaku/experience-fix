import React, { useState, useRef, useEffect } from "react";
import TextBubble from "./TextBubble";
import StepOneBottom from "../StepOneBottom";

interface FileData {
  file: File;
  placeholderId: string;
}

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const textBubbleRef = useRef<{ insertFileTokens: (files: File[]) => void }>(
    null
  );
  const [disabledState, setDisabledState] = useState(true);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      Array.from(event.dataTransfer.files).forEach((file) =>
        setSelectedFiles((prevFiles) => [
          ...prevFiles,
          {
            file,
            placeholderId: `file-token-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
          },
        ])
      );
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const [step, setStep] = useState(0);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (textBubbleRef.current) {
      textBubbleRef.current.insertFileTokens(files);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col py-16 relative p-4">
      <div className="flex flex-col gap-6 self-stretch md:self-auto w-[360px] items-start mx-auto p-6 mt-6">
        <input type="file" multiple onChange={handleFileUpload} />
        <TextBubble
          ref={textBubbleRef}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setDisabledState={setDisabledState}
          linkGenerated={linkGenerated}
          handleFileUpload={handleFileUpload}
          step={step}
        />
      </div>
      <StepOneBottom
        disabledState={disabledState}
        setStep={setStep}
        step={step}
        linkGenerated={linkGenerated}
        setLinkGenerated={setLinkGenerated}
      />
    </div>
  );
};

export default App;
