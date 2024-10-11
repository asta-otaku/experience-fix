import { useRef, useState } from "react";
import TextBubble from "./TextBubble";
import StepOneBottom from "./StepOneBottom";

function StepOne() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [disabledState, setDisabledState] = useState(true);
  const textBubbleRef = useRef<{
    insertFileToken: (file: File) => void;
  } | null>(null);

  const handleAddFile = (file: File) => {
    setSelectedFiles((prevFiles) => [...prevFiles, file]);

    // Insert the file token into the contenteditable div
    if (textBubbleRef.current) {
      textBubbleRef.current.insertFileToken(file); // Call the function through the ref
    }
  };

  const [step, setStep] = useState(0);
  const [linkGenerated, setLinkGenerated] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col py-16 relative p-4">
      <div className="flex flex-col gap-6 self-stretch md:self-auto w-[360px] items-start mx-auto p-6 mt-6">
        <TextBubble
          ref={textBubbleRef} // Pass the ref here
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleAddFile={handleAddFile}
          setDisabledState={setDisabledState}
          linkGenerated={linkGenerated}
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
}

export default StepOne;
