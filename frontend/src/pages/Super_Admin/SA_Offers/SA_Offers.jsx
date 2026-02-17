import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Trash2, Edit, X } from 'lucide-react';
import { getOffersPageData } from '../../../api/super_admin_data';
import { getAllCategories } from '../../../api/categories';
import { editOffer , deleteOffer } from '../../../api/offers';
import { useEffect } from 'react';
import Loadiing from '../../../components/Loadiing/Loadiing'
import OfferDetailSheet from '../../../components/OfferDetailSheet/OfferDetailSheet';
import OfferSheet from '../../../components/OfferSheet/OfferSheet';
import { useOffer } from '../../../context/offerContext';
import socket from '../../../Socket';
import { useUser } from '../../../context/userContext';
import PageError from '../../../components/PageError/PageError';


const SA_Posts = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [businessName, setBusinessName] = useState('');
  const {isOfferSheetOpen, setIsOfferSheetOpen , selectedOffer, setSelectedOffer} = useOffer();
  const [isOfferDetailsOpen , setIsOffersDetailsOpen]=useState(false)
  const [categories , setCategories]=useState([])
  const [loading ,setLoading]=useState(false)
  const [error , setError]=useState('')
  const [offers , setOffers]=useState([])
  const {user} = useUser()
  const [pageError , setPageError]=useState('')
  const [smallError , setSmallError]=useState('')
  

    useEffect(()=>{
        const get=async()=>{
            try{
                setLoading(true)
                await getAllCategories(setError , setCategories)
                await getOffersPageData(setError , setOffers)
                
            }catch(error){
                setError(error)
            }finally{
                setLoading(false)
            }
        }
        get()
      },[])

useEffect(() => {
  const onNewOffer = (offer) => {
    setOffers(prev => [offer , ...prev]
    );
  };

  const onEditOffer = (editedOffer) => {
    if(user.accountType==='super_admin') return
    setOffers(prev =>
      prev.map(o =>
        o.offer_id === editedOffer.offer_id ? editedOffer : o
      )
    );
  };

  const onDeleteOffer = (offer_id) => {
    if(user.accountType==='super_admin') return
    setOffers(prev =>
      prev.filter(o => Number(o.offer_id) !== Number(offer_id))
    );
  };

  const onBusinessUpdated = (updatedBusiness) => {
    setOffers(prev =>
      prev.map(offer => {
        if (offer?.business_id !== updatedBusiness?.id) return offer;

        return {
          ...offer,
          business_name: updatedBusiness?.name,
          business_logo: updatedBusiness?.logo,
          business_category_name:updatedBusiness?.category_name
        };
      })
    );
  };

  socket.on('newOffer', onNewOffer);
  socket.on('offerEdited', onEditOffer);
  socket.on('offerDeleted', onDeleteOffer);
  socket.on('business_updated', onBusinessUpdated);

  return () => {
    socket.off('newOffer', onNewOffer);
    socket.off('offerEdited', onEditOffer);
    socket.off('offerDeleted', onDeleteOffer);
    socket.off('business_updated', onBusinessUpdated);
  };
}, []);

    
      if(loading){
        return(
            <Loadiing />
        )
      }

  const tabs = ['Overview'];

  // Filter offers based on category, business name, and search query
  const filteredOffers = offers.filter(offer => {
    const matchesCategory = !category || offer.business_category_name.toLowerCase().includes(category.toLowerCase());
    const matchesBusinessName = !businessName || offer.business_name.toLowerCase().includes(businessName.toLowerCase());
    const matchesSearch = !searchQuery || 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.business_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesBusinessName && matchesSearch;
  });

  const handleResetFilters = () => {
    setCategory('');
    setBusinessName('');
    setSearchQuery('');
  };

  const handleEditOffer = (offer) => {
    setIsOffersDetailsOpen(false)
    setSelectedOffer(offer);
    setIsOfferSheetOpen(true);
  };

  const handleOpenDetail = (offer) => {
    setIsOfferSheetOpen(false)
    setSelectedOffer(offer);
    setIsOffersDetailsOpen(true);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {pageError?(
        <div className="w-full h-full">
          <PageError />
        </div>
      ):(<>
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Posts</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 -mx-6 px-6 overflow-x-auto">
        <div className="flex gap-8 hide-scrollbar min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 whitespace-nowrap font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-[#009842]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">All Categories</option>
              {categories.length>0?(
                categories.map(cat=>(
                  <option key={cat?.id} value={cat?.name}>{cat?.name}</option>
                ))
              ):null}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Business Name */}
          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] text-sm"
          />

          {/* Reset Filter */}
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors text-sm border border-gray-200 rounded-lg hover:bg-red-50 px-4 py-2.5"
          >
            <RotateCcw size={18} />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] text-sm"
          />
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        {offers.length>0&&(<div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-4 text-sm font-semibold text-gray-700">Business</div>
          <div className="col-span-6 text-sm font-semibold text-gray-700">Post / Offer</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Actions</div>
        </div>)}

        {/* Offers Items */}
        <div className="divide-y divide-gray-200">
          {filteredOffers.length === 0 ? (
            <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
              No offers found matching your filters
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer?.offer_id}
                onClick={()=>{
                  handleOpenDetail(offer)
                }}
                className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
              >
                {/* Business */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <img
                        src={offer?.business_logo}
                        className="w-full h-full object-contain "
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{offer?.business_name}</p>
                      <p className="text-xs text-gray-500 truncate">{offer?.business_category_name}</p>
                    </div>
                  </div>
                </div>

                {/* Post/Offer Image - Clickable */}
                <div className="col-span-6">
                  <button className="flex items-start gap-3 w-full text-left hover:opacity-80 transition-opacity">
                    {/* Offer Image Thumbnail */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#009842] to-[#007a36] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={offer?.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm mb-1 truncate">{offer?.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{offer?.description}</p>
                    </div>
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteOffer(setError , setOffers , offer?.offer_id , setCategories
                        )}}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete offer"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditOffer(offer)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit offer"
                    >
                      <Edit size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* OfferSheet Modal - Desktop Styled */}
      {isOfferDetailsOpen && selectedOffer?.offer_id&& (
        <OfferDetailSheet 
          isOpen={isOfferDetailsOpen} 
          onClose={() => {
            setIsOffersDetailsOpen(false);
            setSelectedOffer(null)
          }}
          offerId={selectedOffer?.offer_id}
        /> 
      )}

      {isOfferSheetOpen && selectedOffer?.offer_id&& (
        <OfferSheet 
          isOpen={isOfferSheetOpen} 
          onClose={() => {
            setIsOfferSheetOpen(false);
            setSelectedOffer(null)
          }}
          offerId={selectedOffer?.offer_id}
          setOffers={setOffers}
        /> 
      )}
      </>)}
    </div>
  );
};

export default SA_Posts;