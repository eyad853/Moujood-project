import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { FaWhatsapp , FaFacebookMessenger , FaTelegramPlane } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { AnimatePresence , motion } from 'framer-motion';

const ShareSheet = ({ isOpen, onClose, url = window.location.href }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() =>{ 
        setCopied(false) 
        onClose() 
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      color: 'bg-green-500',
      url: `https://wa.me/?text=${encodeURIComponent(url)}`
    },
    {
      name: 'Messenger',
      icon: <FaFacebookMessenger />,
      color: 'bg-blue-500',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Telegram',
      icon: <FaTelegramPlane />,
      color: 'bg-sky-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}`
    },
    {
      name: 'Email',
      icon: <MdOutlineEmail />,
      color: 'bg-red-500',
      url: `mailto:?body=${encodeURIComponent(url)}`
    },
  ];

  const handleShare = (shareUrl) => {
  if (shareUrl.startsWith('mailto:')) {
    window.location.href = shareUrl;
  } else {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
};

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 z-50 bg-white rounded-t-3xl h-[70vh] overflow-y-auto w-full left-0 right-0 md:w-[390px] md:right-8 md:left-auto"
          >
            {/* Handle Bar */}
            <div className="sticky top-0 bg-white pt-3 pb-2 px-6 border-b border-gray-100">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Share</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  {copied ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Copy className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{url}</p>
                  </div>
                </div>
              </button>

              {/* Share Options */}
              <h4 className="text-sm font-medium text-gray-600 mb-4">Share via</h4>
              <div className="grid grid-cols-4 gap-4">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleShare(option.url)}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className={`w-14 text-white h-14 ${option.color} rounded-full flex items-center justify-center text-2xl shadow-md`}>
                      {option.icon}
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareSheet