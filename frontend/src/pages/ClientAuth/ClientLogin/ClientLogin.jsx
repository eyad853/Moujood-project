import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { handleGoogleAuth , handleFacebookAuth } from '../../../api/auth';
import { login } from '../../../api/auth';




const ClientLogin = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar Space */}
      <div className="h-11"></div>

      {/* Logo and Title */}
      <div className="text-center pt-8 pb-6 px-5">
        <div className="w-32 h-16 mx-auto mb-6">
          <img src="/logo.svg" alt="Maujood Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Log in</h1>
      </div>

      <div className="px-5 flex-1 flex flex-col">
        {/* Social Login Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleGoogleAuth}
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
            onClick={handleFacebookAuth}
            className="flex-1 bg-[#009842] text-white py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-600">Or Log In with Email</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col">
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
              className="w-full px-4 py-3.5 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#00875A] focus:ring-1 focus:ring-[#00875A] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
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
                className="w-full px-4 py-3.5 pr-12 text-base border border-gray-200 rounded-xl outline-none bg-gray-50 focus:border-[#00875A] focus:ring-1 focus:ring-[#00875A] transition-colors"
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

          {/* Forgot Password */}
          <div className="mb-8">
            <a href="#" className="text-sm text-[#141C23] ">
              Forgot password?
            </a>
          </div>

          {error&&(
          <div className="flex justify-center items-center text-red-600 font-semibold">
            {error}
          </div>
        )}

          {/* Submit Button */}
          <button
            onClick={()=>{
              login(setError , formData , navigate)
            }}
            className="w-full py-4 text-base font-semibold text-white bg-[#1A423A] rounded-full hover:bg-[#083d30] transition-colors mb-4"
          >
            Log In
          </button>

          {/* Register Link */}
          <div className="text-center text-sm mb-12">
            <span className="text-gray-400">Don't have an account? </span>
            <Link to={'/ClientSignup'} className="text-[#009842] font-semibold">
              Register
            </Link>
          </div>

          {/* Arabic Text - pushed to bottom */}
            <div className='text-[#1A423A] flex justify-center font-extrabold'>
                #خليك_دايما_موجود
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;