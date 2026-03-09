import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const SuccessContent = ({ message, success, variant, onClose }) => {
  const isToast = variant === "toast";

  return (
    <div className={`flex w-full h-full relative
      ${isToast ? "flex-row items-start gap-3 p-4" : "flex-col items-center justify-center gap-5 p-10"}`}>

      {/* Icon */}
      <div className={`relative flex-shrink-0 ${isToast ? "w-10 h-10" : "w-16 h-16"}`}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
          className={`absolute -inset-1.5 rounded-full border-2 ${success ? "border-green-400" : "border-red-400"}`}
        />
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`w-full h-full rounded-full flex items-center justify-center
            ${success
              ? "bg-gradient-to-br from-green-500 to-green-400 shadow-[0_4px_20px_rgba(34,197,94,0.4)]"
              : "bg-gradient-to-br from-red-600 to-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.4)]"}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            className={`text-white ${isToast ? "w-4 h-4" : "w-7 h-7"}`}>
            <CheckIcon />
          </motion.div>
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: isToast ? 0 : 8, x: isToast ? 6 : 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className={`flex flex-col gap-1 flex-1 ${isToast ? "text-left" : "text-center"}`}>
        <p className={`font-bold m-0 tracking-tight ${isToast ? "text-sm" : "text-xl"}
          ${success ? "text-green-900" : "text-red-900"}`}>
          {success ? "Success!" : "Error"}
        </p>
        <p className={`m-0 leading-relaxed opacity-80 ${isToast ? "text-xs" : "text-sm"}
          ${success ? "text-green-800" : "text-red-800"}`}>
          {message}
        </p>
      </motion.div>

      {/* Close */}
      {onClose && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-none cursor-pointer
            flex items-center justify-center p-1 transition-colors
            ${isToast ? "self-start" : "absolute top-4 right-4"}
            ${success
              ? "bg-green-900/10 text-green-900 hover:bg-green-900/20"
              : "bg-red-900/10 text-red-900 hover:bg-red-900/20"}`}>
          <CloseIcon />
        </motion.button>
      )}

      {/* Shimmer bar — inline only */}
      {!isToast && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className={`w-14 h-0.5 rounded-full origin-center
            ${success
              ? "bg-gradient-to-r from-green-500 to-green-300"
              : "bg-gradient-to-r from-red-500 to-red-300"}`}
        />
      )}
    </div>
  );
};

const ShowSuccess = ({
  success = true,
  message = "Your action was completed successfully.",
  variant = "inline",
  isVisible = true,
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => { setVisible(isVisible); }, [isVisible]);

  useEffect(() => {
    if (variant === "toast" && visible && duration > 0) {
      const t = setTimeout(() => { setVisible(false); onClose?.(); }, duration);
      return () => clearTimeout(t);
    }
  }, [visible, variant, duration, onClose]);

  const handleClose = () => { setVisible(false); onClose?.(); };

  // ── INLINE ────────────────────────────────────────────────────────
  if (variant === "inline") {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={`relative w-full h-full min-h-48 rounded-2xl overflow-hidden border
              ${success
                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"}`}>
            <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl pointer-events-none
              ${success ? "bg-green-300/30" : "bg-red-300/30"}`} />
            <div className={`absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-2xl pointer-events-none
              ${success ? "bg-green-400/20" : "bg-red-400/20"}`} />
            <SuccessContent message={message} success={success} variant="inline"
              onClose={onClose ? handleClose : undefined} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── TOAST ─────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-10 right-3 z-[9999] min-w-[280px] max-w-[90vw]
            rounded-2xl overflow-hidden border
            ${success
              ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-[0_8px_32px_rgba(34,197,94,0.2),0_2px_8px_rgba(0,0,0,0.08)]"
              : "bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-[0_8px_32px_rgba(239,68,68,0.2),0_2px_8px_rgba(0,0,0,0.08)]"}`}>
          {duration > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left
                ${success
                  ? "bg-gradient-to-r from-green-600 to-green-400"
                  : "bg-gradient-to-r from-red-600 to-red-400"}`}
            />
          )}
          <SuccessContent message={message} success={success} variant="toast" onClose={handleClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShowSuccess;