import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TokenPreviewSpecial from "./components/TokenPreviewSpecial";
import { truncateFilename } from "./components/TruncateText";
import imageIcon from "./assets/imageIcon.svg";
import videoIcon from "./assets/videoIcon.svg";
import audioIcon from "./assets/musicIcon.svg";
import blueAudio from "./assets/blueMusicIcon.svg";
import links from "./assets/chain.svg";
import whitelinks from "./assets/whitechain.svg";
// Define the attachment types for the Special Bubble
interface AttachmentContent {
  url?: string;
  id?: string;
  name?: string;
  s3Url?: string;
  size?: number;
  width?: number | null;
  height?: number | null;
  startTime?: number;
}

interface MetaDataContent {
  username: null | string;
  avatarUrl: null | string;
  mediaUrl: string;
  faviconUrl: string;
  dataText: string;
  title: string;
  fileType: number;
  size: null | number;
  streamAudioUrl: string;
}

interface Attachment {
  index: number;
  type: "LINK" | "FILE" | "SYSTEM_MESSAGE" | "USER" | "TIMESTAMP" | "REFERENCE";
  s3DownloadLink: string;
  metaData: null | MetaDataContent;
  content: AttachmentContent;
}

interface BubbleData {
  _id: string;
  contentText: string;
  attachments: Attachment[];
  createdByPhone: string;
  createdAt: string;
  updatedAt: string;
}

const SPECIAL_BUBBLE_BASE_URL = import.meta.env.VITE_BASE_URL;
const USER_ID = import.meta.env.VITE_USER_ID;

