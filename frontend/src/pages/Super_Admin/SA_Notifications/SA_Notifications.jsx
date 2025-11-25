import React, { useState } from 'react';
import { Plus, Send, Filter, RotateCcw, ChevronDown, Search, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

const SA_Notifications = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [recipientType, setRecipientType] = useState('users'); // 'users' or 'businesses'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filterBy, setFilterBy] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipient_type: 'users',
    filter_type: 'all', // 'all', 'city', 'gender', 'category', 'specific'
    filter_value: '',
    specific_names: [] // Changed from specific_ids to specific_names
  });

  const [editingNotification, setEditingNotification] = useState(null);

  // Fake users data for search
  const fakeUsers = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@email.com', city: 'Cairo', gender: 'male' },
    { id: 2, name: 'Fatima Ali', email: 'fatima@email.com', city: 'Alexandria', gender: 'female' },
    { id: 3, name: 'Mohamed Ibrahim', email: 'mohamed@email.com', city: 'Giza', gender: 'male' },
    { id: 4, name: 'Nour Mahmoud', email: 'nour@email.com', city: 'Cairo', gender: 'female' },
    { id: 5, name: 'Omar Khaled', email: 'omar@email.com', city: 'Mansoura', gender: 'male' },
  ];

  // Fake businesses data for search
  const fakeBusinesses = [
    { id: 1, name: 'Pizza House', email: 'pizza@business.com', category: 'Food & Dining' },
    { id: 2, name: 'Fashion Store', email: 'fashion@business.com', category: 'Retail' },
    { id: 3, name: 'Medical Center', email: 'medical@business.com', category: 'Healthcare' },
    { id: 4, name: 'Coffee Shop', email: 'coffee@business.com', category: 'Food & Dining' },
  ];

  // Fake notifications data for users (matching schema)
  const userNotifications = [
    {
      id: 1,
      title: 'New Offers Available',
      message: 'Check out the latest offers in your area',
      target: 'All Users',
      status: 'Sent',
      sent_date: '2024-01-15 10:30 AM',
      recipients_count: 40689,
      receiver_type: 'user'
    },
    {
      id: 2,
      title: 'Weekend Special',
      message: 'Get 50% off on all restaurants this weekend',
      target: 'Cairo Users',
      status: 'Sent',
      sent_date: '2024-01-14 09:00 AM',
      recipients_count: 15000,
      receiver_type: 'user'
    },
    {
      id: 3,
      title: 'Welcome!',
      message: 'Welcome to Maujood, start exploring offers',
      target: 'Female Users',
      status: 'Sent',
      sent_date: '2024-01-13 08:30 AM',
      recipients_count: 20000,
      receiver_type: 'user'
    },
  ];

  // Fake notifications data for businesses (matching schema)
  const businessNotifications = [
    {
      id: 1,
      title: 'Update Your Profile',
      message: 'Keep your business profile up to date to attract more customers',
      target: 'All Businesses',
      status: 'Sent',
      sent_date: '2024-01-15 11:00 AM',
      recipients_count: 2040,
      receiver_type: 'business'
    },
    {
      id: 2,
      title: 'New Features Available',
      message: 'Check out the new analytics dashboard',
      target: 'Food & Dining Category',
      status: 'Sent',
      sent_date: '2024-01-14 02:00 PM',
      recipients_count: 500,
      receiver_type: 'business'
    },
  ];

  const notifications = recipientType === 'users' ? userNotifications : businessNotifications;
  const totalPages = 78;

  const handleResetFilters = () => {
    setFilterBy('');
    setCategory('');
    setSubCategory('');
    setCity('');
    setGender('');
    setSearchQuery('');
  };

  const handleAddNotification = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      recipient_type: recipientType,
      filter_type: 'all',
      filter_value: '',
      specific_names: []
    });
    setView('form');
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      recipient_type: recipientType,
      filter_type: 'all',
      filter_value: '',
      specific_names: []
    });
    setView('form');
  };

  const handleSendNotification = () => {
    console.log('Send notification:', formData);
    // Add send logic here
    setView('list');
  };

  const handleDeleteNotification = (notificationId) => {
    console.log('Delete notification:', notificationId);
    // Add delete logic here
  };

  // Form View
  if (view === 'form') {
    return (
      <div className="w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setView('list')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingNotification ? 'Edit Notification' : 'Send Notification'}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
          {/* Recipient Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Send To
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, recipient_type: 'users' }))}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.recipient_type === 'users'
                    ? 'bg-[#009842] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, recipient_type: 'businesses' }))}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.recipient_type === 'businesses'
                    ? 'bg-[#009842] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Businesses
              </button>
            </div>
          </div>

          {/* Filter Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Target Audience
            </label>
            <select
              value={formData.filter_type}
              onChange={(e) => setFormData(prev => ({ ...prev, filter_type: e.target.value, filter_value: '' }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
            >
              <option value="all">All {formData.recipient_type === 'users' ? 'Users' : 'Businesses'}</option>
              {formData.recipient_type === 'users' ? (
                <>
                  <option value="city">Specific City</option>
                  <option value="gender">Specific Gender</option>
                </>
              ) : (
                <>
                  <option value="category">Specific Category</option>
                  <option value="subcategory">Specific Sub-Category</option>
                </>
              )}
              <option value="specific">Specific Names</option>
            </select>
          </div>

          {/* Filter Value - Show based on filter type */}
          {formData.filter_type === 'city' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select City
              </label>
              <select
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
              >
                <option value="">Choose City</option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Giza">Giza</option>
                <option value="Mansoura">Mansoura</option>
              </select>
            </div>
          )}

          {formData.filter_type === 'gender' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Gender
              </label>
              <select
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
              >
                <option value="">Choose Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          )}

          {formData.filter_type === 'category' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Category
              </label>
              <select
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
              >
                <option value="">Choose Category</option>
                <option value="food">Food & Dining</option>
                <option value="retail">Retail</option>
                <option value="healthcare">Healthcare</option>
                <option value="services">Services</option>
              </select>
            </div>
          )}

          {formData.filter_type === 'subcategory' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Sub-Category
              </label>
              <select
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
              >
                <option value="">Choose Sub-Category</option>
                <optgroup label="Food & Dining">
                  <option value="fast-food">Fast Food</option>
                  <option value="restaurants">Restaurants</option>
                  <option value="cafes">Cafes</option>
                  <option value="desserts">Desserts</option>
                </optgroup>
                <optgroup label="Retail">
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="home-decor">Home Decor</option>
                </optgroup>
                <optgroup label="Healthcare">
                  <option value="clinics">Clinics</option>
                  <option value="pharmacies">Pharmacies</option>
                  <option value="labs">Labs</option>
                </optgroup>
                <optgroup label="Services">
                  <option value="beauty">Beauty & Spa</option>
                  <option value="repairs">Repairs</option>
                  <option value="cleaning">Cleaning</option>
                </optgroup>
              </select>
            </div>
          )}

          {formData.filter_type === 'specific' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Search {formData.recipient_type === 'users' ? 'Users' : 'Businesses'} by Name
              </label>
              <input
                type="text"
                placeholder={`Search for ${formData.recipient_type === 'users' ? 'user' : 'business'} names...`}
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842]"
              />
              
              {/* Search Results Dropdown */}
              {formData.filter_value && (
                <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                  {(formData.recipient_type === 'users' ? fakeUsers : fakeBusinesses)
                    .filter(item => item.name.toLowerCase().includes(formData.filter_value.toLowerCase()))
                    .map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            filter_value: item.name,
                            specific_names: [...new Set([...prev.specific_names, item.name])]
                          }));
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </button>
                    ))}
                </div>
              )}

              {/* Selected Names */}
              {formData.specific_names.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.specific_names.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm"
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            specific_names: prev.specific_names.filter((_, i) => i !== index)
                          }));
                        }}
                        className="hover:text-green-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notification Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              placeholder="Enter notification title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842]"
            />
          </div>

          {/* Notification Message */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Notification Message
            </label>
            <textarea
              placeholder="Enter notification message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows="5"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSendNotification}
              className="flex-1 flex items-center justify-center gap-2 bg-[#009842] text-white py-3 rounded-lg font-semibold hover:bg-[#007a36] transition-colors"
            >
              <Send size={20} />
              {editingNotification ? 'Update Notification' : 'Send Notification'}
            </button>
            <button
              onClick={() => setView('list')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={handleAddNotification}
          className="flex items-center gap-2 bg-[#009842] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#007a36] transition-colors"
        >
          <Plus size={20} />
          Add Notification
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setRecipientType('users')}
            className={`pb-3 px-1 font-medium relative ${
              recipientType === 'users' ? 'text-[#009842]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Notifications
            {recipientType === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
            )}
          </button>
          <button
            onClick={() => setRecipientType('businesses')}
            className={`pb-3 px-1 font-medium relative ${
              recipientType === 'businesses' ? 'text-[#009842]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Business Notifications
            {recipientType === 'businesses' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
            )}
          </button>
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
              <option value="status">Status</option>
              <option value="date">Date</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {recipientType === 'users' ? (
            <>
              {/* City */}
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
                >
                  <option value="">City</option>
                  <option value="cairo">Cairo</option>
                  <option value="alexandria">Alexandria</option>
                  <option value="giza">Giza</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Gender */}
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </>
          ) : (
            <>
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

              {/* Sub-Category */}
              <div className="relative">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
                >
                  <option value="">Sub-Category</option>
                  <option value="fast-food">Fast Food</option>
                  <option value="restaurants">Restaurants</option>
                  <option value="cafes">Cafes</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </>
          )}

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

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-2 text-sm font-semibold text-gray-700">Title</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Message</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Target</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Recipients</div>
          <div className="col-span-1 text-sm font-semibold text-gray-700">Status</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">Date</div>
          <div className="col-span-1 text-sm font-semibold text-gray-700">Actions</div>
        </div>

        {/* Notifications Items */}
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Title */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 text-sm">{notification.title}</span>
              </div>

              {/* Message */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600 line-clamp-1">{notification.message}</span>
              </div>

              {/* Target */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600">{notification.target}</span>
              </div>

              {/* Recipients */}
              <div className="col-span-2">
                <span className="text-sm text-gray-900 font-medium">
                  {notification.recipients_count.toLocaleString()}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  {notification.status}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600">{notification.sent_date}</span>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditNotification(notification)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit notification"
                  >
                    <Edit size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 size={18} className="text-gray-600" />
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
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SA_Notifications;