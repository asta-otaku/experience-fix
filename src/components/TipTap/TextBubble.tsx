import React, { useCallback, useImperativeHandle, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Paragraph } from "@tiptap/extension-paragraph";
import { FileTokenNode } from "./fileTokenExtenstion";
import "../TextBubble.css";
import brid from "../../assets/brid.svg";
import doc from "../../assets/doc.svg";
import loader from "../../assets/loader.svg";

interface FileData {
  file: File;
  placeholderId: string;
}

interface TextBubbleProps {
  selectedFiles: FileData[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  linkGenerated: boolean;
  setDisabledState: React.Dispatch<React.SetStateAction<boolean>>;
  step: number;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextBubble = React.forwardRef((props: TextBubbleProps, ref) => {
  const {
    selectedFiles,
    linkGenerated,
    setDisabledState,
    step,
    handleFileUpload,
    setSelectedFiles,
  } = props;

  const editor = useEditor({
    extensions: [
      StarterKit,
      FileTokenNode, // TipTap node extension
      Paragraph.configure({
        HTMLAttributes: {
          class:
            "text-left focus:border-transparent text-white text-left overflow-y-visible focus:outline-none",
        },
      }),
    ],
    content: `
    <p></p>
    `,
    onUpdate: ({ editor }) => {
      // Set the disabled state based on editor content
      if (editor.isEmpty) {
        setDisabledState(true);
      } else {
        setDisabledState(false);
      }
    },
    autofocus: true,
    editable: step >= 1 ? false : true,
    editorProps: {
      attributes: {
        class:
          "w-[290px] text-left min-h-[220px] text-white text-left overflow-visible focus:outline-none",
      },
    },
  });

  // Function to insert file tokens inline in the editor
  const insertFileTokens = useCallback(
    (files: File[]) => {
      files.forEach((file) => {
        const placeholderId = `file-token-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Insert the token into the editor at the current cursor position
        editor?.commands.insertContent({
          type: "fileToken",
          attrs: {
            fileName: file.name,
            placeholderId,
          },
        });

        setSelectedFiles((prev) => [...prev, { file, placeholderId }]);
      });
    },
    [editor, setSelectedFiles]
  );

  useImperativeHandle(ref, () => ({
    insertFileTokens,
  }));

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle the drop event for files
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = Array.from(event.dataTransfer.files);
      if (files.length) {
        insertFileTokens(files); // Insert dropped files as tokens
      }
    },
    [insertFileTokens]
  );

  // Function to handle drag over event (to allow the drop)
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className={`w-full h-full trunc rounded-2xl pb-2 -translate-y-16 relative ${
        step >= 2 && !linkGenerated
          ? "bg-[#97b8fd] cursor-none"
          : "bg-gradient-to-b from-[#3076FF] to-[#1D49E5] "
      } ${step >= 1 && step !== 4 ? "mb-44" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="text-bubble w-full h-full text-white">
        {/* The EditorContent where the file tokens will be inserted inline */}
        <EditorContent editor={editor} />
      </div>
      <>
        <button
          disabled={step >= 1}
          contentEditable={false}
          className={`flex items-center gap-2 bg-[#FFFFFF33] text-white text-xs py-1 px-2 rounded-3xl mx-auto ${
            step >= 1 ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleButtonClick}
        >
          Add files
          <img src={doc} alt="Document Icon" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          multiple
        />
      </>
      {/* Conditionally render brid and loader images only if there's an actual file and selectedFiles.length > 1 */}
      {selectedFiles.length > 1 && step >= 2 && (
        <div className="mt-2 relative translate-y-3">
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
            className={`absolute inset-0 flex items-center justify-center ${
              linkGenerated ? "hidden" : ""
            }`}
          >
            <img src={loader} alt="Loader" className="w-full" />
          </div>
          <div
            className={`flex w-full justify-center ${
              linkGenerated ? "hidden" : ""
            }`}
          >
            <p className="text-white text-xs absolute bottom-4 text-center w-[150px] bg-[#19191980] py-1 px-2 rounded-full">
              1.9GB/2GB Uploaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

export default TextBubble;
