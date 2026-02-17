import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBusinessesOfCategory, getSubCategoriesOfCategory } from '../../../api/cleints';
import Loadiing from '../../../components/Loadiing/Loadiing';
import PageError from '../../../components/PageError/PageError';
import { useTranslation } from 'react-i18next'


const C_Business_Of_Category = () => {
  const navigate = useNavigate();
  const {mainCategoryId, subCategoryName , subCategoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses , setBusinesses]=useState([])
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [selectedCategory , setSelectedCategory]=useState(null)
  const [categories , setCategories]=useState([])
  const { t , i18n } = useTranslation("categories")
  const isRTL = i18n.language === "ar"; // true if Arabic



  useEffect(()=>{
    const get = async ()=>{
      try{
        setLoading(true)
        await getSubCategoriesOfCategory(setError , setCategories , mainCategoryId)
        await getBusinessesOfCategory(setError , setBusinesses , subCategoryId)
      }catch(error){
        setError(error)
      }finally{
        setLoading(false)
      }
    }
    get()
  },[subCategoryId])

  useEffect(() => {
  if (subCategoryId) {
    setSelectedCategory(Number(subCategoryId));
  }
}, [subCategoryId]);

  if(loading){
    return (
      <div className="fixed inset-0">
        <Loadiing />
      </div>
    )
  }

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const orderedCategories = [...categories].sort((a, b) => {
  if (a.id === selectedCategory) return -1;
  if (b.id === selectedCategory) return 1;
  return 0;
});

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {error?(
        <PageError error={error}/>
      ):(<>
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold  text-gray-900">{subCategoryName} Businesses</h1>
        </div>

        {/* Search Bar */}
        <div className={`relative flex `}>
          <Search size={18} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-gray-400`} />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"} py-2.5 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-[#009842] transition-all text-sm`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">

        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
          {orderedCategories.map((category) => (
            <Link
            key={category.id}
            to={`/client/businesses_of_category/${mainCategoryId}/${category.name}/${category.id}`}
            onClick={()=>{
              setSelectedCategory(
                category.id === selectedCategory ? null : category.id
              );
            }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category.id === selectedCategory
                  ? 'bg-[#009842] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#009842]'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="font-medium text-sm">{category.name}</span>
            </Link>
          ))}
        </div>


        {/* Businesses List */}
        <div className="space-y-3">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-gradient-to-br from-[#009842] to-[#007a36] rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/client/business_page/${business.id}`)}
            >
              {/* Business Logo */}
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                <img src={business.logo} className='w-full h-full object-contain' alt="" />
              </div>

              {/* Business Info */}
              <div className="flex-1 text-white">
                <h3 className="text-lg font-bold mb-1">{business.name}</h3>
                <p className="text-sm opacity-90 mb-2 line-clamp-2">
                  {business.description}
                </p>
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
      </>)}
    </div>
  );
};

export default C_Business_Of_Category;