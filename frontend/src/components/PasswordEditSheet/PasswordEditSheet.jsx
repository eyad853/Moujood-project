import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, X } from 'lucide-react';
import { editAccount } from '../../api/auth';
import { useUser } from '../../context/userContext';
import Loadiing from '../Loadiing/Loadiing'
import { useTranslation } from 'react-i18next';

 const PasswordEditSheet = ({ isOpen, onClose })=> {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [fullError, setFullError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading , setLoading]= useState(false)
  const [success, setSuccess] = useState('');
  const {user, setUser}=useUser()
  const {t , i18n}=useTranslation('passwordEditSheet')
  const isRTL = i18n.language==='ar'

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
    setFieldErrors({})
    setFullError('')
  };

  useEffect(() => {
    if (!isOpen) {
      setSuccess('');
      setError('');
    }
  }, [isOpen]);


  const formdata = {
    password:oldPassword,
    newPassword,
    confirmPassword
  }

  const handleEditAccount = async ()=>{
    try{
      const result = await editAccount(formdata , setLoading , setError , setUser , user , setFieldErrors , setFullError , false) 
      
      if (result?.success) {
        setSuccess('Profile updated successfully');

        // close after small delay so user can see message
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    }catch(err){
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 h-[90vh] overflow-y-auto"
          >
            {loading?(
              <Loadiing />
            ) : success || fullError ? (
                // Show only message
                <div className={`flex flex-col justify-center items-center w-full h-full px-5 ${success? 'bg-[#009842]' : 'bg-red-600'}`}>
                  <h2 className={`text-2xl font-semibold mb-4 text-white`}>
                    {success || fullError}
                  </h2>
                </div>
              ) : (
            <>
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">{t('title')}</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Old Password Field */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium text-gray-700 ${isRTL?"text-right":"text-left"}`}>
                  {t('labels.currentPassword')}
                </label>
                <div className="relative">
                  <div className={`absolute ${isRTL?"right-4":"left-4"} top-1/2 -translate-y-1/2 text-gray-400`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    dir={isRTL?"rtl":"ltr"}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder={t('placeholders.currentPassword')}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl ${fieldErrors.password 
                  ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={`absolute ${isRTL?"left-4":"right-4"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium text-gray-700 ${isRTL?"text-right":"text-left"}`}>
                  {t("labels.newPassword")}
                </label>
                <div className="relative">
                  <div className={`absolute ${isRTL?"right-4":"left-4"} top-1/2 -translate-y-1/2 text-gray-400`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    dir={isRTL?"rtl":"ltr"}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('placeholders.newPassword')}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl ${fieldErrors.newPassword 
                  ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute ${isRTL?"left-4":"right-4"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className={`text-xs text-gray-500 ${isRTL?"text-right":"text-left"}`}>
                    {t('helperText.newPassword')}
                </p>
              </div>

              {/* Confirm New Password Field */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium text-gray-700 ${isRTL?"text-right":"text-left"}`}>
                  {t('labels.confirmNewPassword')}
                </label>
                <div className="relative">
                  <div className={`absolute ${isRTL?"right-4":"left-4"} top-1/2 -translate-y-1/2 text-gray-400`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    dir={isRTL?"rtl":"ltr"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('placeholders.confirmNewPassword')}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-xl ${fieldErrors.confirmPassword 
                  ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute ${isRTL?"left-4":"right-4"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="px-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-6 border-t border-gray-100 space-y-3">
              <button
                onClick={async()=>{
                    await handleEditAccount()
                }}
                className="w-full py-4 bg-[#009842] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                {t('buttons.update')}
              </button>
              <button
                onClick={handleClose}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                {t('buttons.cancel')}
              </button>
            </div>
            </>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PasswordEditSheet
