import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SmallError = ({ message = "Something wrong occurred", duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(() => onClose(), 300); // Wait for exit animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className="fixed top-10 right-3 z-[9999] min-w-[280px] max-w-[90vw]"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 shadow-lg flex items-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="2" />
              <path
                d="M10 6v4M10 14h.01"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="m-0 text-red-800 text-sm font-medium leading-snug">
              {message}
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-auto bg-transparent border-none cursor-pointer p-1 flex items-center text-red-800 flex-shrink-0 hover:text-red-900 transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmallError;