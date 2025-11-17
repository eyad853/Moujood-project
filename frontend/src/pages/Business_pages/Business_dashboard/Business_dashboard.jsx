import React from 'react';
import { Bell, QrCode, TrendingUp, Grid3x3, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import OfferSheet from '../../../components/OfferSheet/OfferSheet';

const Business_dashboard = () => {
  const [selectedCategoy , setSelectedCategory]=useState('')
  const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // Temporary data arrays (will be replaced with backend data)
  const categories = [
    { id: 1, name: 'Lorem Ipsum', icon: '🍔' },
    { id: 2, name: 'Lorem Ipsum', icon: '🍕' },
    { id: 3, name: 'Lorem Ipsum', icon: '🍜' },
  ];

  const offers = [
    { id: 1, title: 'جعلوة\nمختار تاكل آية', category: 'Food' },
    { id: 2, title: 'جعلوة\nمختار تاكل آية', category: 'Food' },
    { id: 3, title: 'جعلوة\nمختار تاكل آية', category: 'Food' },
    { id: 4, title: 'جعلوة\nمختار تاكل آية', category: 'Food' },
  ];

  const stats = [
    { id: 1, label: 'Total Scans', value: '40,689', icon: QrCode },
    { id: 2, label: 'Total Sales', value: '40,689', icon: TrendingUp },
    { id: 3, label: 'Total Offers', value: '23', icon: Grid3x3 },
    { id: 4, label: 'Total Loves', value: '40,689', icon: Heart },
  ];

  const hasOffers = offers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=Business+User&background=009842&color=fff"
            alt="Business Avatar"
            className="w-12 h-12 rounded-full"
          />
        </div>

        <div className="flex-1 flex justify-center">
          <img src="/logo.svg" className="h-10 object-contain" />
        </div>

        <Link to={'/Business/notifications'} className="relative">
          <Bell size={24} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009842] text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="py-6">
        {/* Stats Grid */}
        <div className="px-3 grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-[#00893B] rounded-md p-4 text-white shadow-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Icon size={24} />
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {hasOffers ? (
          <>
            {/* All Offers Section */}
            <div className="px-3 flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">All Offers</h2>
              <Link to={'/Business/offers'} className="text-sm text-gray-600 transition-colors">
                See All
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="px-3 flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((category, index) => (
                <button
                  onClick={()=>{
                    setSelectedCategory(category)
                  }}
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

            {/* Offers Grid */}
            <div className="grid grid-cols-2 gap-1 mb-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative bg-[#01a347] rounded-md overflow-hidden shadow-lg aspect-square"
                >
                  {/* Logo watermark */}
                  <div className="absolute z-10 w-12 h-12 top-3 left-3 ">
                    <img src="/white-logo.png" alt="Logo" />
                  </div>

                  {/* Content */}
                  <div className="absolute pt-[35%] inset-0 flex flex-col items-center   text-white">
                    <div className="absolute right-2 top-8 text-right mb-3 ">
                      <p className="text-lg font-bold leading-tight whitespace-pre-line">
                        {offer.title}
                      </p>
                    </div>
                    
                    {/* Placeholder for person image */}
                    <div className="w-full px-2 h-[100%] flex justify-center items-center  object-contain">
                      <img src={'/logo.svg'} className='w-full h-full object-contain'/>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute z-10 bottom-1 left-1 right-3 flex justify-between items-center text-white text-xs">
                    <span>www.maujood.net</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Add New Offer Button */}
        <div className="px-3">
          <button 
            onClick={()=>{
              setSelectedOffer(null); 
              setIsOfferSheetOpen(true);
            }}
            className={`w-full bg-[#009842] text-white font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#007a36] transition-colors shadow-lg ${
              hasOffers ? 'py-4' : 'py-6 text-lg mt-8'
            }`}
          >
            <span className="text-2xl">+</span>
            <span>Add New Offer</span>
          </button>
        </div>
      </div>
      <OfferSheet
      isOpen={isOfferSheetOpen}
      onClose={() => setIsOfferSheetOpen(false)}
      offerData={selectedOffer}
      />
    </div>
  );
};

export default Business_dashboard;