const BubbleSpecial = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bubbleData, setBubbleData] = useState<BubbleData | null>(null);
  const [owner, setOwner] = useState<string>("");
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);

  useEffect(() => {
    const fetchBubbleData = async () => {
      try {
        // Make the Axios request with the x-user-id header
        const response = await axios.post(
          `${SPECIAL_BUBBLE_BASE_URL}/api/artifacts/details`,
          {
            artifactId: slug,
            isDev: true,
          },
          {
            headers: {
              "x-user-id": USER_ID, // Use the user ID from the environment variable
              accept: "*/*",
            },
          }
        );

        // Access the 'artifact' object from the response
        const artifact = response.data.artifact;
        setOwner(response.data.ownerProfile.displayName);

        setBubbleData(artifact);
        setSelectedAttachment(artifact.attachments[0]);
      } catch (error) {
        console.error("Error fetching bubble data", error);
      }
    };

    if (slug) {
      fetchBubbleData();
    }
  }, [slug]);

  const renderContent = (content: string, attachments: Attachment[]) => {
    if (!content) return <p>No content available</p>;

    const elements: JSX.Element[] = [];
    let attachmentIndex = 0; // Keeps track of the current attachment being processed

    // Split content text by the '$' symbol, which marks attachment positions
    const contentParts = content.split("$");

    contentParts.forEach((part, index) => {
      // Add the current text part
      if (part) {
        elements.push(
          <span
            key={`text-${index}`}
            className="text-white inline"
            dangerouslySetInnerHTML={{ __html: part.replace(/\s+/g, " ") }}
          />
        );
      }

      // Add a attachment at every alternate index (as content is split by $)
      if (
        index < contentParts.length - 1 &&
        attachmentIndex < attachments.length
      ) {
        const attachment = attachments[attachmentIndex];
        elements.push(renderAttachment(attachment, elements.length));
        attachmentIndex++; // Move to the next attachment
      }
    });

    return elements;
  };

  const getFileIcon = (fileName: string, attachment: Attachment) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    switch (fileExtension) {
      case "zip":
      case "rar":
        return "📦";
      case "mp3":
      case "wav":
      case "ogg":
        return (
          <img
            src={
              selectedAttachment?.content.id === attachment.content.id
                ? blueAudio
                : audioIcon
            }
            alt="audio icon"
            className="w-4 h-4"
          />
        );
      case "mp4":
      case "avi":
      case "mkv":
        return <img src={videoIcon} alt="video icon" className="w-4 h-4" />;
      case "pdf":
      case "doc":
      case "docx":
        return "📄";
      case "xls":
      case "xlsx":
        return "📊";
      case "csv":
        return "📑";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "heic":
        return <img src={imageIcon} alt="image icon" className="w-4 h-4" />;
      case "link":
        return "🔗";
      default:
        return "📄";
    }
  };

  const renderAttachment = (attachment: Attachment, index: number) => {
    switch (attachment.type) {
      case "LINK":
        const url = new URL(attachment.content.url || "");
        const isTwitterLink =
          url.hostname.includes("twitter.com") ||
          url.hostname.includes("x.com");
        const isSpotifyLink = url.hostname.includes("spotify.com");
        const displayText = isTwitterLink
          ? "twitter.com"
          : isSpotifyLink
          ? "spotify.com"
          : truncateFilename(url.hostname.replace("www.", ""));

        return (
          <button
            key={`attachment-${attachment.content.id}-${index}`}
            onClick={() => {
              setSelectedAttachment(attachment);
            }}
            className={`inline-flex items-center gap-0.5 text-xs py-1 px-2 mx-0.5 rounded-3xl w-fit cursor-pointer ${
              selectedAttachment?.content.id === attachment.content.id
                ? "bg-white text-secondary"
                : "bg-[#FFFFFF33] text-white"
            }`}
          >
            <span>
              <img
                src={
                  selectedAttachment?.content.id === attachment.content.id
                    ? links
                    : whitelinks
                }
                alt="link icon"
              />
            </span>
            <span className="text-inherit max-w-20 w-full truncate">
              {displayText}
            </span>
          </button>
        );
      case "FILE":
        return (
          <button
            key={`attachment-${attachment.content.id}-${index}`}
            onClick={() => setSelectedAttachment(attachment)}
            className={`inline-flex items-center gap-0.5 text-xs py-1 px-2 mx-0.5 rounded-3xl w-fit cursor-pointer ${
              selectedAttachment?.content.id === attachment.content.id
                ? "bg-white text-secondary"
                : "bg-[#FFFFFF33] text-white"
            }`}
          >
            <span>
              {getFileIcon(attachment.content.name || "", attachment)}
            </span>
            <span className="text-inherit max-w-20 w-full truncate">
              {truncateFilename(attachment.content.name || "")}
            </span>
          </button>
        );
      case "SYSTEM_MESSAGE":
        return (
          <span
            key={`attachment-${attachment.content.id}-${index}`}
            className="inline-flex items-center gap-1 text-red-500"
          >
            SYSTEM MESSAGE
          </span>
        );
      case "USER":
        return (
          <span
            key={`attachment-${attachment.content.id}-${index}`}
            className="inline-flex items-center gap-1 text-green-500"
          >
            USER
          </span>
        );
      case "TIMESTAMP":
        return (
          <span
            key={`attachment-${attachment.content.id}-${index}`}
            className="inline-flex items-center gap-1 text-gray-500"
          >
            TIMESTAMP: {attachment.content.startTime}s
          </span>
        );
      case "REFERENCE":
        return (
          <span
            key={`attachment-${attachment.content.id}-${index}`}
            className="inline-flex items-center gap-1 text-purple-500"
          >
            REFERENCE
          </span>
        );
      default:
        return <span key={`attachment-${attachment.content.id}-${index}`} />;
    }
  };

  if (!bubbleData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col py-16 relative p-4">
      <div className="flex flex-col w-[360px] mx-auto p-6">
        <article className="bg-gradient-to-b from-[#3076FF] overflow-hidden to-[#1D49E5] w-full text-[17px] pt-3 rounded-2xl">
          <div className="px-3 font-light text-white whitespace-pre-wrap break-words">
            {renderContent(bubbleData.contentText, bubbleData.attachments)}
          </div>

          <div className="bubble-bottom mt-2 w-full">
            {selectedAttachment && (
              <TokenPreviewSpecial
                token={{
                  ...selectedAttachment,
                  url: selectedAttachment.s3DownloadLink,
                  name: selectedAttachment.content.name || "Unnamed File", // Ensure fileName is always a string
                }}
              />
            )}
          </div>
        </article>
        <h2 className="text-[#7E7E7E] text-xs mt-1">{owner}</h2>
      </div>
    </div>
  );
};

export default BubbleSpecial;
