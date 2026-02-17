import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Eye, EyeOff, MapPin } from 'lucide-react';
import { useUser } from '../../context/userContext';
import {getAllCategories} from '../../api/categories.js'
import { editAccount } from '../../api/auth.js';
import { useMapProvider } from '../../context/mapContext.jsx';
import MapModal from '../modals/MapModal/MapModal.jsx';
import Loadiing from '../Loadiing/Loadiing.jsx'
import { useTranslation } from 'react-i18next';

const EditProfileSheet = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showGovernorateDropdown, setShowGovernorateDropdown] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [fullError, setFullError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading , setLoading]=useState(false)
  const { user , setUser } = useUser();
  const [success, setSuccess] = useState('');
  const {t , i18n}=useTranslation('editProfileSheet')
  const isRtl = i18n.language==='ar'
  const {showMapModal,setShowMapModal,markers,setMarkers , userLocation, setUserLocation}=useMapProvider()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    governorate: '',
    category: '',
    image: null,
    description: '',
    locations: [],
    number: ''
  });

  const genderOptions = [
    { value: 'male', label: t('genders.male') },
    { value: 'female', label: t('genders.female') }
  ];

  const governorateOptions = [
    { value: 'Cairo', label: t('governorates.Cairo') },
    { value: 'Alexandria', label: t('governorates.Alexandria') },
    { value: 'Giza', label: t('governorates.Giza') },
    { value: 'Qalyubia', label: t('governorates.Qalyubia') },
    { value: 'Port Said', label: t('governorates.Port Said') },
    { value: 'Suez', label: t('governorates.Suez') },
    { value: 'Luxor', label: t('governorates.Luxor') },
    { value: 'Aswan', label: t('governorates.Aswan') },
    { value: 'Asyut', label: t('governorates.Asyut') },
    { value: 'Beheira', label: t('governorates.Beheira') },
    { value: 'Beni Suef', label: t('governorates.Beni Suef') },
    { value: 'Dakahlia', label: t('governorates.Dakahlia') },
    { value: 'Damietta', label: t('governorates.Damietta') },
    { value: 'Faiyum', label: t('governorates.Faiyum') },
    { value: 'Gharbia', label: t('governorates.Gharbia') },
    { value: 'Ismailia', label: t('governorates.Ismailia') },
    { value: 'Kafr El Sheikh', label: t('governorates.Kafr El Sheikh') },
    { value: 'Matrouh', label: t('governorates.Matrouh') },
    { value: 'Minya', label: t('governorates.Minya') },
    { value: 'Monufia', label: t('governorates.Monufia') },
    { value: 'New Valley', label: t('governorates.New Valley') },
    { value: 'North Sinai', label: t('governorates.North Sinai') },
    { value: 'Qena', label: t('governorates.Qena') },
    { value: 'Red Sea', label: t('governorates.Red Sea') },
    { value: 'Sharqia', label: t('governorates.Sharqia') },
    { value: 'Sohag', label: t('governorates.Sohag') },
    { value: 'South Sinai', label: t('governorates.South Sinai') }
  ];

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  // Find nearest marker to given user coordinates
  const findNearestMarker = (markers, userLocation) => {
    if (!markers || markers.length === 0) return null;
    if (!userLocation) return markers[0]; // fallback if no userLocation yet
  
    let nearest = markers[0];
    let minDistance = getDistance(
      userLocation.lat,
      userLocation.lng,
      nearest.lat,
      nearest.lng
    );
  
    for (let i = 1; i < markers.length; i++) {
      const marker = markers[i];
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        marker.lat,
        marker.lng
      );
      if (distance < minDistance) {
        nearest = marker;
        minDistance = distance;
      }
    }
  
    return nearest;
  };
  
    useEffect(() => {
      const setLocation = (lat, lng) => {
          setUserLocation({ lat, lng });
      };
      // 2️⃣ Try browser geolocation
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
          (position) => {
              setLocation(
              position.coords.latitude,
              position.coords.longitude
              );
          },
          () => {
              // 3️⃣ Geolocation failed → use nearest marker if exists
              if (markers?.length > 0) {
              const nearest = findNearestMarker(markers);
              setLocation(nearest.lat, nearest.lng);
              } else {
              // 4️⃣ Final fallback → Cairo
              setLocation(30.0444, 31.2357);
              }
          }
          );
      } else {
          // 3️⃣ No geolocation support
          if (markers?.length > 0) {
          const nearest = findNearestMarker(markers);
          setLocation(nearest.lat, nearest.lng);
          } else {
          setLocation(30.0444, 31.2357);
          }
      }
    }, [user, markers]);

    useEffect(() => {
      if (!isOpen) {
        setSuccess('');
        setError('');
      }
    }, [isOpen]);

  // Populate form when opening
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        gender: user.gender || '',
        governorate: user.governorate || '',
        category: user.category || '',
        image: null,
        description: user.description || '',
        locations: user.locations || [],
        number: user.number || ''
      });
      setLogoPreview(user.logo || user.avatar || null);
      setFieldErrors({})
      setFullError('')
    }
    // Fetch categories if business
    if (isOpen && user?.accountType === 'business') {
      // Call your API to get categories
      getAllCategories(setError, setCategories);
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

    const handleOpenMap = () => {
    setMarkers(formData.locations);
    setShowMapModal(true);
  };

  const handleSaveLocations = () => {
    setFormData(prev => ({ ...prev, locations: markers }));
    setShowMapModal(false);
  };

  const handleAddMarker = (location) => {
    setMarkers(prev => [...prev, location]);
  };

  const handleRemoveMarker = (index) => {
    setMarkers(markers.filter((_, i) => i !== index));
  };

  const handleEditAccount = async ()=>{
    try{
      // Filter out invalid locations
    const validLocations = (formData.locations || [])
      .map(loc => ({
        lat: Number(loc.lat),
        lng: Number(loc.lng)
      }))
      .filter(loc => !isNaN(loc.lat) && !isNaN(loc.lng));
      
      const payload = {
        ...formData,
        locations: JSON.stringify(validLocations)
      };
      console.log(payload);
      const result = await editAccount(payload , setLoading , setError , setUser , user , setFieldErrors , setFullError , true) 

      if (result?.success) {
        setSuccess('Profile updated successfully');

        // close after small delay so user can see message
        setTimeout(() => {
          onClose();
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
            onClick={onClose}
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
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {t('title')}
              </h2>
              <div className="w-10"></div>
            </div>

            {/* Form Content */}
            <div className="px-5 py-6 pb-8">
              {/* Logo Circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload size={40} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    id='logoUpload'
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    name='image'
                  />
                  <label
                    htmlFor="logoUpload"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-[#009842] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#007a36] transition-colors shadow-lg"
                  >
                    <Upload size={20} className="text-white" />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="mb-5">
                <label className={`block text-sm font-semibold text-gray-900 mb-2 ${isRtl?"text-right":"text-left"}`}>
                  {isRtl && <span className="text-red-500 mr-1">*</span>}
                  {user?.accountType === 'business' ? t('labels.businessName') : t('labels.name')}
                  {!isRtl && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  name="name"
                  dir={isRtl?"rtl":"ltr"}
                  placeholder={user?.accountType === 'business' ? t('placeholders.businessName') : t('placeholders.name')}
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 text-base border rounded-xl outline-none bg-gray-50 ${fieldErrors.name 
                  ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors`}
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className={`block text-sm font-semibold text-gray-900 mb-2 ${isRtl?"text-right":"text-left"}`}>
                  {isRtl && <span className="text-red-500 mr-1">*</span>}
                  {t('labels.email')} 
                  {!isRtl && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="email"
                  name="email"
                  dir={isRtl?"rtl":"ltr"}
                  placeholder={t('placeholders.email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 text-base border rounded-xl outline-none bg-gray-50 ${fieldErrors.email 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors`}
                />
              </div>

              {/* CLIENT SPECIFIC FIELDS */}
              {user?.accountType === 'user' && (
                <>
                  {/* Governorate */}
                  <div className="mb-5">
                    <label className={`${isRtl?"text-right":"text-left"} block text-sm font-semibold text-gray-900 mb-2`}>
                      {t('labels.governorate')}
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowGovernorateDropdown(!showGovernorateDropdown)}
                        className={`w-full px-4 py-3.5 text-base border rounded-xl bg-gray-50 text-left flex items-center justify-between
                          ${fieldErrors.governorate 
                          ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} 
                          transition-colors ${isRtl?"flex-row-reverse":"flex-row"}`}
                      >
                        <span className={formData.governorate ? 'text-gray-900 flex items-center gap-2' : 'text-gray-400'}>
                          {formData.governorate ? (
                            <>
                              <span>{governorateOptions.find(opt => opt.value === formData.governorate)?.icon}</span>
                              <span>{governorateOptions.find(opt => opt.value === formData.governorate)?.label}</span>
                            </>
                          ) : (
                            t("messages.selectGovernorate")
                          )}
                        </span>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none"
                          className={`transition-transform ${showGovernorateDropdown ? 'rotate-180' : 'rotate-0'}`}
                        >
                          <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      {showGovernorateDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowGovernorateDropdown(false)}
                          />
                          
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                            {governorateOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, governorate: option.value }));
                                  setShowGovernorateDropdown(false);
                                }}
                                className={`w-full px-4 py-3.5 text-left text-base transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2 ${
                                  formData.governorate === option.value 
                                    ? 'bg-[#009842] text-white font-medium' 
                                    : 'hover:bg-gray-50 text-gray-900'
                                }`}
                              >
                                <span>{option.icon}</span>
                                <span>{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="mb-5">
                    <label className={`block text-sm font-semibold text-gray-900 mb-2 ${isRtl?"text-right":"text-left"}`}>
                      {t('labels.gender')}
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        className={`w-full px-4 py-3.5 text-base border rounded-xl bg-gray-50 text-left flex items-center
                          justify-between ${fieldErrors.gender 
                        ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} 
                        transition-colors ${isRtl?"flex-row-reverse":"flex-row"}`}
                      >
                        <span className={formData.gender ? 'text-gray-900 flex items-center gap-2' : 'text-gray-400'}>
                          {formData.gender ? (
                            <>
                              <span>{genderOptions.find(opt => opt.value === formData.gender)?.label}</span>
                            </>
                          ) : (
                            t('messages.selectGender')
                          )}
                        </span>
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none"
                          className={`transition-transform ${showGenderDropdown ? 'rotate-180' : 'rotate-0'}`}
                        >
                          <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      {showGenderDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowGenderDropdown(false)}
                          />
                          
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                            {genderOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, gender: option.value }));
                                  setShowGenderDropdown(false);
                                }}
                                className={`w-full px-4 py-3.5 text-left text-base transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2 ${
                                  formData.gender === option.value 
                                    ? 'bg-[#009842] text-white font-medium' 
                                    : 'hover:bg-gray-50 text-gray-900'
                                }`}
                              >
                                <span>{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* BUSINESS SPECIFIC FIELDS */}
              {user?.accountType === 'business' && (
                <>
                  {/* Business Category */}
                  <div className="mb-5">
                    <label className={`block text-sm font-semibold mb-2 text-gray-900 ${isRtl?"text-right":"text-left"}`}>
                      {t('labels.category')}
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className={`w-full px-4 py-4 border rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all ${fieldErrors.category 
                        ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} 
                        flex items-center justify-between group ${isRtl?"flex-row-reverse":"flex-row"}`}
                      >
                        <div className="flex items-center gap-3">
                          {formData.category ? (
                            <>
                              <div className="w-10 h-10 rounded-xl bg-[#009842] flex items-center justify-center overflow-hidden">
                                <img 
                                  src={categories.find(cat => cat.id === formData.category)?.image} 
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="text-gray-900 font-medium text-base">
                                {categories.find(cat => cat.id === formData.category)?.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-base">{t("placeholders.category")}</span>
                          )}
                        </div>
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 16 16" 
                          fill="none"
                          className={`transition-all duration-300 ${showCategoryDropdown ? 'rotate-180 text-[#009842]' : 'rotate-0 text-gray-400'} group-hover:text-[#009842]`}
                        >
                          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      
                      {showCategoryDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowCategoryDropdown(false)}
                          />
                          
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                            <div className="p-2 max-h-80 overflow-y-auto">
                              {categories.filter(cat => cat.parent_id === null).map((category) => (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, category: category.id }));
                                    setShowCategoryDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center gap-3 transition-all mb-1 last:mb-0 ${
                                    formData.category === category.id 
                                      ? 'bg-[#009842] text-white shadow-md scale-[1.02]' 
                                      : 'hover:bg-gray-50 text-gray-900 hover:scale-[1.01]'
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
                                    formData.category === category.id ? 'bg-white/20' : 'bg-[#009842]'
                                  }`}>
                                    <img 
                                      src={category.image} 
                                      alt={category.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <span className={`font-medium text-base ${
                                    formData.category === category.id ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {category.name}
                                  </span>
                                  {formData.category === category.id && (
                                    <svg className="ml-auto" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                      <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Business Description */}
                  <div className="mb-5">
                    <label className={`block text-sm font-semibold text-gray-900 mb-2 ${isRtl?"text-right":"text-left"}`}>
                      {t("labels.description")}
                    </label>
                    <textarea
                      name="description"
                      dir={isRtl?"rtl":"ltr"}
                      placeholder="Describe your Business"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-3.5 text-base rounded-xl outline-none bg-gray-50 ${fieldErrors.description 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors resize-none`}
                    />
                  </div>

                  {/* Business Locations Map */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-900">
                        {t("labels.locations")}
                      </label>
                      <span className="text-sm text-[#009842] font-semibold">
                        {formData.locations.length > 0 && 
                          t('messages.locationsSelected', { count: formData.locations.length })
                        }
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenMap}
                      className="w-full h-44 rounded-xl bg-[#f0f9f4] border-2 border-dashed border-[#009842] flex flex-col items-center justify-center gap-2 hover:bg-[#e6f5ed] transition-colors"
                    >
                      <MapPin size={40} className="text-[#009842]" />
                      <span className="text-[#009842] font-semibold text-base">
                        {t('buttons.selectLocations')}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {t('messages.multipleLocations')}
                      </span>
                    </button>
                  </div>

                  {/* Business Phone */}
                  <div className="mb-5">
                    <label className={`block text-sm font-semibold text-gray-900 mb-2 ${isRtl?"text-right":"text-left"}`}>
                      {t('labels.phone')}
                    </label>
                    <input
                      type="tel"
                      dir={isRtl?"rtl":"ltr"}
                      name="number"
                      placeholder={t('placeholders.phone')}
                      value={formData.number}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 text-base border rounded-xl outline-none bg-gray-50
                        ${fieldErrors.number 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors`}
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
            <div className="px-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

              {/* Save Button */}
              <button
                onClick={async()=>{
                  await handleEditAccount()
                }}
                className="w-full bg-[#009842] text-white py-4 font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#007a36] transition-colors shadow-lg"
              >
                {t('buttons.saveChanges')}
              </button>
            </div>
            </>)}
          </motion.div>
        </>
      )}
      {showMapModal&&user?.accountType==='business'&&(
        <MapModal 
        showMapModal={showMapModal} 
        setShowMapModal={setShowMapModal}
        userLocation={userLocation}
        markers={markers}
        setMarkers={setMarkers}
        handleSaveLocations={handleSaveLocations}
        handleAddMarker={handleAddMarker}
        handleRemoveMarker={handleRemoveMarker}
      />)}
    </AnimatePresence>
  );
};

export default EditProfileSheet;