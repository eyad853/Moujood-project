import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Share2 } from 'lucide-react';

const OfferSheet = ({ isOpen, onClose, offerData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    priceBeforeOffer: '',
    priceAfterOffer: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (offerData) {
        setFormData({
        title: offerData.title || '',
        description: offerData.description || '',
        image: null,
        priceBeforeOffer: offerData.priceBeforeOffer || '',
        priceAfterOffer: offerData.priceAfterOffer || ''
      });
      setImagePreview(offerData.imageUrl || null);
    } else {
      // Reset form for new offer
        setFormData({
        title: '',
        description: '',
        image: null,
        priceBeforeOffer: '',
        priceAfterOffer: ''
      });
      setImagePreview(null);
    }
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

  const handleSubmit = () => {
    
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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
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

              {/* Offer Price */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Offer Price <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    name="priceBeforeOffer"
                    placeholder="before offer"
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

              {/* Share Offer Button */}
              <button
                onClick={handleSubmit}
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