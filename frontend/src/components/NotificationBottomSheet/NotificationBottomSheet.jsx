import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, DollarSign } from 'lucide-react';
import { fetchNotificationDetails } from '../../api/notifications';
import Loadiing from '../Loadiing/Loadiing';
import { useTranslation } from 'react-i18next';
import PageError from '../PageError/PageError';

const NotificationBottomSheet = ({ isOpen, onClose, notificationId }) => {
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const {t , i18n}=useTranslation('notificationsDetails')

    const calculateDiscount = () => {
    if (notification?.offer?.offer_price_after && notification?.offer?.offer_price_before !== notification?.offer?.offer_price_after) {
      return Math.round((1 - notification?.offer?.offer_price_after / notification?.offer?.offer_price_before) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: "auto" });

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
            await fetchNotificationDetails(notificationId , setNotification , setError , t);
        }catch(err){
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
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
            {loading ? (
              <div className="h-full flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
                <Loadiing />
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
                <PageError error={error} />
              </div>
            ) : (
            <>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t('title')}
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
                  <div className="pt-2 mb-10 font-normal">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {notification.message}
                    </p>
                  </div>
                </div>
              )}

              {notification.offer&&(
                <div className="border-t border-neutral-300 pt-10">
                {/* Offer Image */}
                {notification.offer?.image && (
                  <div className="w-full h-auto bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl overflow-hidden mb-5">
                    <img
                      src={notification.offer?.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Business Info */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {t("information")}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#009842] rounded-full flex items-center justify-center flex-shrink-0">
                      {notification.offer?.business_logo ? (
                        <img
                          src={notification.offer?.business_logo}
                          className="w-full h-full rounded-full object-contain"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {notification.offer?.business_name?.charAt(0) || 'B'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {notification.offer?.business_name || 'Business Name'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* notification.Offer Title & Description */}
                <div className="mb-5">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {notification.offer?.title}
                  </h3>
                  {notification.offer.description && (
                    <p className="text-gray-600 whitespace-pre-wrap text-base leading-relaxed">
                      {notification.offer?.description}
                    </p>
                  )}
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-br from-[#009842]/10 to-[#007a36]/10 rounded-2xl p-5 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={20} className="text-[#009842]" />
                    <p className="text-sm font-semibold text-gray-700">{t('price')}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {notification.offer?.offer_price_after && notification.offer?.offer_price_after !== notification.offer?.offer_price_before ? (
                      <>
                        <span className={`${Number(notification.offer?.offer_price_after)>0?"text-gray-500 line-through":"text-[#009842] font-bold"}  text-xl`}>
                          ${parseFloat(notification.offer?.offer_price_before).toFixed(2)}
                        </span>
                        {Number(notification.offer?.offer_price_after)>0&&(<span className="text-3xl font-bold text-[#009842]">
                          ${parseFloat(notification.offer?.offer_price_after).toFixed(2)}
                        </span>)}
                        {Number(notification.offer.offer_price_after) > 0 && (
                          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-[#009842]">
                        ${parseFloat(notification.offer?.offer_price_before).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {Number(notification.offer.offer_price_after)>0 && (
                    <p className="text-sm text-green-700 font-medium mt-2">
                      {t("save")} ${(parseFloat(notification.offer?.offer_price_before) - parseFloat(notification.offer?.offer_price_after)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>)}
            </div>

            {/* Safe area for mobile devices */}
            <div className="pb-[env(safe-area-inset-bottom)]" />
            </>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationBottomSheet