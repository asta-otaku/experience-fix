import updown from "../assets/updown.svg";

function RenderFilePreview({
  url,
  formatFileSize,
  token,
  isImage,
  openImageModal,
  filename,
  isVideo,
  fileExtension,
  isAudio,
  audioRef,
  audioDuration,
  isPDF,
  isZip,
  isCSV,
  isExcel,
  ContentWrapper,
}: {
  url: string | undefined;
  formatFileSize: (bytes?: number) => string;
  token: any;
  isImage: boolean;
  openImageModal: (url: string, alt: string) => void;
  filename: string;
  isVideo: boolean;
  fileExtension: string;
  isAudio: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioDuration: string;
  isPDF: boolean;
  isZip: boolean;
  isCSV: boolean;
  isExcel: boolean;
  ContentWrapper: any;
}) {
  const fileUrl = url;
  const fileSize = formatFileSize(token.content?.size);

  // Image Preview with animation
  if (isImage && url) {
    return (
      <ContentWrapper>
        <div
          className="max-w-xs w-full overflow-hidden rounded-[14px] cursor-pointer relative group"
          onClick={() => openImageModal(url, filename)}
        >
          <img
            src={url}
            alt={filename}
            className="w-full min-h-[175px] object-cover transition-opacity group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
        </div>
      </ContentWrapper>
    );
  }

  // Video Preview with animation
  if (isVideo && fileUrl) {
    return (
      <ContentWrapper>
        <div className="max-w-xs w-full overflow-hidden rounded-[14px]">
          <video controls className="w-full h-[250px] object-cover">
            <source src={fileUrl} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      </ContentWrapper>
    );
  }

  // Audio Preview with animation
  if (isAudio && fileUrl) {
    return (
      <ContentWrapper>
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
      </ContentWrapper>
    );
  }

  // PDF Preview with animation
  if (isPDF && fileUrl) {
    return (
      <ContentWrapper>
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
      </ContentWrapper>
    );
  }

  // For other file types with animation
  const getPreviewBox = (icon: string, title: string, color: string) => (
    <ContentWrapper>
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
    </ContentWrapper>
  );

  if (isZip) return getPreviewBox("📦", "Archive", "text-amber-500");
  if (isCSV) return getPreviewBox("📊", "CSV", "text-green-500");
  if (isExcel) return getPreviewBox("📑", "Excel", "text-emerald-500");

  return getPreviewBox("📎", "File", "text-gray-500");
}

export default RenderFilePreview;
