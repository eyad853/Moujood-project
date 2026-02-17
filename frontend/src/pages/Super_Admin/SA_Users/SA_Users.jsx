import React, { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, TrendingUp, Users, UserCheck, X, TrendingDown } from 'lucide-react';
import { useEffect } from 'react';
import Loadiing from '../../../components/Loadiing/Loadiing'
import { getUserPageData } from '../../../api/super_admin_data';
import { FaUser } from "react-icons/fa";
import socket from '../../../Socket';
import PageError from '../../../components/PageError/PageError';


const SA_Users = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [users , setUsers]=useState([])
  const [loading ,setLoading]=useState(false)
  const [error , setError]=useState('')
  const [totalPercantage , setTotalPercantage]=useState(0)
  const [malePercantage , setMalePercantage]=useState(0)
  const [femalePercantage , setFemalePercantage]=useState(0)

  const tabs = ['Overview'];

  const maleUsers = users.filter(user=>user.gender==='male')
  const femaleUsers = users.filter(user=>user.gender==='female')

  
  // Egypt Governorates
  const egyptGovernates = [
    'Cairo', 'Alexandria', 'Giza', 'Qalyubia', 'Port Said', 'Suez', 
    'Luxor', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Dakahlia',
    'Damietta', 'Faiyum', 'Gharbia', 'Ismailia', 'Kafr El Sheikh',
    'Matrouh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
    'Qena', 'Red Sea', 'Sharqia', 'Sohag', 'South Sinai'
  ];

  useEffect(()=>{
    const get=async()=>{
        try{
            setLoading(true)
            await getUserPageData(setError , setUsers , setTotalPercantage , setMalePercantage , setFemalePercantage)
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)
        }
    }
    get()
  },[])

  useEffect(() => {
  const onNewUser = (newUser) => {
    setUsers(prev =>[newUser, ...prev]);
  };

  socket.on("newUser", onNewUser);

  return () => {
    socket.off("newUser", onNewUser);
  };
}, []);

  if(loading){
    return(
        <Loadiing />
    )
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user?.name.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      user?.email.toLowerCase()?.includes(searchQuery.toLowerCase())
    // Type filter
    let matchesFilter = true;
    if (filterType && filterValue) {
      if (filterType === 'gender') {
        matchesFilter = user.gender === filterValue;
      } else if (filterType === 'governorate') {
        matchesFilter = user.governorate === filterValue;
      }
    }

    return matchesSearch && matchesFilter;
  });

  // Statistics data
  const statistics = [
    {
      id: 1,
      title: 'Total User',
      value: users.length,
      change: Number(totalPercantage),
      message: Number(totalPercantage)>0?'Up From Last Week':'Down From Last Week',
      icon: Users,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Total Women User',
      value: femaleUsers.length,
      change: Number(femalePercantage),
      message: Number(femalePercantage)>0?'Up From Last Week':'Down From Last Week',
      icon: UserCheck,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      id: 3,
      title: 'Total Men User',
      value: maleUsers.length,
      change: Number(malePercantage),
      message: Number(malePercantage)>0?'Up From Last Week':'Down From Last Week',
      icon: UserCheck,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
  ];

  const handleResetFilters = () => {
    setFilterType('');
    setFilterValue('');
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {error?
      (
        <div className="w-full h-full">
          <PageError />
        </div>
      ):(<>
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
          {/* Filter Type Selection */}
          <div className="relative flex-1">
            <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterValue('');
              }}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Filter By</option>
              <option value="gender">Gender</option>
              <option value="governorate">Governorate</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Value Selection (appears after selecting filter type) */}
          {filterType && (
            <div className="relative flex-1">
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
              >
                <option value="">Select {filterType}</option>
                
                {/* Gender options */}
                {filterType === 'gender' && (
                  <>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </>
                )}

                {/* Governorate options */}
                {filterType === 'governorate' && egyptGovernates.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Reset Filter */}
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors text-sm px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-red-50"
          >
            <RotateCcw size={18} />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Active Filters Display */}
        {(filterType && filterValue) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2 bg-[#009842] text-white px-3 py-1.5 rounded-full text-sm">
              <span className="font-medium capitalize">{filterType}:</span>
              <span>{filterValue}</span>
              <button
                onClick={() => {
                  setFilterType('');
                  setFilterValue('');
                }}
                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] text-sm"
          />
        </div>
      </div>

      <div className="flex  xl:flex-row gap-6">
        {/* Users List */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="col-span-3 text-sm font-semibold text-gray-700">User</div>
              <div className="col-span-2 text-sm font-semibold text-gray-700">User ID</div>
              <div className="col-span-3 text-sm font-semibold text-gray-700">Location</div>
              <div className="col-span-4 text-sm font-semibold text-gray-700">Email</div>
            </div>

            {/* Users Items */}
            <div className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                  >
                    {/* User */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 overflow-hidden h-10 rounded-full border border-neutral-300">
                          {user.avatar?(
                            <img
                            src={user.avatar}
                            className="w-full h-full rounded-full "
                          />):(
                            <div className="w-full overflow-hidden h-full flex justify-center items-end">
                              <FaUser size={30}/>
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 text-sm truncate">{user.name}</span>
                      </div>
                    </div>

                    {/* User ID */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">ID: {user.id}</span>
                    </div>

                    {/* Location */}
                    <div className="col-span-3">
                      <span className="text-sm text-gray-600">{user.governorate}</span>
                    </div>

                    {/* Email */}
                    <div className="col-span-4">
                      <span className="text-sm text-gray-600 ">{user.email}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-sm">No users found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="w-50 xl:w-80 flex flex-col gap-4">
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
                {stat.change!=0&&(<div className={`flex items-center gap-1 text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change>0?<TrendingUp size={16} />:<TrendingDown size={16}/>}
                  <span>{stat.change}%</span>
                </div>)}
              </div>
            );
          })}
        </div>
      </div>
      </>)}
    </div>
  );
};

export default SA_Users;