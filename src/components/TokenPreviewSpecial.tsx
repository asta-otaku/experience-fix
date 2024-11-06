import { useState, useRef, useEffect } from "react";
import updown from "../assets/updown.svg";
import fallback from "../assets/fallbackLinkImage.svg";

interface AttachmentContent {
  url?: string;
  name?: string;
  type: string;
  id?: string;
  content?: {
    name?: string;
    s3Url?: string;
    size?: number;
    height?: number | null;
    thumbnailImage?: string | null;
  };
}

function TokenPreviewSpecial({ token }: { token: AttachmentContent }) {
  const { url, type } = token;
  const [faviconError, setFaviconError] = useState(false);
  const [audioDuration, setAudioDuration] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get the filename from content.name if available, otherwise fallback to token.name
  const filename = token.content?.name || token.name || "";

  useEffect(() => {
    if (isAudio && audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        const duration = audioRef.current?.duration || 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setAudioDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      });
    }
  }, []);

  // Function to get file extension from filename
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  // Get the file extension
  const fileExtension = getFileExtension(filename);

  // Check if it's a LINK type first
  const isLink = type === "LINK" || (!fileExtension && url?.startsWith("http"));

  // For all other types, check the file extension from content.name
  const isImage = /^(jpg|jpeg|png|gif|bmp|webp|heic)$/i.test(fileExtension);
  const isVideo = /^(mp4|webm|ogg|mov|avi)$/i.test(fileExtension);
  const isAudio = /^(mp3|wav|ogg|m4a)$/i.test(fileExtension);
  const isPDF = /^pdf$/i.test(fileExtension);
  const isZip = /^(zip|rar|7z)$/i.test(fileExtension);
  const isCSV = /^csv$/i.test(fileExtension);
  const isExcel = /^(xls|xlsx)$/i.test(fileExtension);

  const getDisplayUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return {
        hostname: urlObject.hostname,
        origin: urlObject.origin,
      };
    } catch {
      return {
        hostname: url,
        origin: "",
      };
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const renderLinkPreview = () => {
    if (!url) return null;
    const { hostname } = getDisplayUrl(url);

    return (
      <div className="flex max-w-xs w-full p-3 flex-col gap-3 rounded-[14px] bg-white border border-solid border-[#1919191a]">
        <div className="flex justify-between items-center self-stretch gap-3">
          <div className="flex justify-between items-center self-stretch gap-3 flex-nowrap">
            <div className="w-6 h-6 rounded border border-solid border-[#1919191a] flex items-center justify-center">
              {!faviconError ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                  alt="Site favicon"
                  className="w-full h-full object-contain"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <img
                  src={fallback}
                  alt="Site favicon"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="inline-block items-center gap-1.5 text-xs font-medium text-primary whitespace-nowrap max-w-[137px] truncate overflow-hidden">
              {hostname}
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border border-solid border-[#1919191A] text-xs text-[#191919] px-2 py-1 rounded-full"
          >
            Visit Link
          </a>
        </div>
        <div className="inline-block self-stretch text-[#7e7e7e] max-w-xs truncate overflow-hidden text-sm">
          This could be an interesting website with a lot of useful information.
          Click the button below to visit the site and explore more.
        </div>
        <a
          href={url}
          className="max-w-xs max-h-[175px] rounded-lg cursor-pointer relative group"
          target="_blank"
          rel="noopener noreferrer"
        >
          {token?.content?.s3Url ? (
            <img
              src={token.content.s3Url}
              alt={`${hostname} Preview`}
              className="h-[175px] w-full rounded-lg object-cover border border-solid border-[#1919191a] transition-opacity group-hover:opacity-90"
            />
          ) : (
            <div className="h-[175px] w-full rounded-lg border border-solid border-[#1919191a] bg-gray-50 flex flex-col items-center justify-center gap-2 transition-colors group-hover:bg-gray-100">
              <span className="flex items-center justify-center w-full h-full text-7xl">
                🌐
              </span>
            </div>
          )}
        </a>
      </div>
    );
  };

  const renderFilePreview = () => {
    const fileUrl = token.content?.s3Url || url;
    const fileSize = formatFileSize(token.content?.size);

    // Image Preview - Just the image
    if (isImage && token.content?.s3Url) {
      return (
        <div className="max-w-xs w-full overflow-hidden rounded-[14px]">
          <img
            src={token?.content?.s3Url ?? token.content.thumbnailImage}
            alt={filename}
            className="w-full min-h-[175px] object-cover"
          />
        </div>
      );
    }

    // Video Preview - Just the video player
    if (isVideo && fileUrl) {
      return (
        <div className="max-w-xs w-full overflow-hidden rounded-[14px]">
          <video controls className="w-full h-[200px]">
            <source src={fileUrl} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio Preview - Custom layout
    if (isAudio && fileUrl) {
      return (
        <div className="max-w-xs w-full p-3 flex flex-col gap-3 rounded-[14px] bg-white border border-solid border-[#1919191a]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium max-w-40 truncate text-[#191919]">
              {filename}
            </span>
            <span className="text-xl">
              <img src={updown} alt="File size" className="w-4 h-4" />
            </span>
          </div>
          <span className="text-xs text-[#7E7E7E] -mt-3">{fileSize}</span>
          <span className="text-sm text-center">{audioDuration}</span>
          <audio ref={audioRef} controls className="w-full">
            <source src={fileUrl} type={`audio/${fileExtension}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    // PDF Preview - With view file link
    if (isPDF && fileUrl) {
      return (
        <object
          data={fileUrl}
          type="application/pdf"
          width="100%"
          height="175px"
          className="rounded-[14px]"
        >
          <p>
            Your browser does not support PDFs.{" "}
            <a href={fileUrl}>Download PDF</a>.
          </p>
        </object>
      );
    }

    // For other file types, use the existing preview box
    const getPreviewBox = (icon: string, title: string, color: string) => (
      <div className="flex max-w-xs w-full p-3 flex-col gap-3 rounded-[14px] bg-white border border-solid border-[#1919191a]">
        <div className="flex justify-between items-center self-stretch gap-3">
          <div className="flex justify-between items-center self-stretch gap-3 flex-nowrap">
            <div className="w-6 h-6 rounded border border-solid border-[#1919191a] flex items-center justify-center">
              <span className="text-base">{icon}</span>
            </div>
            <div
              className={`inline-block items-center gap-1.5 text-xs font-medium ${color} whitespace-nowrap max-w-[137px] truncate overflow-hidden`}
            >
              {filename}
            </div>
          </div>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-solid border-[#1919191A] text-xs text-[#191919] px-2 py-1 rounded-full"
            >
              Open {title}
            </a>
          )}
        </div>
        <div className="inline-block self-stretch text-[#7e7e7e] max-w-xs truncate overflow-hidden text-sm">
          {fileSize && `File size: ${fileSize}`}
        </div>
      </div>
    );

    if (isZip) return getPreviewBox("📦", "Archive", "text-amber-500");
    if (isCSV) return getPreviewBox("📊", "CSV", "text-green-500");
    if (isExcel) return getPreviewBox("📑", "Excel", "text-emerald-500");

    return getPreviewBox("📎", "File", "text-gray-500");
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border">
      {isLink ? renderLinkPreview() : renderFilePreview()}
    </div>
  );
}

export default TokenPreviewSpecial;
