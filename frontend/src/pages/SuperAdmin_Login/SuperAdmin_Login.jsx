import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Loadiing from '../../components/Loadiing/Loadiing';
import { localAuth , handleGoogleAuth , handleFacebookAuth } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import {useUser} from '../../context/userContext'

const SuperAdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {setUser}=useUser()
  const [fieldErrors, setFieldErrors] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password:''
  });
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loadiing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-32 h-16 mx-auto mb-4">
            <img src="/logo.svg" alt="Maujood Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Admin Login' : 'Admin Sign Up'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back! Please login to continue' : 'Create your admin account'}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#00875A] focus:ring-2 focus:ring-[#00875A]/20 transition-all"
            />
          </div>

          {/* Password */}
          <div>
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
                className="w-full px-4 py-3 pr-12 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#00875A] focus:ring-2 focus:ring-[#00875A]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
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
                className="w-full px-4 py-3 pr-12 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#00875A] focus:ring-2 focus:ring-[#00875A]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
            
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border text-xs border-red-200 text-red-600 px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={()=>{
              localAuth(setError , formData , navigate , setLoading , true , setUser , setFieldErrors)
            }}
            className="w-full cursor-pointer py-3.5 my-3 text-base font-semibold text-white bg-[#0A4D3C] rounded-xl hover:bg-[#083d30] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0A4D3C]/20"
          >
            Login
          </button>

          <div className="text-right w-full flex">
              <a href="#" className="text-sm text-[#009842] hover:text-[#00875A] font-semibold transition-colors">
                Forgot Password?
              </a>
          </div>
        </div>

        {/* Arabic Text */}
        <div className="text-[#1A423A] text-center font-extrabold mt-6 text-lg">
          #خليك_دايما_موجود
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAuth;