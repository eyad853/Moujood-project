import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { fetchNotificationDetails } from '../../api/notifications';
import Loadiing from '../Loadiing/Loadiing';

const NotificationBottomSheet = ({ isOpen, onClose, notificationId }) => {
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (seconds < 60) return rtf.format(-seconds, "second");

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, "minute");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");

  const days = Math.floor(hours / 24);
  if (days < 7) return rtf.format(-days, "day");

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return rtf.format(-weeks, "week");

  const months = Math.floor(days / 30);
  if (months < 12) return rtf.format(-months, "month");

  const years = Math.floor(days / 365);
  return rtf.format(-years, "year");
};


  useEffect(() => {
     if (!notificationId) return; // <-- add this check
    const get = async()=>{
        try{
            setLoading(true)
            await fetchNotificationDetails(notificationId , setNotification , setError);
        }catch(err){
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
              setError(err.message);
            } else {
              setError("Something went wrong");
            }
        }finally{
            setLoading(false)
        }
    }
    get()
  }, [isOpen, notificationId]);

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
            className="fixed bottom-0 z-50 bg-white rounded-t-3xl h-[90vh] overflow-y-auto hide-scrollbar w-full left-0 right-0 md:w-[390px] md:right-30 md:left-auto"
          >
            {loading?(
              <Loadiing />
            ):
            (<>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Notification Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {!loading && !error && notification && (
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {notification.title}
                    </h3>
                  </div>

                  {/* Time */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{timeAgo(notification.created_at)}</span>
                  </div>

                  {/* Message */}
                  <div className="pt-2">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {notification.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Safe area for mobile devices */}
            <div className="h-8" />
            </>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationBottomSheet