import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { AttachmentContentPreview } from "../utils/BubbleSpecialInterfaces";
import ImageModal from "./ImageModal";
import RenderLinkPreview from "./RenderLinkPreview";
import RenderFilePreview from "./RenderFilePreview";

// Import Swiper styles
import "swiper/css";

interface TokenPreviewSpecialProps {
  token: AttachmentContentPreview;
  direction: number;
  currentIndex: number;
  totalTokens: number;
  onTokenSwipe: (index: number) => void;
  allTokens: AttachmentContentPreview[];
}

function TokenPreviewSpecial({
  token,
  // direction,
  currentIndex,
  // totalTokens,
  onTokenSwipe,
  allTokens,
}: TokenPreviewSpecialProps) {
  const [faviconError, setFaviconError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; alt: string }>({
    url: "",
    alt: "",
  });
  // const [contentHeight, setContentHeight] = useState("auto");
  const swiperRef = useRef<SwiperRef>(null);

  const { url, type } = token;
  const filename = token.content?.name || token.name || "";

  const getFileExtension = (filename: string) =>
    filename.split(".").pop()?.toLowerCase() || "";
  const fileExtension = getFileExtension(filename);

  const isLink = type === "LINK" || (!fileExtension && url?.startsWith("http"));
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
      return { hostname: urlObject.hostname, origin: urlObject.origin };
    } catch {
      return { hostname: url, origin: "" };
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

  const openImageModal = (url: string, alt: string) => {
    setModalImage({ url, alt });
    setIsModalOpen(true);
  };

  const closeImageModal = () => setIsModalOpen(false);

  const RenderContent = ({
    token,
  }: {
    token: AttachmentContentPreview;
    index: number;
  }) => {
    if (isLink) {
      return (
        <RenderLinkPreview
          token={token}
          getDisplayUrl={getDisplayUrl}
          setFaviconError={setFaviconError}
          faviconError={faviconError}
          openImageModal={openImageModal}
          ContentWrapper={({ children }: any) => <>{children}</>}
        />
      );
    }
    return (
      <RenderFilePreview
        url={token.url}
        filename={filename}
        fileExtension={fileExtension}
        token={token}
        isImage={isImage}
        isVideo={isVideo}
        isAudio={isAudio}
        isPDF={isPDF}
        isZip={isZip}
        isCSV={isCSV}
        isExcel={isExcel}
        formatFileSize={formatFileSize}
        openImageModal={openImageModal}
        ContentWrapper={({ children }: any) => <>{children}</>}
      />
    );
  };

  // Effect to handle swipe programmatically when currentIndex changes
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(currentIndex);
    }
  }, [currentIndex]);

  return (
    <>
      <div className="flex flex-col w-full bg-white rounded-2xl border relative overflow-hidden">
        <Swiper
          ref={swiperRef}
          spaceBetween={0}
          slidesPerView={1}
          initialSlide={currentIndex}
          onSlideChange={(swiper) => {
            // Only call onTokenSwipe if the slide change was user-initiated
            if (swiper.activeIndex !== currentIndex) {
              onTokenSwipe(swiper.activeIndex);
            }
          }}
          className="w-full"
        >
          {allTokens.map((currentToken, index) => (
            <SwiperSlide key={index} className="relative">
              <RenderContent token={currentToken} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        imageUrl={modalImage.url}
        altText={modalImage.alt}
      />
    </>
  );
}

export default TokenPreviewSpecial;
