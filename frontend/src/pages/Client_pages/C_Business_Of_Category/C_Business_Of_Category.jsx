import React, { useState } from 'react';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const C_Business_Of_Category = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Fake subcategories data (these are child categories)
  const subCategories = [
    { id: 1, name: 'Lorem Ipsum', icon: '🍔', parent_id: categoryId },
    { id: 2, name: 'Lorem Ipsum', icon: '🍕', parent_id: categoryId },
    { id: 3, name: 'Lorem Ipsum', icon: '🍜', parent_id: categoryId },
  ];

  // Fake businesses data based on schema
  const businesses = [
    {
      id: 1,
      name: 'Brand Name',
      email: 'brand1@domain.com',
      category: 'Food',
      logo: '/logo1.jpg',
      description: 'Lorem ipsum dolor sit amet, ultrices sed lorem in, dapibus c',
      addresses: 'Cairo, Egypt',
      number: '+20 123 456 789',
      rating: 5,
      created_at: '2024-01-15'
    },
    {
      id: 2,
      name: 'Brand Name',
      email: 'brand2@domain.com',
      category: 'Food',
      logo: '/logo2.jpg',
      description: 'Lorem ipsum dolor sit amet, ultrices sed lorem in, dapibus c',
      addresses: 'Alexandria, Egypt',
      number: '+20 123 456 790',
      rating: 4.5,
      created_at: '2024-01-14'
    },
    {
      id: 3,
      name: 'Brand Name',
      email: 'brand3@domain.com',
      category: 'Food',
      logo: '/logo3.jpg',
      description: 'Lorem ipsum dolor sit amet, ultrices sed lorem in, dapibus c',
      addresses: 'Giza, Egypt',
      number: '+20 123 456 791',
      rating: 5,
      created_at: '2024-01-13'
    },
    {
      id: 4,
      name: 'Brand Name',
      email: 'brand4@domain.com',
      category: 'Food',
      logo: '/logo4.jpg',
      description: 'Lorem ipsum dolor sit amet, ultrices sed lorem in, dapibus c',
      addresses: 'Mansoura, Egypt',
      number: '+20 123 456 792',
      rating: 4,
      created_at: '2024-01-12'
    },
  ];

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

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
          <h1 className="text-xl font-semibold text-gray-900">Category Items</h1>
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
        {/* Subcategory Filter Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
          {subCategories.map((subCategory, index) => (
            <button
              key={subCategory.id}
              onClick={() => setSelectedSubCategory(subCategory.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                index === 0 || selectedSubCategory === subCategory.id
                  ? 'bg-[#009842] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
              }`}
            >
              <span className="text-base">{subCategory.icon}</span>
              <span className="font-medium text-sm">{subCategory.name}</span>
            </button>
          ))}
        </div>

        {/* Businesses List */}
        <div className="space-y-3">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/client/business/${business.id}`)}
            >
              {/* Business Logo */}
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-xs font-medium">logo</span>
              </div>

              {/* Business Info */}
              <div className="flex-1 text-white">
                <h3 className="text-lg font-bold mb-1">{business.name}</h3>
                <p className="text-sm opacity-90 mb-2 line-clamp-2">
                  {business.description}
                </p>
                
                {/* Rating Stars */}
                <div className="flex gap-1">
                  {renderStars(business.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No businesses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default C_Business_Of_Category;