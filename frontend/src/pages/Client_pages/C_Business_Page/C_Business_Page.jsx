import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const C_Business_Page = () => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // Fake business data
  const business = {
    id: 1,
    name: 'Amazing T-Shirt',
    email: 'business@domain.com',
    category: 'Fashion',
    logo: '/logo.svg',
    description: 'The perfect T-shirt for when you want to feel comfortable but still stylish. Amazing for all occasions. Made of 100% cotton fabric in four colours. Its modern style gives a lighter look to the outfit. Perfect for the warmest days.',
    addresses: 'The perfect T-shirt for when you want to feel comfortable but still stylish. Amazing for all occasions.',
    locations: 'Cairo, Egypt',
    number: '+20 123 456 789',
    qr_code: '/qr-code.png',
    likes_count: 125,
    created_at: '2024-01-15'
  };

  // Fake subcategories for this business
  const subCategories = [
    { id: 1, name: 'Lorem Ipsum', icon: '🍔', parent_id: 1 },
    { id: 2, name: 'Lorem Ipsum', icon: '🍕', parent_id: 1 },
    { id: 3, name: 'Lorem Ipsum', icon: '🍜', parent_id: 1 },
  ];

  // Fake offers data (10 offers)
  const offers = [
    {
      offer_id: 1,
      business_id: 1,
      title: 'Summer Sale Offer',
      description: 'Get 50% off on all items',
      image: '/offer1.jpg', // Full green poster image
      offer_price_before: 100.00,
      offer_price_after: 50.00,
      category: 'Fashion',
      created_at: '2024-01-15'
    },
    {
      offer_id: 2,
      business_id: 1,
      title: 'Weekend Special',
      description: 'Buy 2 Get 1 Free',
      image: '/offer2.jpg',
      offer_price_before: 150.00,
      offer_price_after: 100.00,
      category: 'Fashion',
      created_at: '2024-01-14'
    },
    {
      offer_id: 3,
      business_id: 1,
      title: 'New Arrival Discount',
      description: '30% off on new collection',
      image: '/offer3.jpg',
      offer_price_before: 200.00,
      offer_price_after: 140.00,
      category: 'Fashion',
      created_at: '2024-01-13'
    },
    {
      offer_id: 4,
      business_id: 1,
      title: 'Flash Sale',
      description: 'Limited time offer - 40% off',
      image: '/offer4.jpg',
      offer_price_before: 120.00,
      offer_price_after: 72.00,
      category: 'Fashion',
      created_at: '2024-01-12'
    },
    {
      offer_id: 5,
      business_id: 1,
      title: 'Student Discount',
      description: 'Show your ID and get 25% off',
      image: '/offer5.jpg',
      offer_price_before: 80.00,
      offer_price_after: 60.00,
      category: 'Fashion',
      created_at: '2024-01-11'
    },
    {
      offer_id: 6,
      business_id: 1,
      title: 'Bundle Deal',
      description: '3 items for the price of 2',
      image: '/offer6.jpg',
      offer_price_before: 300.00,
      offer_price_after: 200.00,
      category: 'Fashion',
      created_at: '2024-01-10'
    },
    {
      offer_id: 7,
      business_id: 1,
      title: 'Clearance Sale',
      description: 'Up to 60% off on selected items',
      image: '/offer7.jpg',
      offer_price_before: 250.00,
      offer_price_after: 100.00,
      category: 'Fashion',
      created_at: '2024-01-09'
    },
    {
      offer_id: 8,
      business_id: 1,
      title: 'VIP Member Offer',
      description: 'Exclusive 35% discount',
      image: '/offer8.jpg',
      offer_price_before: 180.00,
      offer_price_after: 117.00,
      category: 'Fashion',
      created_at: '2024-01-08'
    },
    {
      offer_id: 9,
      business_id: 1,
      title: 'Black Friday Deal',
      description: 'Massive savings - 55% off',
      image: '/offer9.jpg',
      offer_price_before: 220.00,
      offer_price_after: 99.00,
      category: 'Fashion',
      created_at: '2024-01-07'
    },
    {
      offer_id: 10,
      business_id: 1,
      title: 'Loyalty Reward',
      description: 'Thank you offer - 20% off',
      image: '/offer10.jpg',
      offer_price_before: 150.00,
      offer_price_after: 120.00,
      category: 'Fashion',
      created_at: '2024-01-06'
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    console.log('Share business');
    // Add share logic here
  };

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
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Business Info Card */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-start gap-4 mb-4">
            {/* Business Logo */}
            <div className="w-24 h-24 bg-[#009842] rounded-2xl flex items-center justify-center flex-shrink-0">
              <img
                src={business.logo}
                alt={business.name}
                className="w-16 h-16 object-contain brightness-0 invert"
              />
            </div>

            {/* Business Name and Actions */}
            <div className="flex-1 pt-2">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 text-gray-700"
                >
                  <Heart
                    size={20}
                    className={isLiked ? 'fill-red-500 text-red-500' : ''}
                  />
                  <span className="text-sm font-medium">{business.likes_count}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-[#009842] rounded-full hover:bg-[#007a36] transition-colors"
                >
                  <Share2 size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Address Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Adress</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {business.addresses}
            </p>
          </div>

          {/* Location Button */}
          <button className="w-full bg-[#1A423A] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#153530] transition-colors">
            <MapPin size={20} />
            <span>Location</span>
          </button>
        </div>
      </div>

      {/* Subcategory Filter Pills */}
      <div className="px-5 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {subCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                index === 0 || selectedCategory === category.id
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
          {offers.map((offer) => (
            <button
              key={offer.offer_id}
              onClick={() => navigate(`/client/offer/${offer.offer_id}`)}
              className="relative aspect-[9/14] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Offer Image - Full Poster */}
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback: show a placeholder green poster
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-[#009842]', 'to-[#007a36]');
                  e.target.parentElement.innerHTML += `
                    <div class="absolute inset-0 flex items-center justify-center text-white p-4">
                      <div class="text-center">
                        <div class="mb-4">
                          <img src="/logo.svg" alt="Logo" class="h-8 mx-auto brightness-0 invert" />
                        </div>
                        <h3 class="text-lg font-bold mb-2">جعلوة<br/>مختار تاكل آية</h3>
                        <div class="text-4xl mb-4">👨</div>
                        <p class="text-xs opacity-75">www.maujood.net</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default C_Business_Page;