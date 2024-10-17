import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
interface FileTokenProps {
  node: any;
  selected: boolean; // This comes from TipTap's NodeViewProps
}

const FileTokenComponent: React.FC<FileTokenProps> = ({ node, selected }) => {
  const { fileName } = node.attrs;

  return (
    <NodeViewWrapper
      className={`inline-flex items-center rounded-xl py-1 px-2 mx-[5px] text-sm cursor-pointer border border-transparent ${
        selected ? "bg-white text-secondary" : "bg-[#FFFFFF33] text-white"
      }`}
      onClick={() => {
        console.log("Token clicked:", fileName);
      }}
    >
      <span className="flex gap-1 items-center">
        <span>📄</span> {/* Icon for file */}
        <span className="text-inherit max-w-14 w-full truncate">
          {fileName}
        </span>
      </span>
    </NodeViewWrapper>
  );
};

export default FileTokenComponent;
