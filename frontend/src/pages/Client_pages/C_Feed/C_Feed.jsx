import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { getFeedPageData } from '../../../api/cleints';
import { likeOffer , unlikeOffer } from '../../../api/likes';
import Loadiing from '../../../components/Loadiing/Loadiing'
import CommentSheet from '../../../components/CommentSheet/CommentSheet';
import OfferDetailSheet from '../../../components/OfferDetailSheet/OfferDetailSheet';
import { Link } from 'react-router-dom';
import { fetchNotificationCount } from '../../../api/notifications';
import { useUser } from '../../../context/userContext';
import socket from '../../../Socket';

const C_Feed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory , setSelectedCategory]=useState(null)
  const [ads , setAds]=useState([])
  const [error ,setError]=useState('')
  const [loading , setLoading]=useState(false)
  const [offers , setOffers]=useState([])
  const [categories , setCategories]=useState([])
  const [commentsSheetOpen , setCommnetsSheetOpen]=useState(false)
  const [selectedOffer , setSelectedOffer]=useState(null)
  const [isOfferSheetOpen , setIsOfferSheetOpen]=useState(false)
  const [notificationsCount , setNotificationsCount] = useState(0)
  const [expandedOffers, setExpandedOffers] = useState(new Set())
  const {user}=useUser()
  const [currentSlide, setCurrentSlide] = useState(1);
  const [sliderElement, setSliderElement] = useState(null);
  const isJumpingRef = useRef(false)
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);

  const toggleExpand = (offerId) => {
  setExpandedOffers((prev) => {
    const next = new Set(prev)
    next.has(offerId) ? next.delete(offerId) : next.add(offerId)
    return next
  })
}
  

  const filteredOffers = offers.filter(offer => {
  const matchesCategory =
    !selectedCategory || offer.business_category === selectedCategory;

  const matchesSearch =
    !searchQuery ||
    offer.title.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});

const canAutoScroll = ads.length > 1;


const extendedAds = ads.length
  ? [ads[ads.length - 1], ...ads, ads[0]]
  : [];

  const realIndex =
  currentSlide === 0
    ? ads.length - 1
    : currentSlide === extendedAds.length - 1
    ? 0
    : currentSlide - 1;

  const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) {
      return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

  useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        await getFeedPageData(setError , setOffers , setCategories , setAds)
        await fetchNotificationCount(user?.accountType , setNotificationsCount , setError)
      }catch(error){
        setError(error)
      }finally{
        setLoading(false)
      }
    }

    get()
  },[user])


  const handleLikeToggle = (offer) => {
  if (offer.is_liked) {
    unlikeOffer(
      offer.offer_id,
      offers,
      setOffers,
      setError
    );
  } else {
    likeOffer(
      offer.offer_id,
      offers,
      setOffers,
      setError
    );
  }
};

useEffect(() => {
  if (!extendedAds.length || !sliderElement || isSliderInitialized) return;

  console.log('Initializing slider');
  sliderElement.scrollLeft = sliderElement.offsetWidth;
  setCurrentSlide(1);
  setIsSliderInitialized(true);
}, [extendedAds.length, sliderElement, isSliderInitialized]);



const handleSliderScroll = () => {
  if (!sliderElement || isJumpingRef.current) return;

  const slideWidth = sliderElement.offsetWidth;
  const index = Math.round(sliderElement.scrollLeft / slideWidth);

  if (index === 0) {
    isJumpingRef.current = true;
    sliderElement.scrollLeft = slideWidth * (extendedAds.length - 2);
    setCurrentSlide(extendedAds.length - 2);
    setTimeout(() => { isJumpingRef.current = false; }, 50);
    return;
  }

  if (index === extendedAds.length - 1) {
    isJumpingRef.current = true;
    sliderElement.scrollLeft = slideWidth;
    setCurrentSlide(1);
    setTimeout(() => { isJumpingRef.current = false; }, 50);
    return;
  }

  setCurrentSlide(index);
};

  

// Replace your auto-scroll useEffect with this debugged version:

useEffect(() => {
  if (!extendedAds.length || !sliderElement || !isSliderInitialized || !canAutoScroll) {
    console.log('Auto-scroll waiting...', { 
      ads: extendedAds.length, 
      element: !!sliderElement, 
      init: isSliderInitialized 
    });
    return;
  }

  console.log('✅ Starting auto-scroll');

  const interval = setInterval(() => {
    if (isJumpingRef.current || !sliderElement) return;

    console.log('Scrolling from', currentSlide, 'to', currentSlide + 1);

    sliderElement.scrollTo({
      left: (currentSlide + 1) * sliderElement.offsetWidth,
      behavior: 'smooth',
    });
  }, 3000);

  return () => clearInterval(interval);
}, [currentSlide, extendedAds.length, isSliderInitialized, sliderElement])

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
}, [socket , user]);

