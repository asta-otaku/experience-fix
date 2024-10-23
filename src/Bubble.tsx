import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TokenPreview from "./components/TokenPreview";

interface Token {
  _id: string;
  type: string;
  fileName: string;
  url: string;
  size: string;
  createdAt: string;
}

interface BubbleData {
  _id: string;
  content: string;
  tokens: Token[];
  createdByPhone: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Bubble() {
  const { slug } = useParams<{ slug: string }>();
  const [bubbleData, setBubbleData] = useState<BubbleData | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchBubbleData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/bubbles/${slug}`);
        const data: BubbleData = response.data;
        setBubbleData(data);

        if (data.tokens.length > 0) {
          setSelectedToken(data.tokens[0]);
        }
      } catch (error) {
        console.error("Error fetching bubble data", error);
      }
    };

    fetchBubbleData();
  }, [slug]);

  const renderContent = (content: string, tokens: Token[]) => {
    let currentTokenIndex = 0;
    const elements: JSX.Element[] = [];
    let currentText = "";

    // Function to add accumulated text
    const addText = (text: string, index: number) => {
      if (text) {
        elements.push(
          <span
            key={`text-${index}`}
            className="text-white inline"
            dangerouslySetInnerHTML={{ __html: text.replace(/\s+/g, " ") }}
          />
        );
      }
    };

    // Function to add token button
    const addToken = (token: Token, index: number) => {
      elements.push(
        <button
          key={`token-${token._id}-${index}`}
          onClick={() => setSelectedToken(token)}
          className={`inline-flex items-center gap-0.5 text-xs py-1 px-2 mx-0.5 rounded-3xl w-fit cursor-pointer ${
            selectedToken?._id === token._id
              ? "bg-white text-secondary"
              : "bg-[#FFFFFF33] text-white"
          }`}
        >
          <span>📄</span>
          <span className="text-inherit max-w-14 w-full truncate">
            {token.fileName}
          </span>
        </button>
      );
    };

    // Process the content by handling <p> and <file> tags
    const processContent = () => {
      // Replace <p> and </p> with empty strings to handle it as inline
      content = content.replace(/<\/?p>/g, "");

      let i = 0;
      while (i < content.length) {
        if (content.slice(i).startsWith("<file>")) {
          // Add the accumulated text before encountering a file token
          addText(currentText, i);
          currentText = "";

          i += "<file>".length;
          const closeIndex = content.indexOf("</file-token>", i);
          if (closeIndex !== -1 && currentTokenIndex < tokens.length) {
            addToken(tokens[currentTokenIndex], currentTokenIndex);
            currentTokenIndex++;
            i = closeIndex + "</file-token>".length;
          } else {
            currentText += "<file>";
            i += "<file>".length;
          }
        } else {
          currentText += content[i];
          i++;
        }
      }

      // Add any remaining text
      if (currentText) {
        addText(currentText, i);
      }
    };

    processContent();
    return elements;
  };

  if (!bubbleData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col pb-16 relative">
      <div className="w-[345px] mx-auto">
        <article className="bg-gradient-to-b from-[#3076FF] overflow-hidden to-[#1D49E5] text-[17px] pt-3 rounded-2xl">
          <div className="px-3 font-light text-white whitespace-pre-wrap break-words">
            {renderContent(bubbleData.content, bubbleData.tokens)}
          </div>

          <div className="bubble-bottom mt-2 w-full">
            {selectedToken && <TokenPreview token={selectedToken} />}
          </div>
        </article>
      </div>
    </div>
  );
}

export default Bubble;
