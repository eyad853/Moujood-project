import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { fetchMyNotifications , markAllNotificationsAsRead } from '../../api/notifications';
import Loadiing from '../../components/Loadiing/Loadiing';
import { useUser } from '../../context/userContext';
import NotificationBottomSheet from '../../components/NotificationBottomSheet/NotificationBottomSheet';
import { useNotifications } from '../../context/notificationContext';
import socket from '../../Socket';
import { deleteNotification } from '../../api/notifications';
import PageError from '../../components/PageError/PageError';
import { useTranslation } from 'react-i18next'

const Notifications = () => {
  const navigate = useNavigate();
  const [error ,setError]=useState('')
  const [loading , setLoading]=useState(false)
  const [notifications , setNotifications]=useState([])
  const {user}=useUser()
  const {t}=useTranslation('notification')
  const {isNotificationSheetOpen,setIsNotificationSheetOpen,selectedNotification,setSelectedNotification}=useNotifications()
  
  useEffect(() => {
  if (!user) return;

  const get = async () => {
    try {
      setLoading(true);
      await fetchMyNotifications(user?.accountType,setNotifications,setError);
      if(notifications.length>0){
        await markAllNotificationsAsRead(user?.accountType,notifications,setNotifications,setError);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  get();
}, [user?.accountType]);

    useEffect(() => {
  // 🔔 Notification created
      const onNotificationCreated = ({ notification }) => {
        setNotifications(prev => {
          return [notification, ...prev];
        });
      };
    
      // ✏️ Notification edited
      const onNotificationEdited = ({ notification }) => {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? notification : n
          )
        );
      };
    
      // 🗑️ Notification deleted
      const onNotificationDeleted = ({ id }) => {
        setNotifications(prev =>
          prev.filter(n => Number(n.id) !== Number(id))
        );
      };
    
      socket.on("notification_created", onNotificationCreated);
      socket.on("notification_edited", onNotificationEdited);
      socket.on("notification_deleted", onNotificationDeleted);
    
      return () => {
        socket.off("notification_created", onNotificationCreated);
        socket.off("notification_edited", onNotificationEdited);
        socket.off("notification_deleted", onNotificationDeleted);
  };
}, []);
  
    if(loading){
      return (
        <div className="fixed inset-0 ">
          <Loadiing />
        </div>
      )
    }

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


  return (
    <div className="min-h-screen bg-white pb-20">
      {error?(
        <PageError />
      ):(<>
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center relative">
          <h1 className="text-xl font-semibold text-gray-900">{t('title')}</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-5 py-4 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => {
              setSelectedNotification(notification)
              setIsNotificationSheetOpen(true)
            }}
            className="bg-gray-100 rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            {/* Sender Logo */}
            <div className="w-12 h-12 bg-[#009842] rounded-full flex items-center justify-center">
              <img
                src={'/white-logo.png'}
                className="w-8 h-8 object-contain"
              />
            </div>

            {/* Notification Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {notification.title}
                </h3>
                <div 
                onClick={(e)=>{
                  e.stopPropagation()
                  deleteNotification(notification?.id , user?.accountType , setError , setNotifications)
                }}
                className="p-1.5"><X size={16}/></div>
              </div>
              <p className="text-sm whitespace-pre-wrap text-gray-500 mb-2 line-clamp-2">
                {notification.message}
              </p>
              <span className="text-xs text-gray-400">
                {timeAgo(notification.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-gray-500 text-center">{t('empty')}</p>
        </div>
      )}

      {isNotificationSheetOpen && selectedNotification?.id&&(
        <NotificationBottomSheet
        isOpen={isNotificationSheetOpen}
        onClose={() => {
          setIsNotificationSheetOpen(false)
          setSelectedNotification(null)
        }}
        notificationId={selectedNotification?.id}
      />)}
      </>)}
    </div>
  );
};

export default Notifications;