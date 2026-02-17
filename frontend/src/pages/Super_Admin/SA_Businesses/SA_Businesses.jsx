import React, { useEffect, useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {editBusinessActivity , getBusinessPageData} from '../../../api/super_admin_data' 
import Loadiing from '../../../components/Loadiing/Loadiing'
import { getAllCategories } from '../../../api/categories';
import socket from '../../../Socket';
import BusinessSheet from '../../../components/BusinessSheet/BusinessSheet';
import PageError from '../../../components/PageError/PageError';

const SA_Businesses = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [loading ,setLoading]=useState(false)
  const [error , setError]=useState('')
  const [businesses , setBusinesses]=useState([])
  const [categories , setCategories]=useState([])
  const [selectedBusiness , setSelectedBusiness] = useState(null)
  const [pageError , setPageError]=useState('')
  const [smallError , setSmallError]=useState('')
  const [isBusinessSheetOpen , setIsBusinessSheetOpen]=useState(false)

  const tabs = ['Overview'];

  const handleResetFilters = () => {
    setFilterBy('');
    setCategory('');
    setSubCategory('');
    setOrderStatus('');
    setSearchQuery('');
  };

  useEffect(()=>{
    const get=async()=>{
        try{
            setLoading(true)
            await getBusinessPageData(setError , setBusinesses)
            await getAllCategories(setError , setCategories)
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)
        }
    }
    get()
  },[])

  useEffect(() => {
  const onNewBusiness = (newBusiness) => {
    setBusinesses(prev => [newBusiness, ...prev]);
  };

  const onBusinessUpdated = (updatedBusiness) => {
    setBusinesses(prev =>
      prev.map(business => {
        if (business.id !== updatedBusiness.id) return business;

        return {
          ...business,
          name: updatedBusiness.name,
          logo: updatedBusiness.logo,
          category: updatedBusiness.category_name,
        };
      })
    );
  };

  socket.on("newBusiness", onNewBusiness);
  socket.on('business_updated', onBusinessUpdated);

  return () => {
    socket.off("newBusiness", onNewBusiness);
    socket.off('business_updated', onBusinessUpdated);
  };
}, []);

  if(loading){
    return(
        <Loadiing />
    )
  }

  const filteredBusinesses = businesses.filter((business) => {
    // Filter by search query (name)
    const matchesSearch = business.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = category ? business.category === category : true;
    
    // Filter by status
    const matchesStatus = orderStatus
      ? (orderStatus === 'active' ? business.active : !business.active)
      : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
});

  return (
    <div className="w-full max-w-full overflow-hidden">
      {pageError?(
        <div className="w-full h-full">
          <PageError />
        </div>
      ):(<>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
            >
              <option value="">Category</option>
              {categories.length>0?(
                categories.map(category=>(
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))
              ):(
                <div className=""></div>
              )}
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
        {businesses.length>0&&(<div className="grid grid-cols-11 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-1 text-sm font-semibold text-gray-700">Logo</div>
          <div className="col-span-5 text-sm font-semibold text-gray-700">Business Name</div>
          <div className="col-span-3 text-sm font-semibold text-gray-700">Category</div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">STATUS</div>
        </div>)}

        {/* Businesses Items */}
        <div className="divide-y divide-gray-200">
          {filteredBusinesses.map((business) => (
            <div
            onClick={()=>{
              setSelectedBusiness(business)
              setIsBusinessSheetOpen(true)
            }}
              key={business.id}
              className="grid grid-cols-11 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Logo */}
              <div className="col-span-1">
                <div className="w-12 h-12 bg-[#009842] rounded-xl flex items-center justify-center ">
                  <img
                    src={business.logo}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div className="col-span-5">
                <span className="font-medium text-gray-900 text-sm">{business.name}</span>
              </div>

              {/* Category */}
              <div className="col-span-3 font-semibold">
                <span className="text-sm">{business.category}</span>
              </div>

              {/* Status */}
              <div 
              onClick={(e)=>{
                e.stopPropagation()
                editBusinessActivity(setError , businesses , business , setBusinesses)
              }}
              className="col-span-2">
                <span className={`inline-block cursor-pointer px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  business.active
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {business.active ? 'Active' : 'Not Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isBusinessSheetOpen&&selectedBusiness?.id&&(
        <BusinessSheet isOpen={isBusinessSheetOpen} onClose={()=>setIsBusinessSheetOpen(false)} businessId={selectedBusiness.id}/>
        )}
        </>)}
    </div>
  );
};

export default SA_Businesses;