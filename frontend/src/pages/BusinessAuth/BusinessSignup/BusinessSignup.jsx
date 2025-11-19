import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Upload, MapPin, Bold } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { businessAuth } from '../../../api/auth';


const BusinessSignup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading , setLoading]=useState(false)
  const [error , setError]=useState('')
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    businessCategory: '',
    businessLogo: null,
    businessDescription: '',
    addressOne: '',
    addressTwo: '',
    businessPhone: '',
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({ ...prev, businessLogo: file }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  }
};

useEffect(() => {
  // Cleanup preview URL when component unmounts
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
        <div style={{ padding: '0 20px' }}
        >
        
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
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
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
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
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
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa'
              }}
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
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa'
              }}
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
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Business category
          </label>
          <div style={{ position: 'relative' }}>
            <select
              name="businessCategory"
              value={formData.businessCategory}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px 40px 14px 16px',
                fontSize: '15px',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fafafa',
                appearance: 'none',
                color: formData.businessCategory ? '#1a1a1a' : '#999'
              }}
            >
              <option value="">Chose from the categories</option>
              <option value="retail">Retail</option>
              <option value="food">Food & Beverage</option>
              <option value="services">Services</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
            </select>
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
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
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        boxSizing: 'border-box',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
        color: '#999'
      }}
    >
      <span>{formData.businessLogo ? formData.businessLogo.name : 'Upload Your Logo'}</span>
      <Upload size={20} color="#666" />
    </label>
  </div>
  
  {/* ADD IT HERE - RIGHT AFTER THE CLOSING </div> OF position: 'relative' */}
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
            name="businessDescription"
            placeholder="Describe your Business"
            value={formData.businessDescription}
            onChange={handleInputChange}
            rows="4"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Business Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px',
            color: '#1a1a1a'
          }}>
            Business Address/es
          </label>
          <input
            type="text"
            name="addressOne"
            placeholder="-Address One"
            value={formData.addressOne}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa',
              marginBottom: '10px'
            }}
          />
          <input
            type="text"
            name="addressTwo"
            placeholder="-Address Two"
            value={formData.addressTwo}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
          />
        </div>

        {/* Business Locations Map */}
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
              color: '#999'
            }}>
              Chose your locations
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '180px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#e0e0e0'
          }}>
            <img 
              src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/39.8266,21.4278,12,0/350x180@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazl4aDJhc2QwMDAwM2xxNnN5YnJ3dTB3In0.xQ3P4o3e3FH2d1n0e1F_Eg"
              alt="Map"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                filter: 'brightness(0.95)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>';
              }}
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <MapPin size={20} color="#333" />
            </button>
          </div>
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
            name="businessPhone"
            placeholder="Enter you Business phone Number"
            value={formData.businessPhone}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fafafa'
            }}
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
            I accept and agree to comply with Snaply's{' '}
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
          <div className="flex justify-center items-center text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={()=>{
            businessAuth(setError, formData , navigate )
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
    </div>
  );
};

export default BusinessSignup;