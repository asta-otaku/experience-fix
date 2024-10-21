import React, { useState, useRef, useEffect } from "react";
import TextBubble from "./TextBubble";
import StepOneBottom from "../StepOneBottom";
import { uploadFiles, createBubble } from "../../services/apiService";

interface FileData {
  file: File;
  placeholderId: string;
}

const App = () => {
  const [_, setCreatedTokens] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const textBubbleRef = useRef<{
    insertFileTokens: (files: File[]) => void;
    getEditorContent: () => string | undefined;
  }>(null);
  const [disabledState, setDisabledState] = useState(true);

  // Handle file drop
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

  const [tokens, setTokens] = useState<string[]>([]);

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
      // Filter out duplicate files based on file name
      const newFiles = files.filter(
        (file) => !selectedFiles.some((f) => f.file.name === file.name)
      );

      console.log("New files after filtering duplicates:", newFiles);

      // Insert new tokens into the editor if there are any new files
      if (newFiles.length > 0) {
        textBubbleRef.current.insertFileTokens(newFiles); // Insert tokens into the editor

        // Update the selected files state to include new files
        setSelectedFiles((prevFiles) => [
          ...prevFiles,
          ...newFiles.map((file) => ({
            file,
            placeholderId: `file-token-${Math.random()
              .toString(36)
              .substring(2, 9)}`, // Assign unique placeholderId
          })),
        ]);

        console.log("Updated selected files:", [...selectedFiles, ...newFiles]);
      } else {
        console.log("No new files to add.");
      }
    }
  };

  // Handle bubble creation (upload files, replace placeholders with actual tokens)
  const handleCreateBubble = async () => {
    if (!textBubbleRef.current) {
      console.error("Editor reference not found.");
      return { token: [] };
    }

    let bubbleContent = textBubbleRef.current.getEditorContent();
    console.log("Editor content before token replacement:", bubbleContent);

    if (!bubbleContent) {
      console.error("No content found in the editor.");
      return { token: [] };
    }

    try {
      console.log("Starting to upload files:", selectedFiles);
      const data = await uploadFiles(
        selectedFiles.map((fileData) => fileData.file)
      );
      console.log("Uploaded files and received tokens:", data);

      const uniqueTokens = data.filter(
        (token: any, index: number, self: any[]) =>
          index === self.findIndex((t) => t._id === token._id)
      );
      setCreatedTokens(uniqueTokens);

      console.log("Unique tokens after filtering:", uniqueTokens);

      uniqueTokens.forEach((token: any) => {
        const placeholderRegex = new RegExp(
          `<file-token filename="${token.fileName}" placeholderid="file-token-[a-z0-9]+"></file-token>`,
          "g"
        );
        bubbleContent = bubbleContent?.replace(
          placeholderRegex,
          `<file-token id="${token._id}"></file-token>`
        );
      });

      console.log("Final bubble content to send:", bubbleContent);

      const createdBubble = await createBubble(
        bubbleContent,
        uniqueTokens.map((token: any) => token._id),
        "user@example.com"
      );
      setTokens(uniqueTokens.map((token: any) => token._id));
      console.log("Bubble created successfully:", createdBubble);

      setSelectedFiles([]); // Clear selected files after creation
      setCreatedTokens([]);

      return { token: uniqueTokens.map((token: any) => token._id) };
    } catch (error) {
      console.error("Error creating bubble:", error);
      return { token: [] };
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
        handleCreateBubble={handleCreateBubble}
        tokens={tokens}
      />
    </div>
  );
};

export default App;
