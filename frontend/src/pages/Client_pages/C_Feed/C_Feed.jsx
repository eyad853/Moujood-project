import React, { useState } from 'react';
import { Search, Bell, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const C_Feed = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fake data based on your database schema
  const categories = [
    { id: 1, name: 'Lorem Ipsum', icon: '🍔', parent_id: null },
    { id: 2, name: 'Lorem Ipsum', icon: '🏥', parent_id: null },
    { id: 3, name: 'Lorem Ipsum', icon: '🛍️', parent_id: null },
  ];

  const posts = [
    {
      offer_id: 1,
      business: {
        id: 1,
        name: 'Business Name',
        logo: '/logo.svg',
        created_at: '2 hours ago'
      },
      title: 'Offer name',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/offer1.jpg', // This is the full green poster image
      offer_price_before: 100.00,
      offer_price_after: 80.00,
      category: 'Food',
      likes_count: 4000,
      comments_count: 223,
      scans_count: 223,
      created_at: '2024-01-15T10:30:00'
    },
    {
      offer_id: 2,
      business: {
        id: 2,
        name: 'Business Name',
        logo: '/logo.svg',
        created_at: '5 hours ago'
      },
      title: 'Offer name',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/offer2.jpg',
      offer_price_before: 150.00,
      offer_price_after: 120.00,
      category: 'Healthcare',
      likes_count: 4000,
      comments_count: 223,
      scans_count: 223,
      created_at: '2024-01-15T07:30:00'
    },
    {
      offer_id: 3,
      business: {
        id: 3,
        name: 'Business Name',
        logo: '/logo.svg',
        created_at: '1 day ago'
      },
      title: 'Offer name',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/offer3.jpg',
      offer_price_before: 200.00,
      offer_price_after: 150.00,
      category: 'Retail',
      likes_count: 4000,
      comments_count: 223,
      scans_count: 223,
      created_at: '2024-01-14T10:30:00'
    }
  ];

  const handleLike = (offerId) => {
    console.log('Like offer:', offerId);
  };

  const handleComment = (offerId) => {
    console.log('Comment on offer:', offerId);
  };

  const handleSave = (offerId) => {
    console.log('Save offer:', offerId);
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
              3
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
        {/* Stories/Highlights Section - Placeholder */}
        <div className="mb-5 bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl h-40 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm opacity-90">Featured Offers</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                index === 0
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
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.offer_id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Post Header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.business.logo}
                    alt={post.business.name}
                    className="w-10 h-10 rounded-full bg-[#009842] p-1"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{post.business.name}</h3>
                    <p className="text-xs text-gray-500">{post.business.created_at}</p>
                  </div>
                </div>
                <button className="p-2">
                  <Bookmark size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Offer Image - Full Poster (the entire green image with person, text, etc.) */}
              <div className="w-full bg-green-500">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // Fallback: show a placeholder green poster
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23009842" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" fill="white" font-size="24" text-anchor="middle" dominant-baseline="middle"%3EOffer Poster%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Post Footer */}
              <div className="px-4 py-3">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.offer_id)}
                      className="flex items-center gap-1.5 text-gray-700 hover:text-[#009842] transition-colors"
                    >
                      <Heart size={20} />
                      <span className="text-sm font-medium">{post.likes_count >= 1000 ? `${(post.likes_count / 1000).toFixed(1)}k` : post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => handleComment(post.offer_id)}
                      className="flex items-center gap-1.5 text-gray-700 hover:text-[#009842] transition-colors"
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">{post.comments_count}</span>
                    </button>
                  </div>

                  {/* Get Offer Button */}
                  <button className="flex items-center gap-2 bg-[#009842] text-white px-4 py-2 rounded-lg hover:bg-[#007a36] transition-colors">
                    <span className="text-sm font-semibold">Get offer</span>
                    <Share2 size={16} />
                    <span className="text-sm font-semibold">{post.scans_count}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default C_Feed;