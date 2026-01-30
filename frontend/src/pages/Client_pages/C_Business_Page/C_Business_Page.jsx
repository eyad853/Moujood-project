import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBusinessPageData } from '../../../api/cleints';
import Loadiing from '../../../components/Loadiing/Loadiing';
import OfferDetailSheet from '../../../components/OfferDetailSheet/OfferDetailSheet';
import MapModal from '../../../components/modals/MapModal/MapModal';
import { useMapProvider } from '../../../context/mapContext';
import { useUser } from '../../../context/userContext';

const C_Business_Page = ({businessId}) => {
  const navigate = useNavigate();
  const { business_id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [offers , setOffers]=useState([])
  const [categories , setCategories]=useState([])
  const [business , setBusiness]=useState({})
  const [isOfferSheetOpen , setIsOfferSheetOpen]=useState(false)
  const [selectedOffer , setSelectedOffer]=useState(null)
  const {showMapModal,setShowMapModal,markers,setMarkers , userLocation, setUserLocation}=useMapProvider()
  const [isShareSheetOpen , setIsShareSheetOpen]=useState(false)
  const {user} = useUser()
  
  

   useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        await getBusinessPageData(setError , setBusiness , setCategories , setOffers , business_id , businessId , setMarkers)
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



const filteredOffers = offers.filter(offer => {
  const matchesCategory =
    !selectedCategory || offer.category === selectedCategory;

  return matchesCategory
});


  if(loading){
    return (
      <div className="fixed inset-0">
        <Loadiing />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Image/Cover */}
      <div className="relative h-44 bg-gray-300">
        {/* Placeholder for business cover image */}
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Back Button */}
        {user?.accountType!=='super_admin'&&(<button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>)}
      </div>

      {/* Business Info Card */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-start gap-4 mb-4">
            {/* Business Logo */}
            <div className="w-24 h-24 bg-[#009842] rounded-2xl flex items-center justify-center flex-shrink-0">
              <img
                src={business.logo}
                className="w-full h-full object-contain "
              />
            </div>

            {/* Business Name and Actions */}
            <div className="flex-1 pt-2">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h1>
              <div className="flex items-center gap-4">
                {user?.accountType!=='super_admin'&&(
                  <button
                  onClick={()=>{
                    setIsShareSheetOpen(true)
                  }}
                  className="p-2 bg-[#009842] rounded-full hover:bg-[#007a36] transition-colors"
                >
                  <Share2 size={18} className="text-white" />
                </button>)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm whitespace-pre-wrap text-gray-600 leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Location Button */}
          <button 
          onClick={()=>{
            setShowMapModal(true)
          }}
          className="w-full bg-[#1A423A] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#153530] transition-colors">
            <MapPin size={20} />
            <span>Location</span>
          </button>
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      <div className="px-5 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                category.id === selectedCategory ? null : category.id
              )}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#009842] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="px-5 mt-6">
        <div className="grid grid-cols-2 gap-3 pb-6">
          {filteredOffers.map((offer) => (
            <button
              key={offer.offer_id}
              onClick={() => {
                setSelectedOffer(offer)
                setIsOfferSheetOpen(true)
              }}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Offer Image - Full Poster */}
              <img
                src={offer.image}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {isOfferSheetOpen && selectedOffer&&(
          <OfferDetailSheet isOpen={isOfferSheetOpen} onClose={()=>{setIsOfferSheetOpen(false)}} offerId={selectedOffer.offer_id}/>
        )}

          <MapModal 
          showMapModal={showMapModal} 
          setShowMapModal={setShowMapModal}
          markers={markers}
          userLocation={userLocation}
        />
    </div>
  );
};

export default C_Business_Page;