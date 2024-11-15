import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { SlClose } from "react-icons/sl";

function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  altText,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <SlClose width={24} height={24} />
            </button>
            <img
              src={imageUrl}
              alt={altText}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ImageModal;
