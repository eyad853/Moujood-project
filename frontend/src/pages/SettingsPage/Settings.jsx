import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Bell, Volume2, Vibrate, Globe, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { useUser } from '../../context/userContext';
import EditProfileSheet from '../../components/EditProfileSheet/EditProfileSheet ';
import PasswordEditSheet from '../../components/PasswordEditSheet/PasswordEditSheet';
import { useTranslation } from 'react-i18next'



const Settings = () => {
  const navigate = useNavigate();
  const [error , setError]=useState('')
  const [loading , setLoading]=useState(false)
  const {setUser} = useUser()
  const {t , i18n} = useTranslation('settings')
  const lang = i18n.language
  const isRTL = i18n.language === "ar"; // true if Arabic


  // Password sheet state
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

  const [selectedLanguage , setSelectedLanguage]=useState(lang)
  // Language state
  const languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'العربية', code: 'ar' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center relative">
          <h1 className="text-xl font-semibold text-gray-900">{t('header')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className={`flex items-center gap-3`}>
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Lock size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('securityTitle')}</h2>
                <p className="text-xs text-gray-500">{t('securityDescription')}</p>
              </div>
            </div>
          </div>

          {/* Edit Password Button */}
          <button
            onClick={() => setIsPasswordSheetOpen(true)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className={`flex items-center gap-3 `}>
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Lock size={16} className="text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">{t('changePassword')}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
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
                <h2 className="text-lg font-semibold text-gray-900">{t('languageTitle')}</h2>
                <p className="text-xs text-gray-500">{t('languageDescription')}</p>
              </div>
            </div>
          </div>

          {/* Language Options */}
          <div className="divide-y divide-gray-100">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => {
                  setSelectedLanguage(language.code)
                  i18n.changeLanguage(language.code)
                }}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{language.name}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedLanguage === language.code
                    ? 'border-[#009842] bg-[#009842]'
                    : 'border-gray-300'
                }`}>
                  {selectedLanguage === language.code && (
                    <Check size={16} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button 
        onClick={()=>{
          logout(setError , navigate , setUser , setLoading)
        }}
        className="w-full bg-red-100 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-100 transition-colors">
          {t('logout')}
        </button>
      </div>

      {/* Password Edit Sheet */}
      <PasswordEditSheet
        isOpen={isPasswordSheetOpen}
        onClose={() => setIsPasswordSheetOpen(false)}
      />
    </div>
  );
};

export default Settings;