import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Loadiing from '../../../components/Loadiing/Loadiing';
import { getAds } from '../../../api/ads';
import {getAllCategories} from '../../../api/categories'
import { fetchNotificationCount } from '../../../api/notifications';
import { useUser } from '../../../context/userContext';
import { FaUser } from 'react-icons/fa6';
import PageError from '../../../components/PageError/PageError';
import { useTranslation } from 'react-i18next'


const C_Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  // const [categories , setCategories]=useState([])
  const [ads , setAds]=useState([])
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [categories , setCategories]=useState([])
  const [notificationsCount , setNotificationsCount] = useState(0)
  const {user}=useUser()
  const [currentSlide, setCurrentSlide] = useState(1);
  const [sliderElement, setSliderElement] = useState(null);
  const isJumpingRef = useRef(false)
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);
  const { t , i18n } = useTranslation("categories")
  const isRTL = i18n.language === "ar"; // true if Arabic


const extendedAds = ads.length
  ? [ads[ads.length - 1], ...ads, ads[0]]
  : [];

  const realIndex =
  currentSlide === 0
    ? ads.length - 1
    : currentSlide === extendedAds.length - 1
    ? 0
    : currentSlide - 1;

const canAutoScroll = ads.length > 1;

  
  

  useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        // await getAllCategories(setError , setCategories)
        await getAds(setError , setAds)
        await getAllCategories(setError , setCategories)
        await fetchNotificationCount(user?.accountType , setNotificationsCount , setError)
      }catch(error){
        setError(error)
      }finally{
        setLoading(false)
      }
    }
    get()
  },[user])

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


  if(loading){
    return (
      <div className="fixed inset-0">
        <Loadiing />
      </div>
    )
  }

   const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {error?(
        <PageError error={error}/>
      ):(<>
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          {/* User Avatar */}
          <div className="flex w-12 rounded-full overflow-hidden h-12 items-center gap-3">
            {user?.avatar?(
              <img
              src={user?.avatar}
              className="w-full h-full rounded-full object-cover"
            />):(
              <div className="w-full h-full border border-neutral-300  overflow-hidden rounded-full flex justify-center items-end">
                  <FaUser className='text-[#009842]' size={35}/>
              </div>
            )}
          </div>

          {/* Logo */}
          <img src="/logo.svg" alt="Maujood Logo" className="h-10 object-contain" />

          {/* Notification Bell */}
          <div className="relative">
            <Bell size={24} className="text-gray-700" />
            {notificationsCount>0&&
            (<span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009842] text-white text-xs rounded-full flex items-center justify-center">
              {notificationsCount}
            </span>)}
          </div>
        </div>

        {/* Search Bar */}
        <div className={`relative flex `}>
          <Search size={18} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-gray-400`} />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"} py-2.5 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-[#009842] transition-all text-sm`}
          />
        </div>
      </div>

      {/* Content */}
      <div className={`${ads.length>0?"py-4":'pb-4 pt-2'} px-5 `}>
        {/* Featured Slider */}
        {ads.length>0&&(
          <div className="relative mb-6">
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
                  <img src={ad.image} className='w-full h-full object-cover'/>
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
        </div>)}

        {/* Categories Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t('categories')}</h2>
            <button
              onClick={() => navigate('/client/all_categories')}
              className="text-sm text-gray-600 hover:text-[#009842] transition-colors flex items-center gap-1"
            >
              {t('seeMore')}
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Categories Grid - Show only 6 */}
          {filteredCategories.length>0?(
            <div className="grid grid-cols-3 grid-rows-2 gap-3">
              {filteredCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/client/sub_categories/${category.name}/${category.id}`}
                className="bg-[#009842] w-27 h-30 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-[#007a36] transition-colors aspect-square"
              >
                <img src={category?.image} />
                <span className="text-white text-xs font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        ):(
          <div className="flex justify-center items-center text-gray-500">{t('noCategories')}</div>
        )}
        </div>

        {/* Brands Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{t('Brands')}</h2>
            <button 
            onClick={() => navigate('/client/all_categories')}
            className="text-sm text-gray-600 hover:text-[#009842] transition-colors flex items-center gap-1">
              {t('seeMore')}
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Brands Horizontal Scroll */}
          {filteredCategories.length>0?(<div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {filteredCategories.slice(0 , 10).map((category) => (
              <Link 
              key={category.id} 
              to={`/client/sub_categories/${category.name}/${category.id}`}
              className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-sm">
                {/* category Image */}
                <div className="bg-gradient-to-br from-[#009842] to-[#007a36] h-40 flex items-center justify-center">
                  <div className="w-30 h-30 bg-white/20 rounded-xl flex items-center justify-center">
                    <img src={category.image} className='w-full rounded-xl h-full object-cover' alt="" />
                  </div>
                </div>

                {/* category Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>):(
            <div className="flex justify-center items-center text-gray-500">{t("noCategories")}</div>
          )}
        </div>
      </div>
      </>)}
    </div>
  );
};

export default C_Categories;