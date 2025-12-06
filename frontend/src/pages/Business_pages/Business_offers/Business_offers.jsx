import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Trash2, Edit, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OfferSheet from '../../../components/OfferSheet/OfferSheet';
import { getBusinessOffers } from '../../../api/business';
import Loading from '../../../components/Loadiing/Loadiing';
import { deleteOffer } from '../../../api/offers';
import { useOffer } from '../../../context/offerContext';


const Business_offers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoy , setSelectedCategory]=useState('')
  const {isOfferSheetOpen, setIsOfferSheetOpen, selectedOffer, setSelectedOffer} = useOffer()
  const [error , setError]=useState(false)
  const [loading , setLoading]=useState(false)
  const [categories , setCategories]=useState([])
  const [offers , setOffers]=useState([])
  
  const filteredOffers = offers
  .filter(o => {
    // 1️⃣ Category filter
    if (selectedCategoy && o.category !== selectedCategoy.id) return false;

    // 2️⃣ Search query filter
    if (searchQuery && !o.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  
  useEffect(()=>{
    getBusinessOffers(setError , setLoading , setOffers , setCategories)
  },[])
  

  if (loading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Loading />
    </div>
  );
}

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
              onClick={()=>{
                setSelectedCategory(category)
              }}
              className={`flex items-center h-10 gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategoy === category
                  ? 'bg-[#009842] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
              }`}
            >
              <div className="w-9 h-9 ">
                <img src={category.image} alt="" />
              </div>
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Offers List */}
{offers?.length > 0 ? (
  <div className="space-y-3 mb-12">
    {filteredOffers.map((offer) => (
      <div
        key={offer?.offer_id}
        className="bg-[#00863A] rounded-xl p-4 flex items-center gap-4 shadow-lg"
      >
        {/* Offer Image/Thumbnail */}
        <div className="relative border-2 border-white w-24 h-24 bg-[#00863A] rounded-xl overflow-hidden">
          {/* Logo watermark */}
          <img src={offer?.image} className='w-full h-full object-cover' />
        </div>

        {/* Offer Info */}
        <div className="flex-1 text-white">
          <h3 className="text-lg font-semibold mb-1">{offer?.title}</h3>
          <div className="flex items-center gap-2">
            <QrCode size={18} />
            <span className="text-xl mb-0.5 font-bold">{offer?.scans}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => deleteOffer(setError , setOffers,offer?.offer_id , setCategories)}
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
) : (
  <div className="flex flex-col items-center justify-center ">
    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
      <QrCode size={48} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Offers Yet</h3>
    <p className="text-gray-500 text-center px-8">
      Start creating your first offer to attract more customers
    </p>
  </div>
)}

        {/* Add New Offer Button */}
        <button 
          onClick={() => {
            setSelectedOffer(null); 
            setIsOfferSheetOpen(true);
          }}
          className="fixed bottom-20 left-3 right-3 bg-[#009842] text-white py-4 font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#007a36] transition-colors shadow-xl z-30"
        >
          <span className="text-2xl">+</span>
          <span>Add New Offer</span>
        </button>
      </div>
      <OfferSheet
      isOpen={isOfferSheetOpen}
      onClose={() => setIsOfferSheetOpen(false)}
      offerData={selectedOffer}
      setOffers={setOffers}
      setFuncUsedCategories={setCategories}
      />
    </div>
  );
};

export default Business_offers;

