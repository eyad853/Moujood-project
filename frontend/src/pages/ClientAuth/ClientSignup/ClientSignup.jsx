import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { handleGoogleAuth , handleFacebookAuth } from '../../../api/auth';
import { localAuth } from '../../../api/auth';
import Loadiing from '../../../components/Loadiing/Loadiing';
import { useUser } from '../../../context/userContext';

const ClientSignup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    acceptTerms: false,
    gender:'',
    governorate:''
  });
  const {setUser} = useUser()

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

  const genderOptions = [
  { value: 'male', label: 'Male', icon: '👨' },
  { value: 'female', label: 'Female', icon: '👩' }
];

const governorateOptions = [
  { value: 'Cairo', label: 'Cairo', icon: '🏙️' },
  { value: 'Alexandria', label: 'Alexandria', icon: '🌊' },
  { value: 'Giza', label: 'Giza', icon: '🏛️' },
  { value: 'Qalyubia', label: 'Qalyubia', icon: '🏘️' },
  { value: 'Port Said', label: 'Port Said', icon: '⚓' },
  { value: 'Suez', label: 'Suez', icon: '🚢' },
  { value: 'Luxor', label: 'Luxor', icon: '🏺' },
  { value: 'Aswan', label: 'Aswan', icon: '⛰️' },
  { value: 'Asyut', label: 'Asyut', icon: '🏘️' },
  { value: 'Beheira', label: 'Beheira', icon: '🌾' },
  { value: 'Beni Suef', label: 'Beni Suef', icon: '🏘️' },
  { value: 'Dakahlia', label: 'Dakahlia', icon: '🏘️' },
  { value: 'Damietta', label: 'Damietta', icon: '🏖️' },
  { value: 'Faiyum', label: 'Faiyum', icon: '🏜️' },
  { value: 'Gharbia', label: 'Gharbia', icon: '🏘️' },
  { value: 'Ismailia', label: 'Ismailia', icon: '🏘️' },
  { value: 'Kafr El Sheikh', label: 'Kafr El Sheikh', icon: '🌾' },
  { value: 'Matrouh', label: 'Matrouh', icon: '🏖️' },
  { value: 'Minya', label: 'Minya', icon: '🏘️' },
  { value: 'Monufia', label: 'Monufia', icon: '🏘️' },
  { value: 'New Valley', label: 'New Valley', icon: '🏜️' },
  { value: 'North Sinai', label: 'North Sinai', icon: '🏜️' },
  { value: 'Qena', label: 'Qena', icon: '🏘️' },
  { value: 'Red Sea', label: 'Red Sea', icon: '🏖️' },
  { value: 'Sharqia', label: 'Sharqia', icon: '🏘️' },
  { value: 'Sohag', label: 'Sohag', icon: '🏘️' },
  { value: 'South Sinai', label: 'South Sinai', icon: '⛰️' }
];


  if(loading){
    return (
    <div className="fixed inset-0">
      <Loadiing />
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-6">
      {/* Status Bar Space */}
      <div className="h-11"></div>

      {/* Logo and Title */}
      <div className="text-center pt-5 pb-6 px-5">
        <div className="w-32 h-16 mx-auto mb-5">
          <img src="/logo.svg" alt="Maujood Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Sign up</h1>
      </div>

      <div className="px-5">
        {/* Social Login Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={()=>{handleGoogleAuth()}}
            className="flex-1 bg-[#009842] text-white py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            onClick={()=>{handleFacebookAuth()}}
            className="flex-1 bg-[#009842] text-white py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-600">Or Register with Email</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Form */}
        <div>
          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 text-base border ${fieldErrors.name 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} 
              rounded-xl outline-none bg-gray-50 transition-colors`}
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 text-base border rounded-xl  ${fieldErrors.email 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'}  outline-none bg-gray-50 transition-colors`}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 pr-12 text-base border rounded-xl outline-none bg-gray-50 ${fieldErrors.password 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                placeholder="Enter your password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 pr-12 text-base border ${fieldErrors.confirm_password 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} rounded-xl outline-none bg-gray-50 transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Gender */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Gender
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                className={`w-full px-4 py-3.5 text-base border rounded-xl bg-gray-50 text-left flex items-center justify-between ${fieldErrors.gender 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors`}
              >
                <span className={formData.gender ? 'text-gray-900' : 'text-gray-400'}>
                  {genderOptions.find(opt => opt.value === formData.gender)?.label || 'Select your gender'}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className={`transition-transform ${showGenderDropdown ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showGenderDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowGenderDropdown(false)}
                  />
                  
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, gender: option.value }));
                          setFieldErrors({})
                          setShowGenderDropdown(false);
                        }}
                        className={`w-full px-4 py-3.5 text-left text-base transition-colors border-b border-gray-100 last:border-b-0 ${
                          formData.gender === option.value 
                            ? 'bg-[#00875A] text-white font-medium' 
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* City/Governorate */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your governorate
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className={`w-full px-4 py-3.5 text-base border rounded-xl bg-gray-50 text-left flex items-center justify-between ${fieldErrors.governorate 
              ? 'border-2 border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-2 border-gray-200 focus:border-[#00875A] focus:ring-[#00875A]'} transition-colors`}
              >
                <span className={formData.governorate ? 'text-gray-900' : 'text-gray-400'}>
                  {governorateOptions.find(opt => opt.value === formData.governorate)?.label || 'Select your city'}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className={`transition-transform ${showCityDropdown ? 'rotate-180' : 'rotate-0'}`}
                >
                  <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showCityDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowCityDropdown(false)}
                  />
                  
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                    {governorateOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, governorate: option.value }));
                          setFieldErrors({})
                          setShowCityDropdown(false);
                        }}
                        className={`w-full px-4 py-3.5 text-left text-base transition-colors border-b border-gray-100 last:border-b-0 ${
                          formData.governorate === option.value 
                            ? 'bg-[#00875A] text-white font-medium' 
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6 flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="w-[18px] h-[18px] mt-0.5 mr-2.5 cursor-pointer accent-[#00875A] border-gray-300 rounded"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
              I accept and agree to comply with Maujood's{' '}
              <a href="#" className="text-[#00875A] underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#00875A] underline">
                Privacy policy
              </a>
            </label>
          </div>

          {error&&(
          <div className="flex text-xs mb-5 justify-center items-center text-red-600 font-semibold">
            {error}
          </div>
        )}

          {/* Submit Button */}
          <button
            onClick={()=>{
              localAuth(setError , formData,navigate , setLoading , false , setUser , setFieldErrors)
            }}
            className="w-full py-4 text-base font-semibold text-white bg-[#0A4D3C] rounded-full hover:bg-[#083d30] transition-colors mb-4"
          >
            Sign UP
          </button>

          {/* Log In Link */}
          <div className="text-center text-sm mb-5">
            <span className="text-gray-600">Have an account? </span>
            <Link to={'/login'} className="text-[#009842] font-semibold">
              Log In
            </Link>
          </div>

          {/* Arabic Text */}
            <div className='text-[#1A423A] flex justify-center font-extrabold'>
            #خليك_دايما_موجود
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSignup;