import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Bell, Volume2, Vibrate, Globe, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { useUser } from '../../context/userContext';


const Settings = () => {
  const navigate = useNavigate();
  const [error , setError]=useState('')
  const [loading , setLoading]=useState(false)
  const {setUser} = useUser()

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');

  const languages = [
    { id: 1, name: 'English (US)', code: 'en-US' },
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

        {/* Logout Button */}
        <button 
        onClick={()=>{
          logout(setError , navigate , setUser , setLoading)
        }}
        className="w-full bg-red-100 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-100 transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;