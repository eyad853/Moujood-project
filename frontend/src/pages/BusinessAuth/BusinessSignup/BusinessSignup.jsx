import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Upload, MapPin, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { businessAuth } from '../../../api/auth';
import { getAllCategories } from '../../../api/categories';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapModal from '../../../components/modals/MapModal/MapModal';
import { useMapProvider } from '../../../context/mapContext';
import { useUser } from '../../../context/userContext';

const BusinessSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({})
  const [logoPreview, setLogoPreview] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const {showMapModal,setShowMapModal,markers,setMarkers , userLocation, setUserLocation}=useMapProvider()
  const {setUser} = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    category: '',
    logo: null,
    description: '',
    number: '',
    acceptTerms: false,
    locations: [] // Array of {lat, lng}
  });


  useEffect(() => {
  const setLocation = (lat, lng) => {
    setUserLocation({ lat, lng });
  };

  const DEFAULT_LOCATION = { lat: 30.0444, lng: 31.2357 };

  if (!navigator.geolocation) {
    if (markers?.length > 0) {
      setLocation(markers[0].lat, markers[0].lng);
    } else {
      setLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    () => {
      // Geolocation denied / failed
      if (markers?.length > 0) {
        setLocation(markers[0].lat, markers[0].lng);
      } else {
        setLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
      }
    }
  );
}, [markers]);


  useEffect(()=>{
    const get= async()=>{
    try{
      await getAllCategories(setError , setCategories)
    }catch(error){
      setError(error)
    }}

    get()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setFieldErrors(prev => ({
    ...prev,
    [name]: false
  }));
  };

  const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({ ...prev, logo: file }));
    setFieldErrors(prev => ({ ...prev, logo: false })); // <-- clear error
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  }
};

  const handleOpenMap = () => {
    setMarkers(formData.locations);
    setShowMapModal(true);
  };

  const handleSaveLocations = () => {
    setFormData(prev => ({ ...prev, locations: markers }));
    setShowMapModal(false);
  };

  const handleAddMarker = (location) => {
    setMarkers(prev => [...prev, location]);
  };

  const handleRemoveMarker = (index) => {
    setMarkers(markers.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '20px'
    }}>
      {/* Status Bar Space */}
      <div style={{ height: '44px' }}></div>

      <div className="w-full px-24 pb-10">
        <img src="/logo.svg" className='w-full h-full object-contain'/>
      </div>

      {/* Form */}
      <div style={{ padding: '0 20px' }}>
        
        {/* Business Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Business Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
            className={`${fieldErrors.name 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}`}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
            className={`${fieldErrors.email 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}`}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px 50px 14px 16px',
                fontSize: '15px',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa'
              }}
              className={`${fieldErrors.password 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm_password"
              placeholder="Enter your password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px 50px 14px 16px',
                fontSize: '15px',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa'
              }}
              className={`${fieldErrors.confirm_password 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </button>
          </div>
        </div>

        {/* Business Category */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2 text-gray-900">
            Business category
          </label>
          
          {/* Custom Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full px-4 py-4 border ${fieldErrors.category 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} 
              rounded-2xl bg-[#fafafa] hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center justify-between group`}
            >
              <div className="flex items-center gap-3">
                {formData.category ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-[#009842] flex items-center justify-center overflow-hidden">
                      <img 
                        src={categories.find(cat => cat.id === formData.category)?.image} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-gray-900 font-medium text-[15px]">
                      {categories.find(cat => cat.id === formData.category)?.name}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400 text-[15px]">Choose from the categories</span>
                )}
              </div>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 16 16" 
                fill="none"
                className={`transition-all duration-300 ${showCategoryDropdown ? 'rotate-180 text-[#009842]' : 'rotate-0 text-gray-400'} group-hover:text-[#009842]`}
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showCategoryDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowCategoryDropdown(false)}
                />
                
                {/* Menu */}
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                  <div className="p-2 max-h-80 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: category.id }));
                          setFieldErrors(prev => ({ ...prev, category: false }));
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center gap-3 transition-all mb-1 last:mb-0 ${
                          formData.category === category.id 
                            ? 'bg-[#009842] text-white shadow-md scale-[1.02]' 
                            : 'hover:bg-gray-50 text-gray-900 hover:scale-[1.01]'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${
                          formData.category === category.id ? 'bg-white/20' : 'bg-[#009842]'
                        }`}>
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className={`font-medium text-[15px] ${
                          formData.category === category.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {category.name}
                        </span>
                        {formData.category === category.id && (
                          <svg className="ml-auto" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Business Logo */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Business logo
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              name='image'
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="logoUpload"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: fieldErrors.logo ? '2px solid red' : '1px solid #e0e0e0',
                borderRadius: '12px',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              <span>{formData.logo ? formData.logo.name : 'Upload Your Logo'}</span>
              <Upload size={20} color="#666" />
            </label>
          </div>
          
          {logoPreview && (
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
            </div>
          )}
        </div>

        {/* Business Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Business Description
          </label>
          <textarea
            name="description"
            placeholder="Describe your Business"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            className={`${fieldErrors.description 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}`}
          />
        </div>

        {/* Business Locations Map - MODIFIED SECTION */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <label style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              Business Locations
            </label>
            <span style={{ 
              fontSize: '13px', 
              color: '#009842',
              fontWeight: '600'
            }}>
              {formData.locations.length} location{formData.locations.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenMap}
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '12px',
              position: 'relative',
              backgroundColor: '#f0f9f4',
              border: '2px dashed #009842',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f5ed'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f9f4'}
          >
            <MapPin size={40} color="#009842" />
            <span style={{ color: '#009842', fontWeight: '600', fontSize: '16px' }}>
              Click to Select Locations on Map
            </span>
            <span style={{ color: '#666', fontSize: '13px' }}>
              You can add multiple business locations
            </span>
          </button>
        </div>

        {/* Business Phone */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Business Phone
          </label>
          <input
            type="tel"
            name="number"
            placeholder="Enter you Business phone Number"
            value={formData.number}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
            className={`${fieldErrors.number 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}`}
          />
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            name="acceptTerms"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            style={{
              width: '18px',
              height: '18px',
              marginRight: '10px',
              marginTop: '2px',
              cursor: 'pointer',
              accentColor: '#00875A'
            }}
          />
          <label htmlFor="acceptTerms" style={{ fontSize: '13px', color: '#626B70', lineHeight: '1.5' }}>
            I accept and agree to comply with Maujood's{' '}
            <a href="#" style={{ color: 'black',fontWeight:'bold', textDecoration: 'underline' }}>
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" style={{ color: 'black',fontWeight:'bold', textDecoration: 'underline' }}>
              Privacy policy
            </a>
          </label>
        </div>

        {error&&(
          <div className="flex text-sm mb-5 justify-center items-center text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={()=>{
            businessAuth(setError, formData , navigate , setLoading , setUser , setFieldErrors)
          }}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#1A423A',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          Sign UP
        </button>

        {/* Log In Link */}
        <div style={{ textAlign: 'center', fontSize: '14px', marginBottom: '20px' }}>
          <span style={{ color: '#666' }}>Have an account? </span>
          <Link to={'/login'} style={{ color: '#009842', fontWeight: '600', textDecoration: 'none' }}>
            Log In
          </Link>
        </div>

        {/* Arabic Text */}
        <div className='text-[#1A423A] flex justify-center font-extrabold'>
          #خليك_دايما_موجود
        </div>
      </div>

      {showMapModal&&(<MapModal 
      showMapModal={showMapModal} 
      setShowMapModal={setShowMapModal}
      userLocation={userLocation}
      markers={markers}
      handleSaveLocations={handleSaveLocations}
      handleAddMarker={handleAddMarker}
      handleRemoveMarker={handleRemoveMarker}
      />)}
    </div>
  );
};

export default BusinessSignup;