import React, { useEffect, useRef, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAds } from '../../../api/ads';
import Loadiing from '../../../components/Loadiing/Loadiing';
import { getSubCategoriesOfCategory } from '../../../api/cleints';
import PageError from '../../../components/PageError/PageError';
import { useTranslation } from 'react-i18next'


const C_Sub_Categories = () => {
  const navigate = useNavigate();
  const {categoryName , categoryId}=useParams()
  const [searchQuery, setSearchQuery] = useState('');
  const [ads , setAds]=useState([])
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [categories , setCategories]=useState([])
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
          await getSubCategoriesOfCategory(setError , setCategories , categoryId)
        }catch(error){
          setError(error)
        }finally{
          setLoading(false)
        }
      }
      get()
    },[])

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
        <div className="flex items-center justify-center relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{t('categories')}</h1>
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
      <div className="px-5 py-4">
        <div className="mb-5 text-2xl text-[#1A423A] font-bold">{categoryName}</div>
        {/* Featured Slider */}
        {ads.length>0&&(<div className="relative mb-6">
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
                  <img src={ad.image} className='w-full h-full object-cover ' />
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

        {/* All Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/client/businesses_of_category/${categoryId}/${category.name}/${category.id}`}
              className="bg-[#009842] rounded-xl p-6 flex flex-col gap-2 items-center justify-center hover:bg-[#007a36] transition-colors aspect-square"
            >
              <img src={category.image} className='w-full h-full object-contain rounded-md'/>
              <span className="text-white text-sm font-semibold text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
      </>)}
    </div>
  );
};

export default C_Sub_Categories;