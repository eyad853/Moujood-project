import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, CreditCard, Languages, Users, MessageSquare, Lock, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import EditProfileSheet from '../../components/EditProfileSheet/EditProfileSheet '
import { FaUser } from 'react-icons/fa6';
import { editAccount } from '../../api/auth';
import Loadiing from '../../components/Loadiing/Loadiing'
import PageError from '../../components/PageError/PageError';
import { useTranslation } from 'react-i18next'


const Profile = () => {
    const navigate = useNavigate();
    const {user , loading , error} = useUser() 
    const [isEditProfileSheetOpen , setIsEditProfileSheetOpen]=useState(false)
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || user?.logo);
    const {t , i18n}=useTranslation('profile')
    const isRTL = i18n.language === "ar"; // true if Arabic


  const menuItems = [
    { id: 1, icon: Edit2 , label: t('editProfile'), onClick: () => {setIsEditProfileSheetOpen(true)} },
  ];

  const bottomMenuItems = [
    { id: 2, icon: MessageSquare, label: t('contact'), onClick: () => console.log('Contact') },
    { id: 3, icon: Lock, label: t('privacyPolicy'), onClick: () => console.log('Privacy') },
  ];

  // useEffect(()=>{
  //     const get = async ()=>{
  //       try{
  //         setLoading(true)
  //         await getUserPoints(setPoints , setPoints)
  //       }catch(error){
  //         setError(error)
  //       }finally{
  //         setLoading(false)
  //       }
  //     }
  
  //     get()
  //   },[])
  
    if(loading){
      return (
        <div className="fixed inset-0 ">
          <Loadiing />
        </div>
      )
    }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {error?(
        <PageError error={error} />
      ):(<>
      {/* Header with Green Background */}
      <div className="bg-[#009842] pt-12 pb-24 px-5 relative">
        <h1 className="text-xl font-semibold text-white text-center">{t('title')}</h1>
      </div>

      {/* Profile Card - Overlapping Header */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          {/* Avatar */}
          <div className="flex justify-center -mt-16 mb-4">
            <div className="relative w-32 h-32 rounded-full border  border-neutral-300">
              {user?.avatar||user?.logo?(
                <img
                src={user?.accountType==='business'?user?.logo:user?.avatar}
                className="w-full h-full rounded-full border-white shadow-lg object-cover"
              />):(
                <div className="w-full h-full  overflow-hidden rounded-full flex justify-center items-end">
                    <FaUser className='text-[#009842]' size={90}/>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
            <p className="text-sm text-gray-600">
              {user?.email}
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
                  <div className={`flex items-center gap-3 ${isRTL?"flex-row-reverse":"flex-row"}`}>
                    <Icon size={20} className="text-gray-700" />
                    <span className={`text-gray-900 ${isRTL?"text-sm":""} font-medium`}>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code Section */}
        {/* <div className="bg-white rounded-3xl shadow-lg p-8 mt-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your {user?.accountType==='business'?"Business QR Code":"points"}</h3>
          {user?.accountType==='business'?(<div className="bg-white p-4 rounded-2xl shadow-md">
            <QRCode 
            value={user?.qr_code}
            />
          </div>):(
            <div className="font-bold text-xl">
                {points}
            </div>
          )}
          <p className="text-xs text-gray-500 text-center mt-4 max-w-xs">
            {user?.accountType==='business'?"Share this QR code with your customers to let them access your offers quickly":
            ''
            }
          </p>
        </div> */}

        {/* Bottom Menu Items */}
        <div className="bg-white rounded-3xl shadow-lg mt-6 overflow-hidden">
          {bottomMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex ${isRTL?"flex-row-reverse":"flex-row"} items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors ${
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
        </>)}
    </div>
  );
};

export default Profile;