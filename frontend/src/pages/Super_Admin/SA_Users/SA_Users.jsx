import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';

const SA_Users = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState('');

  const tabs = ['Overview', 'Add New Notification', 'Offers', 'Segment', 'Custom'];

  // Fake users data
  const users = [
    {
      id: 1,
      user_id: '012343',
      name: 'User Name',
      email: 'User@gmail.com',
      gender: 'male',
      city: 'Cairo',
      scans: 200,
      location: 'Cairo',
      avatar: 'https://ui-avatars.com/api/?name=User+Name&background=random'
    },
    {
      id: 2,
      user_id: '012343',
      name: 'User Name',
      email: 'User@gmail.com',
      gender: 'female',
      city: 'Cairo',
      scans: 200,
      location: 'Cairo',
      avatar: 'https://ui-avatars.com/api/?name=User+Name&background=random'
    },
    {
      id: 3,
      user_id: '012343',
      name: 'User Name',
      email: 'User@gmail.com',
      gender: 'male',
      city: 'Cairo',
      scans: 200,
      location: 'Cairo',
      avatar: 'https://ui-avatars.com/api/?name=User+Name&background=random'
    },
    {
      id: 4,
      user_id: '012343',
      name: 'User Name',
      email: 'User@gmail.com',
      gender: 'female',
      city: 'Cairo',
      scans: 200,
      location: 'Cairo',
      avatar: 'https://ui-avatars.com/api/?name=User+Name&background=random'
    },
    {
      id: 5,
      user_id: '012343',
      name: 'User Name',
      email: 'User@gmail.com',
      gender: 'male',
      city: 'Cairo',
      scans: 200,
      location: 'Cairo',
      avatar: 'https://ui-avatars.com/api/?name=User+Name&background=random'
    },
    {
      id: 6,
      user_id: '012343',
      name: 'User Name',
      email: 'User@gmail.com',
      gender: 'female',
      city: 'Cairo',
      scans: 200,
      location: 'Cairo',
      avatar: 'https://ui-avatars.com/api/?name=User+Name&background=random'
    },
  ];

  // Statistics data
  const statistics = [
    {
      id: 1,
      title: 'Total User',
      value: '40,689',
      change: '8.5% Up from last Week',
      icon: UsersIcon,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Total Women User',
      value: '40,689',
      change: '8.5% Up from last Week',
      icon: UserCheck,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      id: 3,
      title: 'Total Men User',
      value: '40,689',
      change: '8.5% Up from last Week',
      icon: UserCheck,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
  ];

  const totalPages = 78;
  const itemsPerPage = 9;

  const handleResetFilters = () => {
    setFilterBy('');
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Users</h1>

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
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Filter By */}
          <div className="relative flex-1">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Filter By</option>
              <option value="gender">Gender</option>
              <option value="location">Location</option>
              <option value="scans">Scans</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Reset Filter */}
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors text-sm px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-red-50"
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

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Users List */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-3 text-sm font-semibold text-gray-700">User</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">User ID</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">Scans</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">Location</div>
              <div className="col-span-3 text-sm font-semibold text-gray-700">Email</div>
            </div>

            {/* Users Items */}
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* User */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                      />
                      <span className="font-medium text-gray-900 text-sm truncate">{user.name}</span>
                    </div>
                  </div>

                  {/* User ID */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">ID: {user.user_id}</span>
                  </div>

                  {/* Scans */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-900 font-medium">{user.scans}</span>
                  </div>

                  {/* Location */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">{user.location}</span>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <span className="text-sm text-gray-600 truncate">{user.email}</span>
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

        {/* Statistics Cards */}
        <div className="w-full xl:w-80 flex flex-col gap-4">
          {statistics.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon size={24} className={stat.iconColor} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={16} />
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SA_Users;