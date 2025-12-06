import React, { useState } from 'react';
import { ArrowLeft, Edit, CreditCard, Languages, Users, MessageSquare, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfileSheet from '../../../components/EditProfileSheet/EditProfileSheet ';

const C_Profile = () => {
  const navigate = useNavigate();
  const [isEditProfileSheetOpen , setIsEditProfileSheetOpen]=useState(true)
  

  // Temporary data (will be replaced with backend data)
  const userProfile = {
    name: 'Laiba Ahmar',
    email: 'youremail@domain.com',
    phone: '+01 234 567 89',
    avatar: 'https://ui-avatars.com/api/?name=Laiba+Ahmar&background=009842&color=fff&size=200',
    language: 'English',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://maujood.net/business/12345' // This will come from backend
  };

  const menuItems = [
    { id: 1, icon: CreditCard, label: 'Edit profile information', onClick: () => console.log('Edit profile') },
    { id: 2, icon: Languages, label: 'Language', value: userProfile.language, onClick: () => console.log('Language') },
  ];

  const bottomMenuItems = [
    { id: 1, icon: Users, label: 'Topics you like', onClick: () => console.log('Topics') },
    { id: 2, icon: MessageSquare, label: 'Contact us', onClick: () => console.log('Contact') },
    { id: 3, icon: Lock, label: 'Privacy policy', onClick: () => console.log('Privacy') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Green Background */}
      <div className="bg-[#009842] pt-12 pb-24 px-5 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-semibold text-white text-center">Profile</h1>
      </div>

      {/* Profile Card - Overlapping Header */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          {/* Avatar */}
          <div className="flex justify-center -mt-16 mb-4">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                <Edit size={18} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{userProfile.name}</h2>
            <p className="text-sm text-gray-600">
              {userProfile.email} | {userProfile.phone}
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-700" />
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  </div>
                  {item.value && (
                    <span className="text-[#009842] font-medium">{item.value}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white border text-xl font-bold border-neutral-300 rounded-3xl shadow-lg p-8 mt-6 flex justify-center items-center">
          100 Points
        </div>

        {/* Bottom Menu Items */}
        <div className="bg-white rounded-3xl shadow-lg mt-6 overflow-hidden">
          {bottomMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors ${
                  index !== bottomMenuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Icon size={20} className="text-gray-700" />
                <span className="text-gray-900 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <EditProfileSheet isOpen={isEditProfileSheetOpen} onClose={()=>{setIsEditProfileSheetOpen(false)}}/>
    </div>
  );
};

export default C_Profile;