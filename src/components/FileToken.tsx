import React, { useState } from 'react';
import './FileToken.css';

interface FileTokenProps {
  fileName: string;
  onRemove: () => void; // Callback to remove the file token
}

const FileToken: React.FC<FileTokenProps> = ({ fileName }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleToggleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div className={`file-token-button ${isSelected ? 'selected' : ''}`} onClick={handleToggleSelect}>
      <span className="icon-container">📄</span> {/* Placeholder for the icon */}
      <span className={`file-name ${isSelected ? 'selected' : ''}`}>
        {fileName}
      </span>
      {/* {isSelected && (
        <button className="remove-button" onClick={onRemove}>
          ❌
        </button>
      )} */}
    </div>
  );
};

export default FileToken;