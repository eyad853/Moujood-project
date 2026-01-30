import React, { useEffect } from 'react';
import { Bell, QrCode, TrendingUp, Grid3x3, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import OfferSheet from '../../../components/OfferSheet/OfferSheet';
import { getBusinessDashboardData } from '../../../api/business';
import Loading from '../../../components/Loadiing/Loadiing';
import { useUser } from '../../../context/userContext';
import { useOffer } from '../../../context/offerContext';
import OfferDetailSheet from '../../../components/OfferDetailSheet/OfferDetailSheet';
import socket from '../../../Socket';

const Business_dashboard = () => {
  const [selectedCategoy , setSelectedCategory]=useState(null)
  const {isOfferSheetOpen, setIsOfferSheetOpen, selectedOffer, setSelectedOffer} = useOffer()
  const [offers , setOffers]=useState([])
  const [totalOffers , setTotalOffers]=useState(0)
  const [totalLikes , setTotalLikes]=useState(0)
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState(false)
  const {user} = useUser() 
  const [categories , setCategories]=useState([])
  const [isOfferDetailsOpen , setIsOffersDetailsOpen]=useState(false)
  const [notificationsCount , setNotificationsCount] = useState(0)
  

  
    useEffect(() => {
    const onNotificationCreated = () => {
          setNotificationsCount(prev=>prev+1)
        };
      
    // 🗑️ Notification deleted
    const onNotificationDeleted = () => {
      setNotificationsCount(prev=>prev-1)
    };

    socket.on("notification_created", onNotificationCreated);
    socket.on("notification_deleted", onNotificationDeleted);
  
    // 🔹 Cleanup
    return () => {
      socket.off("notification_created", onNotificationCreated);
      socket.off("notification_deleted", onNotificationDeleted);
    };
  }, [socket]);
  
  
  
  const filteredOffers = selectedCategoy
  ? offers.filter(o => o.category === selectedCategoy)
  : offers; // no category selected → show all offers

  useEffect(()=>{
    const loadData =async ()=>{
      try{
        setLoading(true)
        await getBusinessDashboardData(setError,setOffers,setTotalOffers,setTotalLikes , setCategories)
      }catch(error){
        setError(error)
      }finally{
        setLoading(false)
      }
    }
    loadData()
  },[])

  
useEffect(()=>{
  console.log(categories);
} , [categories])


  const stats = [
    { id: 3, label: 'Total Offers', value: totalOffers, icon: Grid3x3 },
    { id: 4, label: 'Total Loves', value: totalLikes, icon: Heart },
  ];

  const hasOffers = offers.length > 0;

  if(loading){
    return (
      <div className="fixed inset-0 ">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex w-12 rounded-full overflow-hidden h-12 items-center gap-3">
          <img
            src={user?.logo}
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        <div className="flex-1 flex justify-center">
          <img src="/logo.svg" className="h-10 object-contain" />
        </div>

        <Link to={'/Business/notifications'} className="relative">
          <Bell size={24} className="text-gray-700" />
          {notificationsCount>0&&
            (<span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009842] text-white text-xs rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>)}
        </Link>
      </div>

      {/* Main Content */}
      <div className="py-6">
        {/* Stats Grid */}
        <div className="px-3 flex flex-col gap-3 mb-6">
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
              {categories?.map((category, index) => (
                <button
                  onClick={()=>{
                    setSelectedCategory(
                      category.id === selectedCategoy ? null : category.id
                    );
                  }}
                  key={category?.id}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategoy === category.id
                      ? 'bg-[#009842] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
                  }`}
                >
                  <span className="text-lg">{category?.icon}</span>
                  <span className="font-medium text-sm">{category?.name}</span>
                </button>
              ))}
            </div>

            {/* Offers Grid */}
            <div className="grid grid-cols-2 gap-1 mb-6">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.offer_id}
                  onClick={()=>{
                    setSelectedOffer(offer)
                    setIsOffersDetailsOpen(true)
                  }}
                  className="relative bg-[#01a347] rounded-md overflow-hidden shadow-lg aspect-square"
                >
                  <img src={offer.image} className='w-full h-full object-contain' />
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
      {isOfferSheetOpen&&(
      <OfferSheet
        isOpen={isOfferSheetOpen}
        onClose={() => setIsOfferSheetOpen(false)}
        offerId={selectedOffer?.offer_id}
        setOffers={setOffers}
        setTotalOffers={setTotalOffers}
        setFuncUsedCategories={setCategories}
      />)}

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
    </div>
  );
};

export default Business_dashboard;