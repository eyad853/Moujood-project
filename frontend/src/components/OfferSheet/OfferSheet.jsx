import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Share2 } from 'lucide-react';
import { addOffer , editOffer } from '../../api/offers';
import { getAllSubCategories } from '../../api/categories';
import { useUser } from '../../context/userContext';
import { useOffer } from '../../context/offerContext';

const OfferSheet = ({ isOpen, onClose, offerData = null ,setOffers , setTotalOffers , setFuncUsedCategories}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const {user} = useUser()
  const [error , setError]=useState(false)
  const [loading , setLoading]=useState(false)
  const [priceType, setPriceType] = useState('single'); // 'single' or 'offer'
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const {setIsOfferSheetOpen,setSelectedOffer}=useOffer()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    priceBeforeOffer: '',
    priceAfterOffer: '',
    category:'',
  });

  // Populate form when editing
  useEffect(() => {
    if (offerData) {
      setFormData({
        title: offerData.title || '',
        description: offerData.description || '',
        image: null,
        category:offerData.category,
        priceBeforeOffer: offerData.offer_price_before || '',
        priceAfterOffer: offerData.offer_price_after || '',
      });
      setImagePreview(offerData.image || null);
      // Determine price type based on data
    if (offerData.offer_price_after) {
      setPriceType('offer'); // If priceAfterOffer exists, it's an offer
    } else {
      setPriceType('single'); // Otherwise it's single price
    }
    } else {
      // Reset form for new offer
      setFormData({
        title: '',
        description: '',
        image: null,
        category:'',
        priceBeforeOffer: '',
        priceAfterOffer: ''
      });
      setImagePreview(null);
      setPriceType('single');
    }
    getAllSubCategories(setError , setCategories)
  }, [offerData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
                {offerData ? 'Edit Offer' : 'Add New Offer'}
              </h2>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Form Content */}
            <div className="px-5 py-6 pb-8">
              {/* Offer Title */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Offer Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Offer Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                />
              </div>

              {/* Offer Description */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Offer Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Offer Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors resize-none"
                />
              </div>

              {/* Category Selection */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Custom Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {formData.category ? (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-[#009842] flex items-center justify-center overflow-hidden">
                              <img 
                                src={categories.find(cat => cat.id === formData.category.id)?.image} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-gray-900 font-medium text-base">
                              {categories.find(cat => cat.id === formData.category.id)?.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400 text-base">Choose category</span>
                        )}
                      </div>
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className={`transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : 'rotate-0'}`}
                      >
                        <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showCategoryDropdown && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowCategoryDropdown(false)}
                        />
                        
                        {/* Menu */}
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                          <div className="p-2 max-h-60 overflow-y-auto">
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, category: category }));
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all mb-1 last:mb-0 ${
                                  formData.category === category.id 
                                    ? 'bg-[#009842] text-white shadow-md' 
                                    : 'hover:bg-gray-50 text-gray-900'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
                                  formData.category === category.id ? 'bg-white/20' : 'bg-[#009842]'
                                }`}>
                                  <img 
                                    src={category.image} 
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

              {/* Image Upload */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative">
                    <img
                      src={imagePreview}
                      alt="Offer Preview"
                      className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <input
                  type="file"
                  name='image'
                  id="offerImageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="offerImageUpload"
                  className="flex items-center justify-between w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-400">
                    {formData.image ? formData.image.name : 'Upload offer Image'}
                  </span>
                  <Upload size={20} className="text-gray-600" />
                </label>
              </div>

              {/* Price Type Toggle */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Price Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPriceType('single')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      priceType === 'single'
                        ? 'bg-[#009842] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Single Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceType('offer')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      priceType === 'offer'
                        ? 'bg-[#009842] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Offer Price
                  </button>
                </div>
              </div>

              {/* Price Input - Conditional based on priceType */}
                {priceType === 'single' ? (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="priceBeforeOffer"
                      placeholder="Enter price"
                      value={formData.priceBeforeOffer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Offer Price <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="priceBeforeOffer"
                        placeholder="Before offer"
                        value={formData.priceBeforeOffer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                      />
                      <input
                        type="number"
                        name="priceAfterOffer"
                        placeholder="After offer"
                        value={formData.priceAfterOffer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
                      />
                    </div>
                  </div>
                )}

              {/* Share Offer Button */}
              <button
                onClick={()=>{
                  offerData?
                  editOffer(setError , offerData.offer_id , setOffers , formData , imagePreview , setFuncUsedCategories)
                  :
                  addOffer(setError , setOffers , formData , imagePreview , setTotalOffers , setFuncUsedCategories)
                  setIsOfferSheetOpen(false)
                  setSelectedOffer(null)
                }}
                className="w-full bg-[#009842] text-white py-4 font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#007a36] transition-colors shadow-lg"
              >
                <Share2 size={20} />
                <span>{offerData ? 'Update Offer' : 'Share Offer'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OfferSheet;

