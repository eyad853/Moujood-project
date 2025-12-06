import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../../context/userContext';

const EditProfileSheet = ({ isOpen, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showGovernorateDropdown, setShowGovernorateDropdown] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const {user} = useUser() 
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    governorate: '',
    category: '',
    logo: null,
    description: '',
    addresses: '',
    locations: '',
    phone: ''
    });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const governorateOptions = [
    { value: 'Cairo', label: 'Cairo' },
    { value: 'Alexandria', label: 'Alexandria' },
    { value: 'Giza', label: 'Giza' },
    { value: 'Qalyubia', label: 'Qalyubia' },
    { value: 'Port Said', label: 'Port Said' },
    { value: 'Suez', label: 'Suez' },
    { value: 'Luxor', label: 'Luxor' },
    { value: 'Aswan', label: 'Aswan' },
    { value: 'Asyut', label: 'Asyut' },
    { value: 'Beheira', label: 'Beheira' },
    { value: 'Beni Suef', label: 'Beni Suef' },
    { value: 'Dakahlia', label: 'Dakahlia' },
    { value: 'Damietta', label: 'Damietta' },
    { value: 'Faiyum', label: 'Faiyum' },
    { value: 'Gharbia', label: 'Gharbia' },
    { value: 'Ismailia', label: 'Ismailia' },
    { value: 'Kafr El Sheikh', label: 'Kafr El Sheikh' },
    { value: 'Matrouh', label: 'Matrouh' },
    { value: 'Minya', label: 'Minya' },
    { value: 'Monufia', label: 'Monufia' },
    { value: 'New Valley', label: 'New Valley' },
    { value: 'North Sinai', label: 'North Sinai' },
    { value: 'Qena', label: 'Qena' },
    { value: 'Red Sea', label: 'Red Sea' },
    { value: 'Sharqia', label: 'Sharqia' },
    { value: 'Sohag', label: 'Sohag' },
    { value: 'South Sinai', label: 'South Sinai' }
  ];

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
        logo: null,
        description: user.description || '',
        addresses: user.addresses || '',
        locations: user.locations || '',
        phone: user.phone || user.number || ''
      });
      setLogoPreview(user.logo || null);
    }
    // Fetch categories if business
    if (isOpen && user?.accountType === 'business') {
      // Call your API to get categories
      // getAllCategories(setError, setCategories);
    }
  }, [isOpen, user, user?.accountType]);

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
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', formData);
    onClose();
  };

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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h2>
              <div className="w-10"></div>
            </div>

            {/* Form Content */}
            <div className="px-5 py-6 pb-8">
              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter new password (leave empty to keep current)"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 pr-12 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* USER SPECIFIC FIELDS */}
              {user?.accountType === 'user' && (
                <>
                  {/* Gender */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Gender
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-left flex items-center justify-between focus:border-[#00875A] focus:ring-1 focus:ring-[#00875A] transition-colors"
                      >
                        <span className={formData.gender ? 'text-gray-900' : 'text-gray-400'}>
                          {genderOptions.find(opt => opt.value === formData.gender)?.label || 'Select your gender'}
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
                                className={`w-full px-4 py-3.5 text-left text-base transition-colors border-b border-gray-100 last:border-b-0 ${
                                  formData.gender === option.value 
                                    ? 'bg-[#00875A] text-white font-medium' 
                                    : 'hover:bg-gray-50 text-gray-900'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Governorate */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Governorate
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowGovernorateDropdown(!showGovernorateDropdown)}
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-left flex items-center justify-between focus:border-[#00875A] focus:ring-1 focus:ring-[#00875A] transition-colors"
                      >
                        <span className={formData.governorate ? 'text-gray-900' : 'text-gray-400'}>
                          {governorateOptions.find(opt => opt.value === formData.governorate)?.label || 'Select your governorate'}
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
                                className={`w-full px-4 py-3.5 text-left text-base transition-colors border-b border-gray-100 last:border-b-0 ${
                                  formData.governorate === option.value 
                                    ? 'bg-[#00875A] text-white font-medium' 
                                    : 'hover:bg-gray-50 text-gray-900'
                                }`}
                              >
                                {option.label}
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
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                      Business category
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-[#fafafa] hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center justify-between group"
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
                              <span className="text-gray-900 font-medium text-[15px]">
                                {categories.find(cat => cat.id === formData.category)?.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-[15px]">Choose from the categories</span>
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
                                  <span className={`font-medium text-[15px] ${
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

                  {/* Business Logo */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business logo
                    </label>
                    
                    {logoPreview && (
                      <div className="mb-3">
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                    
                    <input
                      type="file"
                      id="logoUpload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logoUpload"
                      className="flex items-center justify-between w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-400">
                        {formData.logo ? formData.logo.name : 'Upload Your Logo'}
                      </span>
                      <Upload size={20} className="text-gray-600" />
                    </label>
                  </div>

                  {/* Business Description */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your Business"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors resize-none"
                    />
                  </div>

                  {/* Business Addresses */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Address/es
                    </label>
                    <textarea
                      name="addresses"
                      placeholder="Enter your business addresses"
                      value={formData.addresses}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors resize-none"
                    />
                  </div>

                  {/* Business Locations */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Locations
                    </label>
                    <input
                      type="text"
                      name="locations"
                      placeholder="Business locations"
                      value={formData.locations}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                    />
                  </div>

                  {/* Business Phone */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Business Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter you Business phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex justify-center items-center text-red-600 font-semibold mb-5">
                  {error}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full bg-[#009842] text-white py-4 font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#007a36] transition-colors shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileSheet;