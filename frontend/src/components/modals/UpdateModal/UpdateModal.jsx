import React, { useState } from 'react';
import Modal from 'react-modal';
import { useUser } from '../../../context/userContext';
import { useTranslation } from 'react-i18next';

const UpdateModal = ({isOpen , onClose , router}) => {
  const {user}=useUser()
  const {t}=useTranslation('updateModal')

  const handleUpdate = ()=>{
    const url = import.meta.env.ANDROIDURL

    window.open(url, "_system");
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative bg-white rounded-2xl p-0 max-w-[90%] w-[340px] max-h-[90vh] outline-none"
      overlayClassName="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center"
    >
      <div className="px-6 pt-8 pb-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="w-28 h-28 object-contain mx-auto" 
          />
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-semibold text-gray-900 mb-3 text-center leading-tight">
          {t('title')}
        </h2>

        {/* Message */}
        <p className="text-[15px] text-gray-600 leading-relaxed text-center mb-7">
          {t("message")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* Update Button */}
          <button
            onClick={()=>{
              handleUpdate()
            }}
            className="w-full py-3.5 px-6 text-base font-semibold text-white bg-[#009842] rounded-xl shadow-[0_2px_8px_rgba(0,152,66,0.2)] active:scale-[0.98] active:bg-[#007a36] transition-all duration-200"
          >
            {t('updateButton')}
          </button>

          {/* Continue Button */}
          <button
            onClick={() => {
              if (user) {
                router.navigate(user.accountType === "user" ? "/cleint/feed" : "/business/dashboard");
              } else {
                router.navigate("/signup_as");
              }
              onClose();
            }}
            className="w-full py-3.5 px-6 text-base font-semibold text-white bg-[#00875A] rounded-xl active:scale-[0.98] active:bg-[#006d48] transition-all duration-200"
          >
            {t('continueButton')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;