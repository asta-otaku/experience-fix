import React, { useRef } from "react";
import doc from "../assets/doc.svg";

interface AddFilesButtonProps {
  handleAddFile: (file: File) => void;
}

const AddFilesButton: React.FC<AddFilesButtonProps> = ({ handleAddFile }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => handleAddFile(file));
    }
  };

  return (
    <>
      <button
        className="flex items-center gap-2 bg-[#FFFFFF33] text-white text-xs py-1 px-2 rounded-3xl mx-auto"
        onClick={handleButtonClick}
      >
        Add files
        <img src={doc} alt="Document Icon" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
    </>
  );
};

export default AddFilesButton;
