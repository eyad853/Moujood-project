import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, DollarSign, MapPin } from 'lucide-react';
import { useMapProvider } from '../../context/mapContext'
import Loadiing from '../Loadiing/Loadiing'
import { getOfferSheet } from '../../api/offers';
import MapModal from '../modals/MapModal/MapModal';
import { useUser } from '../../context/userContext';

const OfferDetailSheet = ({ isOpen, onClose , offerId}) => {
    const [offer , setOffer]=useState({})    
    const [error ,setError]=useState('')
    const [loading , setLoading]=useState(false)
    const {showMapModal,setShowMapModal,markers,setMarkers ,userLocation,setUserLocation}=useMapProvider()
    const {user}=useUser()


     useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        await getOfferSheet(offerId , setOffer , setMarkers , setError)
      }catch(error){
        setError(error)
      }finally{
        setLoading(false)
      }
    }

    get()
  },[])

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

    // Get user's current location
useEffect(() => {
  const setLocation = (lat, lng) => {
    setUserLocation({ lat, lng });
  };

  const DEFAULT_LOCATION = { lat: 30.0444, lng: 31.2357 };

  if (!navigator.geolocation) {
    if (markers?.length > 0) {
      setLocation(markers[0].lat, markers[0].lng);
    } else {
      setLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    () => {
      // Geolocation denied / failed
      if (markers?.length > 0) {
        setLocation(markers[0].lat, markers[0].lng);
      } else {
        setLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
      }
    }
  );
}, [markers]);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleOpenMap = () => {
    setMarkers(markers);
    setShowMapModal(true);
  };

  const calculateDiscount = () => {
    if (offer.offer_price_after && offer.offer_price_before !== offer.offer_price_after) {
      return Math.round((1 - offer.offer_price_after / offer.offer_price_before) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();


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
            className="fixed bottom-0 z-50 bg-white rounded-t-3xl h-[90vh] overflow-y-auto hide-scrollbar w-full left-0 right-0 md:w-[390px] md:right-30 md:left-auto
          "
          >
            {loading?(
              <Loadiing />
            ):(<>
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-semibold text-gray-900">Offer Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-6 pb-8">
              {/* Offer Image */}
              {offer?.image && (
                <div className="w-full h-auto bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl overflow-hidden mb-5">
                  <img
                    src={offer?.image}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Business Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Business Information
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#009842] rounded-full flex items-center justify-center flex-shrink-0">
                    {offer?.business_logo ? (
                      <img
                        src={offer?.business_logo}
                        className="w-full h-full rounded-full object-contain"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {offer?.business_name?.charAt(0) || 'B'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-base">
                      {offer?.business_name || 'Business Name'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Offer Title & Description */}
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {offer?.title}
                </h3>
                {offer.description && (
                  <p className="text-gray-600 whitespace-pre-wrap text-base leading-relaxed">
                    {offer?.description}
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-[#009842]/10 to-[#007a36]/10 rounded-2xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={20} className="text-[#009842]" />
                  <p className="text-sm font-semibold text-gray-700">Price</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {offer?.offer_price_after && offer?.offer_price_after !== offer?.offer_price_before ? (
                    <>
                      <span className={`${Number(offer?.offer_price_after)>0?"text-gray-500 line-through":"text-[#009842] font-bold"}  text-xl`}>
                        ${parseFloat(offer?.offer_price_before).toFixed(2)}
                      </span>
                      {Number(offer?.offer_price_after)>0&&(<span className="text-3xl font-bold text-[#009842]">
                        ${parseFloat(offer?.offer_price_after).toFixed(2)}
                      </span>)}
                      {Number(offer.offer_price_after) > 0 && (
                        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-[#009842]">
                      ${parseFloat(offer?.offer_price_before).toFixed(2)}
                    </span>
                  )}
                </div>
                {Number(offer.offer_price_after)>0 && (
                  <p className="text-sm text-green-700 font-medium mt-2">
                    Save ${(parseFloat(offer?.offer_price_before) - parseFloat(offer?.offer_price_after)).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                {/* Location */}
                {offer?.location && (
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-[#009842]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Location
                      </p>
                      <p className="font-medium text-gray-900">
                        {offer.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                {offer?.created_at && (
                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-[#009842]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Posted On
                      </p>
                      <p className="font-medium text-gray-900">
                        {formatDate(offer.created_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Locations Map - MODIFIED SECTION */}
                {user?.accountType!=='business'&&(<div className='my-5' >
                  <button
                    type="button"
                    onClick={()=>handleOpenMap()}
                    style={{
                      width: '100%',
                      height: '180px',
                      borderRadius: '12px',
                      position: 'relative',
                      backgroundColor: '#f0f9f4',
                      border: '2px dashed #009842',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f5ed'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f9f4'}
                  >
                    <MapPin size={40} color="#009842" />
                    <span style={{ color: '#009842', fontWeight: '600', fontSize: '16px' }}>
                      Click to See Locations on Map
                    </span>
                  </button>
                </div>)
                }

                
                <MapModal 
                showMapModal={showMapModal} 
                setShowMapModal={setShowMapModal}
                markers={markers}
                userLocation={userLocation}
                />
                
            </div>
            </>)}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OfferDetailSheet;