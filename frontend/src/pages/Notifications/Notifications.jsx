import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  // Fake notifications data
  const notifications = [
    {
      id: 1,
      sender_name: 'Bruno Pham',
      sender_logo: '/logo.svg',
      message: 'Hello, I really like your photo about...',
      time: '2 mins ago',
      read: false
    },
    {
      id: 2,
      sender_name: 'Bruno Pham',
      sender_logo: '/logo.svg',
      message: 'Hello, I really like your photo about...',
      time: '2 mins ago',
      read: false
    },
    {
      id: 3,
      sender_name: 'Bruno Pham',
      sender_logo: '/logo.svg',
      message: 'Hello, I really like your photo about...',
      time: '2 mins ago',
      read: false
    },
    {
      id: 4,
      sender_name: 'Bruno Pham',
      sender_logo: '/logo.svg',
      message: 'Hello, I really like your photo about...',
      time: '2 mins ago',
      read: false
    },
    {
      id: 5,
      sender_name: 'Bruno Pham',
      sender_logo: '/logo.svg',
      message: 'Hello, I really like your photo about...',
      time: '2 mins ago',
      read: false
    },
  ];

  const handleNotificationClick = (notificationId) => {
    console.log('Notification clicked:', notificationId);
    // Add navigation logic here (e.g., navigate to the related offer or post)
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-5 py-4 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            className="bg-gray-100 rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            {/* Sender Logo */}
            <div className="w-12 h-12 bg-[#009842] rounded-full flex items-center justify-center flex-shrink-0">
              <img
                src={notification.sender_logo}
                alt={notification.sender_name}
                className="w-8 h-8 object-contain brightness-0 invert"
              />
            </div>

            {/* Notification Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                {notification.sender_name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 truncate">
                {notification.message}
              </p>
              <span className="text-xs text-gray-400">
                {notification.time}
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
          <p className="text-gray-500 text-center">No notifications yet</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;