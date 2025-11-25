import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';

const SA_Posts = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [businessName, setBusinessName] = useState('');

  const tabs = ['Overview', 'Add New Notification', 'Offers', 'Segment', 'Custom'];

  // Fake offers data based on schema
  const offers = [
    {
      offer_id: 1,
      business: {
        id: 1,
        name: 'Pizza Paradise',
        logo: '/logo.svg',
        category: 'Food & Dining'
      },
      title: 'Summer Pizza Special',
      description: 'Get 50% off on all large pizzas this summer. Limited time offer!',
      image: '/offer1.jpg',
      offer_price_before: 150.00,
      offer_price_after: 75.00,
      category: 'Fast Food',
      location: 'Cairo',
      created_at: '2024-01-15'
    },
    {
      offer_id: 2,
      business: {
        id: 2,
        name: 'Fashion Hub',
        logo: '/logo.svg',
        category: 'Retail'
      },
      title: 'Weekend Fashion Sale',
      description: 'Amazing discounts on all clothing items. Don\'t miss out!',
      image: '/offer2.jpg',
      offer_price_before: 500.00,
      offer_price_after: 350.00,
      category: 'Clothing',
      location: 'Alexandria',
      created_at: '2024-01-14'
    },
    {
      offer_id: 3,
      business: {
        id: 3,
        name: 'Health Plus Clinic',
        logo: '/logo.svg',
        category: 'Healthcare'
      },
      title: 'Free Health Checkup',
      description: 'Get your complete health checkup absolutely free this month',
      image: '/offer3.jpg',
      offer_price_before: 200.00,
      offer_price_after: 0.00,
      category: 'Clinics',
      location: 'Giza',
      created_at: '2024-01-13'
    },
    {
      offer_id: 4,
      business: {
        id: 4,
        name: 'Coffee Corner',
        logo: '/logo.svg',
        category: 'Food & Dining'
      },
      title: 'Buy 1 Get 1 Free',
      description: 'Buy any coffee and get another one free. Valid on all sizes',
      image: '/offer4.jpg',
      offer_price_before: 40.00,
      offer_price_after: 20.00,
      category: 'Cafes',
      location: 'Cairo',
      created_at: '2024-01-12'
    },
    {
      offer_id: 5,
      business: {
        id: 5,
        name: 'Tech Store',
        logo: '/logo.svg',
        category: 'Retail'
      },
      title: 'Electronics Mega Sale',
      description: 'Up to 40% off on all electronic gadgets and accessories',
      image: '/offer5.jpg',
      offer_price_before: 2000.00,
      offer_price_after: 1200.00,
      category: 'Electronics',
      location: 'Cairo',
      created_at: '2024-01-11'
    },
  ];

  const totalPages = 78;
  const itemsPerPage = 9;

  const handleResetFilters = () => {
    setFilterBy('');
    setCategory('');
    setSubCategory('');
    setBusinessName('');
    setSearchQuery('');
  };

  const handleDeleteOffer = (offerId) => {
    console.log('Delete offer:', offerId);
    // Add delete logic here
  };

  const handleEditOffer = (offerId) => {
    console.log('Edit offer:', offerId);
    // Add edit logic here
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Posts</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 -mx-6 px-6 overflow-x-auto">
        <div className="flex gap-8 hide-scrollbar min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 whitespace-nowrap font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-[#009842]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Filter By */}
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Filter By</option>
              <option value="category">Category</option>
              <option value="location">Location</option>
              <option value="business">Business</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Category</option>
              <option value="food">Food & Dining</option>
              <option value="retail">Retail</option>
              <option value="healthcare">Healthcare</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sub Category */}
          <div className="relative">
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Sub category</option>
              <option value="fast-food">Fast Food</option>
              <option value="restaurants">Restaurants</option>
              <option value="cafes">Cafes</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Business Name */}
          <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] text-sm"
          />

          {/* Reset Filter */}
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors text-sm border border-gray-200 rounded-lg hover:bg-red-50 px-4 py-2.5"
          >
            <RotateCcw size={18} />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] text-sm"
          />
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-3 text-sm font-semibold text-gray-700">Business</div>
          <div className="col-span-3 text-sm font-semibold text-gray-700">Offer Title</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Location</div>
          <div className="col-span-3 text-sm font-semibold text-gray-700">Post / Offer</div>
          <div className="col-span-1 text-sm font-semibold text-gray-700">Actions</div>
        </div>

        {/* Offers Items */}
        <div className="divide-y divide-gray-200">
          {offers.map((offer) => (
            <div
              key={offer.offer_id}
              className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Business */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#009842] rounded-full flex items-center justify-center flex-shrink-0">
                    <img
                      src={offer.business.logo}
                      alt={offer.business.name}
                      className="w-6 h-6 object-contain brightness-0 invert"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{offer.business.name}</p>
                    <p className="text-xs text-gray-500 truncate">{offer.business.category}</p>
                  </div>
                </div>
              </div>

              {/* Offer Title */}
              <div className="col-span-3">
                <p className="font-medium text-gray-900 text-sm mb-1">{offer.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{offer.description}</p>
              </div>

              {/* Location */}
              <div className="col-span-2">
                <p className="text-sm text-gray-600">{offer.location}</p>
              </div>

              {/* Post/Offer Image */}
              <div className="col-span-3">
                <div className="flex items-start gap-3">
                  {/* Offer Image Thumbnail */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#009842] to-[#007a36] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-white text-2xl">
                            📢
                          </div>
                        `;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-1 truncate">{offer.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">{offer.description}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteOffer(offer.offer_id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete offer"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                  <button
                    onClick={() => handleEditOffer(offer.offer_id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit offer"
                  >
                    <Edit size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600 text-center sm:text-left">
            Showing 1-09 of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(Math.ceil(totalPages / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(totalPages / itemsPerPage)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SA_Posts;