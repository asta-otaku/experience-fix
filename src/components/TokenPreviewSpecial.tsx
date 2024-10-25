import { useState } from "react";

interface AttachmentContent {
  url?: string;
  name?: string;
  type: string;
  id?: string;
  content?: {
    s3Url?: string;
  };
}

function TokenPreviewSpecial({ token }: { token: AttachmentContent }) {
  const { url, name, type } = token;
  const [faviconError, setFaviconError] = useState(false);

  // Determine file type based on token URL and MIME type
  const isImage =
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url || "");
  const isVideo =
    type.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(url || "");
  const isAudio =
    type.startsWith("audio/") || /\.(mp3|wav|ogg)$/i.test(url || "");
  const isPDF = type === "application/pdf" || /\.pdf$/i.test(url || "");
  const isZip = type === "application/zip" || /\.zip$/i.test(url || "");
  const isCSV = type === "text/csv" || /\.csv$/i.test(url || "");
  const isExcel =
    type === "application/vnd.ms-excel" ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    /\.(xls|xlsx)$/i.test(url || "");
  const isLink =
    type === "LINK" ||
    (!isImage &&
      !isVideo &&
      !isAudio &&
      !isPDF &&
      !isZip &&
      !isCSV &&
      !isExcel &&
      url?.startsWith("http"));

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

  const renderLinkPreview = () => {
    if (!url) return null;
    const { hostname } = getDisplayUrl(url);

    return (
      <div className="flex max-w-xs w-full p-3 flex-col gap-3 rounded-[14px] bg-white border border-solid border-[#1919191a]">
        <div className="flex justify-between items-center self-stretch gap-3">
          <div className="flex justify-between items-center self-stretch gap-3 flex-nowrap">
            {/* Logo */}
            <div className="w-6 h-6 rounded border border-solid border-[#1919191a] flex items-center justify-center">
              {!faviconError ? (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                  alt="Site favicon"
                  className="w-full h-full object-contain"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-base">
                  🌐
                </span>
              )}
            </div>

            {/* Website Name */}
            <div className="inline-block items-center gap-1.5 text-xs font-medium text-primary whitespace-nowrap max-w-[137px] truncate overflow-hidden">
              {hostname}
            </div>
          </div>

          {/* Visit Link Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <button className="transition-all duration-200 ease-in-out bg-[#1919190d] hover:bg-[#19191914] text-xs px-4 py-1.5 rounded-full flex items-center gap-1">
              Visit Link
            </button>
          </a>
        </div>

        {/* Description */}
        <div className="inline-block self-stretch text-[#7e7e7e] max-w-xs truncate overflow-hidden text-sm">
          This could be an interesting website with a lot of useful information.
          Click the button below to visit the site and explore more.
        </div>

        {/* Image Preview */}
        <a
          href={url}
          className="max-w-xs max-h-[175px] rounded-lg cursor-pointer relative group"
          target="_blank"
          rel="noopener noreferrer"
        >
          {token?.content?.s3Url ? (
            <img
              src={token?.content?.s3Url}
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

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl border">
      {isLink && renderLinkPreview()}

      {/* Rest of the component remains unchanged */}
      {isImage && (
        <img
          src={url}
          alt={name || "Image preview"}
          className="w-full h-auto rounded-2xl border"
        />
      )}

      {isVideo && (
        <video
          controls
          className="w-full max-h-[300px] h-auto rounded-lg border"
        >
          <source src={url} type={type} />
          Your browser does not support the video tag.
        </video>
      )}

      {isAudio && (
        <audio controls className="w-full border rounded-lg">
          <source src={url} type={type} />
          Your browser does not support the audio element.
        </audio>
      )}

      {isPDF && (
        <iframe
          src={url}
          className="w-full h-[300px] rounded-lg border"
          title={name || "PDF preview"}
        />
      )}

      {isZip && (
        <div className="flex flex-col justify-center items-center p-5 border border-dashed rounded-lg text-[#d9534f] text-sm">
          <p>{name || "ZIP File"}</p>
          <p>(ZIP File)</p>
        </div>
      )}

      {isCSV && (
        <div className="flex flex-col justify-center items-center p-5 border border-dashed rounded-lg text-[#5cb85c] text-sm">
          <p>{name || "CSV File"}</p>
          <p>(CSV File)</p>
        </div>
      )}

      {isExcel && (
        <div className="flex flex-col justify-center items-center p-5 border border-dashed rounded-lg text-[#2a9d8f] text-sm">
          <p>{name || "Excel File"}</p>
          <p>(Excel File)</p>
        </div>
      )}

      {!isImage &&
        !isVideo &&
        !isAudio &&
        !isPDF &&
        !isZip &&
        !isCSV &&
        !isLink &&
        !isExcel &&
        !isLink && (
          <div className="flex flex-col justify-center items-center p-5 border border-dashed rounded-lg text-[#666] text-sm">
            <p>{name || "Unknown File"}</p>
            <p>({type})</p>
          </div>
        )}
    </div>
  );
}

export default TokenPreviewSpecial;
