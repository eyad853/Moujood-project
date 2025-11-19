import React, { useState } from 'react';
import { ArrowLeft, Search, Trash2, Edit, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OfferSheet from '../../../components/OfferSheet/OfferSheet';

const Business_offers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoy , setSelectedCategory]=useState('')
  const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Temporary data (will be replaced with backend data)
  const categories = [
    { id: 1, name: 'Lorem Ipsum', icon: '🍔' },
    { id: 2, name: 'Lorem Ipsum', icon: '🍕' },
    { id: 3, name: 'Lorem Ipsum', icon: '🍜' },
  ];

  const offers = [
    { id: 1, name: 'Offer Name', scans: 290, image: '/offer-placeholder.jpg' },
    { id: 2, name: 'Offer Name', scans: 290, image: '/offer-placeholder.jpg' },
    { id: 3, name: 'Offer Name', scans: 290, image: '/offer-placeholder.jpg' },
    { id: 4, name: 'Offer Name', scans: 290, image: '/offer-placeholder.jpg' },
    { id: 5, name: 'Offer Name', scans: 290, image: '/offer-placeholder.jpg' },
  ];

  const handleDelete = (offerId) => {
    console.log('Delete offer:', offerId);
    // Add delete logic here
  };

  const handleEdit = (offerId) => {
    console.log('Edit offer:', offerId);
    // Add edit logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-center relative border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Offers</h1>
      </div>

      {/* Content */}
      <div className="px-2 py-6">
        {/* Search Bar */}
        <div className="relative mb-5">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategoy === category
                  ? 'bg-[#009842] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Offers List */}
        <div className="space-y-3 mb-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#00863A]  rounded-xl p-4 flex items-center gap-4 shadow-lg"
            >
              {/* Offer Image/Thumbnail */}
              <div className="relative border-2 border-white w-30 h-24 bg-[#00863A] rounded-xl overflow-hidden ">
                {/* Logo watermark */}
                <img src={offer.image} className='w-full h-full object-contain' />
              </div>

              {/* Offer Info */}
              <div className="flex-1 text-white">
                <h3 className="text-lg font-semibold mb-1">{offer.name}</h3>
                <div className="flex items-center gap-2">
                  <QrCode size={18} />
                  <span className="text-2xl font-bold">{offer.scans}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOffer(offer)
                    setIsOfferSheetOpen(true);
                  }}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Edit size={20} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Offer Button */}
        <button 
        onClick={()=>{
          setSelectedOffer(null); 
          setIsOfferSheetOpen(true);
        }}
        className="w-full bg-[#009842] text-white py-4 font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#007a36] transition-colors shadow-lg">
          <span className="text-2xl">+</span>
          <span>Add New Offer</span>
        </button>
      </div>
      <OfferSheet
      isOpen={isOfferSheetOpen}
      onClose={() => setIsOfferSheetOpen(false)}
      offerData={selectedOffer}
      />
    </div>
  );
};

export default Business_offers;