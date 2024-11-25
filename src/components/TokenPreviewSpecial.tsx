import { useState, useRef, useEffect } from "react";
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
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const heightUpdateTimeoutRef = useRef<any>();

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
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  const RenderContent = ({ token }: { token: AttachmentContentPreview }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (contentRef.current) {
        if (heightUpdateTimeoutRef.current) {
          clearTimeout(heightUpdateTimeoutRef.current);
        }

        const updateHeight = () => {
          const height = contentRef.current?.offsetHeight || 0;

          // For video content, handle both portrait and landscape modes
          if (isVideo) {
            const videoElement = contentRef.current?.querySelector("video");
            if (videoElement) {
              const { videoWidth, videoHeight } = videoElement;

              if (videoWidth && videoHeight) {
                const aspectRatio = videoHeight / videoWidth;

                if (aspectRatio > 1) {
                  setContainerHeight(videoHeight); // Portrait video
                } else {
                  const width = contentRef.current?.offsetWidth || 0;
                  setContainerHeight((width * videoHeight) / videoWidth); // Landscape video
                }
              } else {
                const width = contentRef.current?.offsetWidth || 0;
                setContainerHeight((width * 9) / 16); // Default 16:9 aspect ratio
              }
            }
          } else {
            setContainerHeight(height);
          }
        };

        heightUpdateTimeoutRef.current = setTimeout(updateHeight, 100);

        if (!isVideo) {
          const resizeObserver = new ResizeObserver(() => {
            if (heightUpdateTimeoutRef.current) {
              clearTimeout(heightUpdateTimeoutRef.current);
            }
            heightUpdateTimeoutRef.current = setTimeout(updateHeight, 100);
          });
          resizeObserver.observe(contentRef.current);

          return () => {
            resizeObserver.disconnect();
            if (heightUpdateTimeoutRef.current) {
              clearTimeout(heightUpdateTimeoutRef.current);
            }
          };
        }
      }
    }, [isVideo]);

    if (isLink) {
      return (
        <div ref={contentRef}>
          <RenderLinkPreview
            token={token}
            getDisplayUrl={getDisplayUrl}
            setFaviconError={setFaviconError}
            faviconError={faviconError}
            openImageModal={openImageModal}
            ContentWrapper={({ children }: any) => <>{children}</>}
          />
        </div>
      );
    }
    return (
      <div ref={contentRef} className={isVideo ? "aspect-video" : ""}>
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
      </div>
    );
  };

  const openImageModal = (url: string, alt: string) => {
    setModalImage({ url, alt });
    setIsModalOpen(true);
  };

  const closeImageModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.div
        ref={containerRef}
        className="flex flex-col w-full bg-white rounded-2xl border relative overflow-hidden"
        animate={{ height: containerHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              const threshold = 100;
              if (info.offset.x < -threshold) {
                handleSwipeLeft();
              } else if (info.offset.x > threshold) {
                handleSwipeRight();
              }
            }}
            className="absolute top-0 left-0 w-full"
          >
            <RenderContent token={token} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

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
