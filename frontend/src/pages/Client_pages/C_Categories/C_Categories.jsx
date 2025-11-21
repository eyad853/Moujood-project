import React, { useState } from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const C_Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fake categories data based on updated schema
  const categories = [
    { id: 1, name: 'Transportation', icon: '🚗', parent_id: null },
    { id: 2, name: 'Healthcare', icon: '⚕️', parent_id: null },
    { id: 3, name: 'Shopping', icon: '🛍️', parent_id: null },
    { id: 4, name: 'Services', icon: '🔧', parent_id: null },
    { id: 5, name: 'Entertainment', icon: '🎬', parent_id: null },
    { id: 6, name: 'Food ', icon: '🍔', parent_id: null },
  ];

  // Fake brands data - 10 brands
  const brands = [
    { id: 1, name: 'Brand Name', category: 'Category', image: '/brand1.jpg' },
    { id: 2, name: 'Brand Name', category: 'Category', image: '/brand2.jpg' },
    { id: 3, name: 'Brand Name', category: 'Category', image: '/brand3.jpg' },
    { id: 4, name: 'Brand Name', category: 'Category', image: '/brand4.jpg' },
    { id: 5, name: 'Brand Name', category: 'Category', image: '/brand5.jpg' },
    { id: 6, name: 'Brand Name', category: 'Category', image: '/brand6.jpg' },
    { id: 7, name: 'Brand Name', category: 'Category', image: '/brand7.jpg' },
    { id: 8, name: 'Brand Name', category: 'Category', image: '/brand8.jpg' },
    { id: 9, name: 'Brand Name', category: 'Category', image: '/brand9.jpg' },
    { id: 10, name: 'Brand Name', category: 'Category', image: '/brand10.jpg' },
  ];

  // Fake featured offers for slider - 5 slides
  const featuredOffers = [
    { id: 1, image: '/featured1.jpg', title: 'Featured Offer 1' },
    { id: 2, image: '/featured2.jpg', title: 'Featured Offer 2' },
    { id: 3, image: '/featured3.jpg', title: 'Featured Offer 3' },
    { id: 4, image: '/featured4.jpg', title: 'Featured Offer 4' },
    { id: 5, image: '/featured5.jpg', title: 'Featured Offer 5' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle scroll for slider
  const handleSliderScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const slideWidth = e.target.offsetWidth;
    const newSlide = Math.round(scrollPosition / slideWidth);
    setCurrentSlide(newSlide);
  };

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
          <div className="relative">
            <Bell size={24} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#009842] text-white text-xs rounded-full flex items-center justify-center">
              9
            </span>
          </div>
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
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
            onScroll={handleSliderScroll}
          >
            {featuredOffers.map((offer) => (
              <div
                key={offer.id}
                className="flex-shrink-0 w-full snap-center"
              >
                <div className="bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl h-52 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for featured content */}
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-3">
            {featuredOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  document.querySelector('.snap-x').scrollTo({
                    left: index * document.querySelector('.snap-x').offsetWidth,
                    behavior: 'smooth'
                  });
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-[#009842] w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <button
              onClick={() => navigate('/client/all_categories')}
              className="text-sm text-gray-600 hover:text-[#009842] transition-colors flex items-center gap-1"
            >
              See more
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Categories Grid - Show only 6 */}
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                className="bg-[#009842] rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-[#007a36] transition-colors aspect-square"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <span className="text-white text-xs font-medium text-center">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Brands you may like</h2>
            <button className="text-sm text-gray-600 hover:text-[#009842] transition-colors flex items-center gap-1">
              See more
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Brands Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {brands.map((brand) => (
              <div key={brand.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm">
                {/* Brand Image */}
                <div className="bg-gradient-to-br from-[#009842] to-[#007a36] h-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Brand Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{brand.name}</h3>
                  <p className="text-xs text-gray-500">{brand.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default C_Categories;