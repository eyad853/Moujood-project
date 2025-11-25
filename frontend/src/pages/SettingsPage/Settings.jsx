import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Bell, Volume2, Vibrate, Globe, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  // Notification settings state
  const [generalNotification, setGeneralNotification] = useState(true);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(true);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState('English (UK)');

  const languages = [
    { id: 1, name: 'English (US)', code: 'en-US' },
    { id: 2, name: 'English (UK)', code: 'en-UK' },
    { id: 3, name: 'Arabic', code: 'ar' },
  ];

  const handleToggle = (setter, value) => {
    setter(!value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center relative">
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Bell size={20} className="text-[#009842]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-500">Manage your notification preferences</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="divide-y divide-gray-100">
            {/* General Notification */}
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">General Notification</p>
                  <p className="text-xs text-gray-500">Receive all notifications</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setGeneralNotification, generalNotification)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  generalNotification ? 'bg-[#009842]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    generalNotification ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound */}
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Volume2 size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sound</p>
                  <p className="text-xs text-gray-500">Play sound for notifications</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setSound, sound)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  sound ? 'bg-[#009842]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    sound ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Vibrate */}
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Vibrate size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Vibrate</p>
                  <p className="text-xs text-gray-500">Vibrate on notifications</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(setVibrate, vibrate)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  vibrate ? 'bg-[#009842]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    vibrate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Language</h2>
                <p className="text-xs text-gray-500">Choose your preferred language</p>
              </div>
            </div>
          </div>

          {/* Language Options */}
          <div className="divide-y divide-gray-100">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => setSelectedLanguage(language.name)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{language.name}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedLanguage === language.name
                    ? 'border-[#009842] bg-[#009842]'
                    : 'border-gray-300'
                }`}>
                  {selectedLanguage === language.name && (
                    <Check size={16} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Privacy & Security */}
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Privacy & Security</p>
                <p className="text-xs text-gray-500">Manage your privacy settings</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Help & Support */}
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Help & Support</p>
                <p className="text-xs text-gray-500">Get help and contact us</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-red-100 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-100 transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;