import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AttachmentContentPreview } from "../utils/BubbleSpecialInterfaces";
import ImageModal from "./ImageModal";
import RenderLinkPreview from "./RenderLinkPreview";
import RenderFilePreview from "./RenderFilePreview";

interface TokenPreviewSpecialProps {
  token: AttachmentContentPreview;
  direction: number;
  currentIndex: number;
  totalTokens: number;
  onTokenSwipe: (index: number) => void;
}

function TokenPreviewSpecial({
  token,
  direction,
  currentIndex,
  totalTokens,
  onTokenSwipe,
}: TokenPreviewSpecialProps) {
  const { url, type } = token;
  const [faviconError, setFaviconError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; alt: string }>({
    url: "",
    alt: "",
  });

  const filename = token.content?.name || token.name || "";

  // Function to get file extension from filename
  const getFileExtension = (filename: string) =>
    filename.split(".").pop()?.toLowerCase() || "";

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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
  };

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      key={token.id || token.url}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) {
          handleSwipeLeft();
        } else if (info.offset.x > 100) {
          handleSwipeRight();
        }
      }}
    >
      {children}
    </motion.div>
  );

  const openImageModal = (url: string, alt: string) => {
    setModalImage({ url, alt });
    setIsModalOpen(true);
  };

  const closeImageModal = () => setIsModalOpen(false);

  const handleSwipeLeft = () => {
    if (currentIndex < totalTokens - 1) {
      onTokenSwipe(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      onTokenSwipe(currentIndex - 1);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full bg-white rounded-2xl border relative overflow-hidden cursor-pointer">
        <AnimatePresence mode="wait" custom={direction}>
          {isLink ? (
            <RenderLinkPreview
              token={token}
              getDisplayUrl={getDisplayUrl}
              setFaviconError={setFaviconError}
              faviconError={faviconError}
              openImageModal={openImageModal}
              ContentWrapper={ContentWrapper}
            />
          ) : (
            <RenderFilePreview
              url={url}
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
              ContentWrapper={ContentWrapper}
            />
          )}
        </AnimatePresence>
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
