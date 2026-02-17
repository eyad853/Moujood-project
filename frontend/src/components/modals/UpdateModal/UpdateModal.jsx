import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/userContext';

const UpdateModal = ({isOpen , onClose}) => {
  const {user}=useUser()

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
            className="w-20 h-20 object-contain mx-auto" 
          />
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-semibold text-gray-900 mb-3 text-center leading-tight">
          Update Available
        </h2>

        {/* Message */}
        <p className="text-[15px] text-gray-600 leading-relaxed text-center mb-7">
          A new version of the app is available. Update now to get the latest features and improvements.
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
            Update Now
          </button>

          {/* Continue Button */}
          <Link
          to={user?user.accountType==='user'?"/cleint/feed":"/business/dashboard":"/signup_as"}
            className="w-full py-3.5 px-6 text-base font-semibold text-white bg-[#00875A] rounded-xl active:scale-[0.98] active:bg-[#006d48] transition-all duration-200"
          >
            Continue Without Updating
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;