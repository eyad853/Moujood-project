import React, { useState } from 'react';
import { Plus, Send, Filter, RotateCcw, ChevronDown, Search, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import Loadiing from '../../../components/Loadiing/Loadiing'
import { getAllUsers , getAllBusinesses } from '../../../api/notifications';
import { useEffect } from 'react';
import { getAllCategories } from '../../../api/categories';
import { createNotification , getAllNotifications , editNotification , deleteNotification } from '../../../api/notifications';
import { useNotifications } from '../../../context/notificationContext';
import OfferDetailSheet from '../../../components/OfferDetailSheet/OfferDetailSheet';
import NotificationBottomSheet from '../../../components/NotificationBottomSheet/NotificationBottomSheet';
import PageError from '../../../components/PageError/PageError';


const SA_Notifications = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [receiver_type, setReceiver_type] = useState('user'); // 'users' or 'businesses'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [category, setCategory] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [gender, setGender] = useState('');

  const [error , setError]=useState(false)
  const [pageError , setPageError]=useState('')
  const [smallError , setSmallError]=useState('')
  const [loading , setLoading]=useState(false)

  const [userNotifications , setUserNotifications]=useState([])
  const [businessNotifications , setBusinessNotifications]=useState([])

  const {isNotificationSheetOpen , setIsNotificationSheetOpen,selectedNotification,setSelectedNotification}=useNotifications()


  const [users , setUsers]=useState([])
  const [businesses , setBusinesses]=useState([])
  const [categories , setCategoies]=useState([])


  // Form states
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    receiver_type: 'user',
    filter_type: 'all', // 'all', 'governorate', 'gender', 'category', 'specific'
    filter_value: '',
    specific_names: [] // Changed from specific_ids to specific_names
  });

  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(()=>{
    const fetchData = async () => {
    try {
      setLoading(true);
      await getAllUsers(setError , setUsers)
      await getAllBusinesses(setError , setBusinesses)
      await getAllCategories(setError , setCategoies)
      await getAllNotifications(setError , receiver_type  , setUserNotifications , setBusinessNotifications)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
    
    fetchData();
  },[receiver_type])
    
      if(loading){
        return <Loadiing />
      }

  const egyptGovernates = [
    'Cairo', 'Alexandria', 'Giza', 'Qalyubia', 'Port Said', 'Suez', 
    'Luxor', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Dakahlia',
    'Damietta', 'Faiyum', 'Gharbia', 'Ismailia', 'Kafr El Sheikh',
    'Matrouh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
    'Qena', 'Red Sea', 'Sharqia', 'Sohag', 'South Sinai'
  ];

  const handleResetFilters = () => {
    setCategory('');
    setGovernorate('');
    setGender('');
    setSearchQuery('');
  };

  const handleAddNotification = () => {
    setEditingNotification(null);
    setFormData({
      title: '',
      message: '',
      receiver_type: receiver_type,
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
      receiver_type: receiver_type,
      filter_type: notification.filter_type,
      filter_value: notification.filter_value,
      specific_names: notification.specific_names
    });
    setView('form');
  };

  const handleCreateAndUpdateNotification = async()=>{
    try{
      editingNotification?
      editNotification(editingNotification.id , formData , setError , setLoading ,  setUserNotifications , setBusinessNotifications)
      :
      await createNotification(formData , setUserNotifications , setBusinessNotifications , setLoading , setError) 
      setView('list')
    }catch(error){
      setError(error)
    }
  }

  const notifications = receiver_type==='user'?userNotifications:businessNotifications

  const filteredNotifications = notifications.filter(notification => {
  // 1️⃣ Search (title + message)
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    if (
      !notification.title.toLowerCase().includes(q) &&
      !notification.message.toLowerCase().includes(q)
    ) {
      return false;
    }
  }

  // 2️⃣ User filters
  if (receiver_type === 'user') {
      if (governorate && notification.filter_type !== 'governorate') return false;
      if (governorate && notification.filter_value !== governorate) return false;

      if (gender && notification.filter_type !== 'gender') return false;
      if (gender && notification.filter_value !== gender) return false;
    }

    // 3️⃣ Business filters
    if (receiver_type === 'business') {
      if (category && notification.filter_type !== 'category') return false;
      if (category && notification.filter_value !== category) return false;
    }

    return true;
  });

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
                onClick={() => setFormData(prev => ({ ...prev, receiver_type: 'user' ,  specific_names:[] }))}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.receiver_type === 'user'
                    ? 'bg-[#009842] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, receiver_type: 'business' ,  specific_names:[]}))}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  formData.receiver_type === 'business'
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
              <option value="all">All {formData.receiver_type === 'user' ? 'Users' : 'Businesses'}</option>
              {formData.receiver_type === 'user' ? (
                <>
                  <option value="governorate">Specific Governorate</option>
                  <option value="gender">Specific Gender</option>
                </>
              ) : (
                <>
                  <option value="category">Specific Category</option>
                </>
              )}
              <option value="specific">Specific Names</option>
            </select>
          </div>

          {/* Filter Value - Show based on filter type */}
          {formData.filter_type === 'governorate' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Governorate
              </label>
              <select
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
              >
                <option value="">Choose Governorate</option>
                {egyptGovernates.map(gov=>(
                  <option value={gov}>{gov}</option>
                ))}
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
                {categories?.map(cat=>(
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {formData.filter_type === 'specific' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Search {formData.receiver_type === 'user' ? 'Users' : 'Businesses'} by Name
              </label>
              <input
                type="text"
                placeholder={`Search for ${formData.receiver_type === 'user' ? 'user' : 'business'} names...`}
                value={formData.filter_value}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_value: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842]"
              />
              
              {/* Search Results Dropdown */}
              {formData.filter_value && (
                <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                  {(formData.receiver_type === 'user' ? users : businesses)
                    ?.filter(item => item.name.toLowerCase().includes(formData.filter_value.toLowerCase()))
                    .map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            filter_value: '',
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
              onClick={handleCreateAndUpdateNotification}
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
      {pageError?(
        <div className="w-full h-full">
          <PageError />
        </div>
      ):(<>
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
            onClick={() => setReceiver_type('user')}
            className={`pb-3 px-1 font-medium relative ${
              receiver_type === 'user' ? 'text-[#009842]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            User Notifications
            {receiver_type === 'user' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
            )}
          </button>
          <button
            onClick={() => setReceiver_type('business')}
            className={`pb-3 px-1 font-medium relative ${
              receiver_type === 'business' ? 'text-[#009842]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Business Notifications
            {receiver_type === 'business' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
            )}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${receiver_type==='user'?'lg:grid-cols-3':'lg:grid-cols-2'} gap-4 mb-4`}>

          {receiver_type === 'user' ? (
            <>
              {/* governorate */}
              <div className="relative">
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white text-sm"
                >
                  <option value="">Governorate</option>
                  {egyptGovernates.map(gov=>(
                    <option value={gov}>{gov}</option>
                  ))}
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
                  {categories?.map(cat=>(
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
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
        {notifications.length>0&&(<div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-2  text-sm font-semibold text-gray-700">Title</div>
          <div className="col-span-2 flex justify-center text-sm font-semibold text-gray-700">Message</div>
          <div className="col-span-3 flex justify-center text-sm font-semibold text-gray-700">Target</div>
          <div className="col-span-1 flex justify-center text-sm font-semibold text-gray-700">Recipients</div>
          <div className="col-span-1 flex justify-center text-sm font-semibold text-gray-700">Status</div>
          <div className="col-span-2 flex justify-center text-sm font-semibold text-gray-700">Date</div>
          <div className="col-span-1 flex justify-center text-sm font-semibold text-gray-700">Actions</div>
        </div>)}

        {/* Notifications Items */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              onClick={()=>{
                setSelectedNotification(notification)
                setIsNotificationSheetOpen(true)
              }}
              className="grid cursor-pointer grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center"
            >
              {/* Title */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900 line-clamp-1 text-sm">{notification?.title}</span>
              </div>

              {/* Message */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-1">{notification?.message}</span>
              </div>

              {/* Target */}
              <div className="col-span-3 flex justify-center">
                <span className="text-sm text-gray-600">{notification?.targets}</span>
              </div>

              {/* Recipients */}
              <div className="col-span-1 flex justify-center">
                <span className="text-sm text-gray-900 font-medium">
                  {notification?.receivers}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  Sent
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600">
                  {new Date(notification.created_at).toLocaleString('en-US', { 
                    year: 'numeric', month: 'short', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
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
                    onClick={(e)=>{
                      e.stopPropagation()
                      deleteNotification(notification.id , receiver_type , setError , null ,setUserNotifications,setBusinessNotifications)
                    }}
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
      </div>
      {isNotificationSheetOpen && selectedNotification?.id&& (
        <NotificationBottomSheet 
          isOpen={isNotificationSheetOpen} 
          onClose={() => {
            setIsNotificationSheetOpen(false);
            setSelectedNotification(null)
          }}
          notificationId={selectedNotification?.id}
        /> 
        )}
        </>)}
    </div>
  );
};

export default SA_Notifications;