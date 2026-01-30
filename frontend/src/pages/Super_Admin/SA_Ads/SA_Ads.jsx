import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Image } from 'lucide-react';
import { addAd , getAds ,editAd , deleteAd } from '../../../api/ads';
import Loadiing from '../../../components/Loadiing/Loadiing'

const SA_Ads = () => {
  const [ads, setAds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingAd, setEditingAd] = useState(null);
  const [error ,setError]=useState('')
  const [loading , setLoading]=useState(false)
  const [selectedAd , setSelectedAd]=useState({})

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (ad) => {
    setEditingAd(ad);
    setPreviewUrl(ad.image);
    setShowAddModal(true);
    setSelectedAd(ad)
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingAd(null);
    setSelectedAd({})
  };

  useEffect(()=>{
    const get=async()=>{
        try{
            setLoading(true)
            await getAds(setError , setAds)
        }catch(error){
            setError(error)
        }finally{
            setLoading(false)
        }
    }
    get()
  },[])

  if(loading){
    return(
        <Loadiing />
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your promotional banners and ads</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#009842] text-white rounded-lg font-semibold hover:bg-[#007a36] transition-colors shadow-md"
        >
          <Plus size={20} />
          Add New Ad
        </button>
      </div>

      {/* Ads Grid */}
      {ads.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No ads yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first advertisement</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#009842] text-white rounded-lg font-semibold hover:bg-[#007a36] transition-colors"
          >
            <Plus size={18} />
            Add Your First Ad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 aspect-square"
            >
              {/* Image */}
              <div className="bg-gray-100 overflow-hidden">
                <img
                  src={ad.image}
                  className="w-full h-full object-cover "
                />
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEditModal(ad)}
                  className="p-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-110"
                  title="Edit Ad"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => deleteAd(ad.id , ads , setAds , setError)}
                  className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg transform hover:scale-110"
                  title="Delete Ad"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Mobile Action Buttons */}
              <div className="md:hidden p-3 bg-white border-t flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(ad)}
                  className="p-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Edit Ad"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteAd(ad.id , ads , setAds , setError)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete Ad"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4">
          <div className="bg-white h-[90vh] overflow-auto  rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* File Upload Area */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Advertisement Image
                </label>
                
                {!previewUrl ? (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#009842] hover:bg-gray-50 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload size={32} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name='image'
                      onChange={handleFileSelect}
                      className="hidden "
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full  aspect-square object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-800">
                    ✓ Image ready to upload. Click save to add this advertisement.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={()=>{
                    editingAd ? editAd(selectedAd.id , selectedFile , ads , setAds , setError) : addAd(selectedFile , ads , setAds , setError)
                    handleCloseModal()
                }}
                disabled={!selectedFile}
                className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                  !selectedFile
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#009842] text-white hover:bg-[#007a36] shadow-md'
                }`}
              >
                {editingAd ? 'Update Ad' : 'Add Ad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SA_Ads;