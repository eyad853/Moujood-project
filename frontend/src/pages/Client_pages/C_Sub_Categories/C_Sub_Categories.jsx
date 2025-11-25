import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const C_Sub_Categories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fake categories data - showing all categories
  const categories = [
    { id: 1, name: 'Transportation', icon: '🚗', parent_id: null },
    { id: 2, name: 'Healthcare', icon: '⚕️', parent_id: null },
    { id: 3, name: 'Shopping', icon: '🛍️', parent_id: null },
    { id: 4, name: 'Services', icon: '🔧', parent_id: null },
    { id: 5, name: 'Entertainment', icon: '🎬', parent_id: null },
    { id: 6, name: 'Food & Dining', icon: '🍔', parent_id: null },
    { id: 7, name: 'Education', icon: '📚', parent_id: null },
    { id: 8, name: 'Fitness', icon: '💪', parent_id: null },
    { id: 9, name: 'Beauty', icon: '💄', parent_id: null },
    { id: 10, name: 'Technology', icon: '💻', parent_id: null },
    { id: 11, name: 'Travel', icon: '✈️', parent_id: null },
    { id: 12, name: 'Home Services', icon: '🏠', parent_id: null },
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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
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
        <div className="mb-5 text-2xl text-[#1A423A] font-bold">Category Name</div>
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
                <div className="bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl h-44 flex items-center justify-center overflow-hidden">
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

        {/* All Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              className="bg-[#009842] rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-[#007a36] transition-colors aspect-square"
            >
              <div className="text-5xl mb-3">{category.icon}</div>
              <span className="text-white text-sm font-semibold text-center">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default C_Sub_Categories;