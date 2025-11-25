import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const SA_Businesses = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const tabs = ['Overview', 'New Businesses', 'Offers', 'Segment', 'Custom'];

  // Fake businesses data
  const businesses = [
    {
      id: 1,
      logo: '/logo.svg',
      name: 'Christine Brooks',
      email: 'christine@business.com',
      category: 'Kutch Green Apt.',
      addresses: 'Cairo, Egypt',
      number: '+20 123 456 789',
      offers_scanned: '10k',
      status: 'not_active',
      created_at: '2024-01-15'
    },
    {
      id: 2,
      logo: '/logo.svg',
      name: 'Rosie Pearson',
      email: 'rosie@business.com',
      category: 'Immanuel Ferry Suite',
      addresses: 'Alexandria, Egypt',
      number: '+20 123 456 790',
      offers_scanned: '10k',
      status: 'active',
      created_at: '2024-01-14'
    },
    {
      id: 3,
      logo: '/logo.svg',
      name: 'Darrell Caldwell',
      email: 'darrell@business.com',
      category: 'Frida Ports',
      addresses: 'Giza, Egypt',
      number: '+20 123 456 791',
      offers_scanned: '10k',
      status: 'active',
      created_at: '2024-01-13'
    },
    {
      id: 4,
      logo: '/logo.svg',
      name: 'Gilbert Johnston',
      email: 'gilbert@business.com',
      category: 'Destiny Lake Suite',
      addresses: 'Mansoura, Egypt',
      number: '+20 123 456 792',
      offers_scanned: '10k',
      status: 'active',
      created_at: '2024-01-12'
    },
    {
      id: 5,
      logo: '/logo.svg',
      name: 'Alan Cain',
      email: 'alan@business.com',
      category: 'Mylene Throughway',
      addresses: 'Tanta, Egypt',
      number: '+20 123 456 793',
      offers_scanned: '10k',
      status: 'active',
      created_at: '2024-01-11'
    },
    {
      id: 6,
      logo: '/logo.svg',
      name: 'Alan Cain',
      email: 'alan2@business.com',
      category: 'Mylene Throughway',
      addresses: 'Aswan, Egypt',
      number: '+20 123 456 794',
      offers_scanned: '10k',
      status: 'active',
      created_at: '2024-01-10'
    },
  ];

  const totalPages = 78;
  const itemsPerPage = 9;

  const handleResetFilters = () => {
    setFilterBy('');
    setCategory('');
    setSubCategory('');
    setOrderStatus('');
    setSearchQuery('');
  };

  const handleActivate = (businessId) => {
    console.log('Activate business:', businessId);
    // Add activation logic here
  };

  const handleDeactivate = (businessId) => {
    console.log('Deactivate business:', businessId);
    // Add deactivation logic here
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Businesses</h1>

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
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="status">Status</option>
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
              <option value="services">Services</option>
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

          {/* Order Status */}
          <div className="relative">
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Order Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

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

      {/* Businesses List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-11 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-1 text-sm font-semibold text-gray-700">Logo</div>
          <div className="col-span-3 text-sm font-semibold text-gray-700">Business Name</div>
          <div className="col-span-3 text-sm font-semibold text-gray-700">Category</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Offers Scaned</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">STATUS</div>
        </div>

        {/* Businesses Items */}
        <div className="divide-y divide-gray-200">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="grid grid-cols-11 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Logo */}
              <div className="col-span-1">
                <div className="w-12 h-12 bg-[#009842] rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-8 h-8 object-contain brightness-0 invert"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div className="col-span-3">
                <span className="font-medium text-gray-900 text-sm">{business.name}</span>
              </div>

              {/* Category */}
              <div className="col-span-3">
                <span className="text-sm text-gray-600">{business.category}</span>
              </div>

              {/* Offers Scanned */}
              <div className="col-span-2">
                <span className="text-sm text-gray-900 font-medium">{business.offers_scanned}</span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`inline-block px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  business.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {business.status === 'active' ? 'Active' : 'Not Active'}
                </span>
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

export default SA_Businesses;