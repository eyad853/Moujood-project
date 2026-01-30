import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronRight, Trash2, Edit, Plus, Upload, X, ArrowLeft } from 'lucide-react';
import { getCategoriesPageData } from '../../../api/super_admin_data'; 
import Loadiing from '../../../components/Loadiing/Loadiing';
import { createCategory , editCategory , deleteCategory } from '../../../api/categories';

const SA_Categories = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories , setCategories]=useState([])
  const [error , setError]=useState(false)
  const [loading , setLoading]=useState(false)
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    parent_id: null
  });

  const mainCategories = categories?.filter(cat => cat.parent_id === null).filter(cat => searchQuery.trim() === "" ? true 
    : cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubcategories = (parentId) => {
    return categories?.filter(cat => cat.parent_id === parentId);
  };

  const getSubcategoriesNumber = (parentId) => {
    return categories?.filter(cat => cat.parent_id === parentId)?.length
  };

  const toggleCategory = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories?.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleAddCategory = (parentId = null) => {
    setFormMode('add');
    setEditingCategory(null);
    setFormData({ name: '', image: null, parent_id: parentId });
    setImagePreview(null);
    setView('form');
  };

  const handleEditCategory = (category) => {
    setFormMode('edit');
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: null,
      parent_id: category.parent_id
    });
    setImagePreview(category.image);
    setView('form');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setView('list');
    setFormData({ name: '', image: null, parent_id: null });
    setImagePreview(null);
  };

  useEffect(()=>{
    const fetchData = async () => {
    try {
      setLoading(true);
      await getCategoriesPageData(setError, setCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  },[])

  if(loading){
    return <Loadiing />
  }

  // Form View
  if (view === 'form') {
    return (
      <div className="w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {formMode === 'add' ? 'Add New Category' : 'Edit Category'}
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Upload category image
            </label>
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <div className="relative mb-4">
                  <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                    {typeof imagePreview === 'string' && (imagePreview.startsWith('data:') || imagePreview.startsWith('http') || imagePreview.startsWith('/')) ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{imagePreview}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}
              <input
                type="file"
                name='image'
                id="categoryImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="categoryImage"
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors text-sm font-medium"
              >
                Choose Image
              </label>
            </div>
          </div>

          {/* Category Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] transition-colors"
            />
          </div>

          {/* Parent Category (for subcategories) */}
          {formData.parent_id && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Parent Category
              </label>
              <select
                value={formData.parent_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value ? parseInt(e.target.value) : null }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#009842] focus:ring-1 focus:ring-[#009842] appearance-none bg-white"
              >
                <option value="">None (Main Category)</option>
                {mainCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              onClick={()=>{
                if(formMode==='add'){
                  createCategory(setError , formData , imagePreview , setCategories)
                  setView('list')
                }else{
                  editCategory(setError , formData , imagePreview ,editingCategory.id, setCategories)
                  setView('list')
                }
              }}
              className="flex-1 bg-[#009842] text-white py-3 rounded-lg font-semibold hover:bg-[#007a36] transition-colors"
            >
              {formMode === 'add' ? 'Add Category' : 'Update Category'}
            </button>
            <button
              onClick={handleCancel}
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
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => handleAddCategory()}
          className="flex items-center gap-2 bg-[#009842] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#007a36] transition-colors"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button className="pb-3 px-1 font-medium text-[#009842] relative">
            All Categories
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009842]" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
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

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {categories?.length>0?(
          <>
          {/* header */}
          <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="col-span-4 text-sm font-semibold text-gray-700">Name</div>
            <div className="col-span-2 text-sm font-semibold text-gray-700">Status</div>
            <div className="col-span-2 text-sm font-semibold text-gray-700">Business Number</div>
            <div className="col-span-2 text-sm font-semibold text-gray-700">Sub-Categories</div>
            <div className="col-span-1 text-sm font-semibold text-gray-700">DEL</div>
            <div className="col-span-1 text-sm font-semibold text-gray-700">Edit</div>
          </div>
  
          {/* Categories Items */}
          <div className="divide-y divide-gray-200">
            {mainCategories.map((category) => {
              const subcategories = getSubcategories(category.id);
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <React.Fragment key={category.id}>
                  {/* Main Category Row */}
                  <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                    {/* Category Name */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        {subcategories?.length > 0 && (
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                        )}
                        <div className="w-12 h-12 bg-[#009842] rounded-xl flex items-center justify-center">
                          <img src={category.image}  className='w-full h-full object-contain'/>
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{category.name}</span>
                      </div>
                    </div>
  
                    {/* Status */}
                    <div className="col-span-2">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Puplished
                      </span>
                    </div>
  
                    {/* Business Number */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-900 font-medium">{category.category_usage} Business</span>
                    </div>
  
                    {/* Sub-Categories */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">{getSubcategoriesNumber(category.id)}</span>
                        <button
                          onClick={() => handleAddCategory(category.id)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          <Plus size={16} className="text-green-600" />
                        </button>
                      </div>
                    </div>
  
                    {/* Delete */}
                    <div className="col-span-1">
                      <button
                        onClick={() => deleteCategory(setError,category.id,setCategories)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-gray-600" />
                      </button>
                    </div>
  
                    {/* Edit */}
                    <div className="col-span-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
  
                  {/* Subcategories Rows */}
                  {isExpanded && subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 bg-gray-50/50 hover:bg-gray-100 transition-colors items-center">
                      {/* Category Name */}
                      <div className="col-span-4">
                        <div className="flex items-center gap-3 pl-12">
                          <div className="w-10 h-10 bg-[#009842] rounded-lg flex items-center justify-center ">
                            <img src={category.image}  className='w-full h-full object-contain'/>
                          </div>
                          <span className="font-medium text-gray-700 text-sm">{subcategory.name}</span>
                        </div>
                      </div>
  
                      {/* Status */}
                      <div className="col-span-2">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                          Puplished
                        </span>
                      </div>
  
                      {/* Business Number */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-700 font-medium">{subcategory.subcategory_usage} Business</span>
                      </div>
  
                      {/* Sub-Categories */}
                      <div className="col-span-2">
                        
                      </div>
  
                      {/* Delete */}
                      <div className="col-span-1">
                        <button
                          onClick={() => deleteCategory(setError , subcategory.id , setCategories)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-gray-600" />
                        </button>
                      </div>
  
                      {/* Edit */}
                      <div className="col-span-1">
                        <button
                          onClick={() => handleEditCategory(subcategory)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        
          </>
        ):(
          <div className="flex justify-center items-center  font-bold text-gray-500">There's Not Any Categories Yet...</div>
        )}
      </div>
    </div>
  );
};

export default SA_Categories;