const formatLikesAndCommentsCount = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num;
};


  if(loading){
    return (
      <div className="fixed inset-0 ">
        <Loadiing />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          {/* User Avatar */}
          <img
            src="https://ui-avatars.com/api/?name=User&background=009842&color=fff"
            alt="User"
            className="w-12 h-12 rounded-full"
          />

          {/* Logo */}
          <img src="/logo.svg" alt="Maujood Logo" className="h-10 object-contain" />

          {/* Notification Bell */}
          <Link to={`/client/notifications`} className="relative">
            <Bell size={24} className="text-gray-700" />
            {notificationsCount>0&&
            (<span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009842] text-white text-xs rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>)}
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-[#009842] transition-all text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Featured Slider */}
        <div className="mb-6 relative">
          <div 
          ref={setSliderElement}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
            onScroll={handleSliderScroll}
          >
            {extendedAds.map((ad , index) => (
              <div
                key={`${ad.id}-${index}`}
                className="flex-shrink-0 w-full snap-center"
              >
                <div className="bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
                  {/* Placeholder for featured content */}
                  <img src={ad.image} className='w-full h-full object-cover' />
                </div>
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-3">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!sliderElement) return;
                  const slideIndex = index + 1;
                  setCurrentSlide(slideIndex);
                  sliderElement.scrollTo({
                    left: slideIndex * sliderElement.offsetWidth,
                    behavior: 'smooth'
                  });
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === realIndex ? 'bg-[#009842] w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>


        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
          {offers.length>0&&categories.map((category) => (
            <button
            key={category.id}
            onClick={()=>{
              setSelectedCategory(
                category.id === selectedCategory ? null : category.id
              );
            }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category.id === selectedCategory
                  ? 'bg-[#009842] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        {offers?.length>0?(<div className="space-y-4">
          {offers?.length>0&&filteredOffers.map((offer) => (
            <div 
            onClick={()=>{
              setSelectedOffer(offer)
              setIsOfferSheetOpen(true)
            }}
            key={offer?.offer_id} 
            className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Post Header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={offer.business_logo}
                    className="w-10 h-10 rounded-full bg-[#009842] p-1"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{offer?.business_name}</h3>
                    <p className="text-xs text-gray-500">{timeAgo(offer?.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Offer Image - Full Poster (the entire green image with person, text, etc.) */}
              <div className={`w-full relative transition-all duration-300 ${expandedOffers.has(offer.offer_id)? "h-auto": "aspect-square"}`}>
                <img
                  src={offer.image}
                  className={`w-full h-full object-cover `}/>
                  
                  {!expandedOffers.has(offer.offer_id) && (
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    />
                  )}
                
                  {/* Clickable button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(offer.offer_id)
                    }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2
                               bg-white/90 text-[#009842] text-sm font-medium
                               px-4 py-1.5 rounded-full shadow"
                  >
                    {expandedOffers.has(offer.offer_id)
                      ? "Show less"
                      : "Show full image"}
                  </button>
              </div>

              {/* Post Footer */}
              <div className="px-4 py-3">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 mb-2">{offer.title}</h4>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap line-clamp-2">
                  {offer.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()      
                        handleLikeToggle(offer)
                      }}
                      className="flex items-center gap-1.5 text-gray-700 hover:text-[#009842] transition-colors"
                    >
                      {offer.is_liked ? <Heart className="text-red-500 fill-red-500" /> : <Heart />}
                      <span className="text-sm font-medium">{formatLikesAndCommentsCount(offer.likes_count)}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOffer(offer)
                        setCommnetsSheetOpen(true)
                      }}
                      className="flex items-center gap-1.5 text-gray-700 hover:text-[#009842] transition-colors"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">{formatLikesAndCommentsCount(offer.comments_count)}</span>
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>
          ))}
        </div>):(
          <div className="flex justify-center items-center text-gray-500">No Content</div>
        )}
      </div>
      {
        commentsSheetOpen&&(
          <CommentSheet isOpen={commentsSheetOpen} onClose={()=>{setCommnetsSheetOpen(false)}} offerId={selectedOffer.offer_id} setOffers={setOffers}/>
        )
      }
      {
        isOfferSheetOpen && selectedOffer&&(
          <OfferDetailSheet isOpen={isOfferSheetOpen} onClose={()=>{setIsOfferSheetOpen(false)}} offerId={selectedOffer.offer_id}/>
        )
      }
    </div>
  );
};

export default C_Feed;