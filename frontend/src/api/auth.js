import axios from "axios";
import { SocialLogin } from '@capgo/capacitor-social-login';
import { getDeviceInfo } from "../utils/deviceInfo";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{10,64}$/;

export const localAuth = async(setError , data ,navigate , setLoading , fromSuperAdminPage , setUser , setFieldErrors)=>{
    try{
      setLoading(true)
      setError('')
      setFieldErrors({});

    // Name
    if (!fromSuperAdminPage&&!data.name || data?.name?.trim().length < 3) {
      setError('Name must be at least 3 characters');
      setFieldErrors({ name: true });
      return;
    }

    // Email
    if (!data.email || !emailRegex.test(data.email)) {
      setError('Please enter a valid email (example@gmail.com)');
      setFieldErrors({ email: true });
      return;
    }

    // Password
    if (!data.password || data.password.length < 6) {
      setError('Password must be at least 6 characters');
      setFieldErrors({ password: true });
      return;
    }

    if (!data.confirm_password || data.confirm_password.length < 6) {
      setError('Confirm password must be at least 6 characters long');
      setFieldErrors({ confirm_password: true });
      return;
    }

    // Confirm password
    if (data.confirm_password&&data.password !== data.confirm_password) {
      setError('Password and confirm password do not match');
      setFieldErrors({ confirm_password: true });
      return;
    }

    // Gender
    if (!fromSuperAdminPage&&!data.gender) {
      setError('Please select your gender');
      setFieldErrors({ gender: true });
      return;
    }

    // Governorate
    if (!fromSuperAdminPage&&!data.governorate) {
      setError('Please select your governorate');
      setFieldErrors({ governorate: true });
      return;
    }

    // Terms
    if (!fromSuperAdminPage && !data.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/local` , data , {withCredentials:true})
        
        if(!response.error){
            navigate(`/verify_email`, {
              state:{
                email:data.email,
                accountType:'user'
              }
            })
        }
    }catch(err){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
    } finally{
      setLoading(false)
    }
}

export const login = async (setError, data, navigate , setLoading , setUser , setFieldErrors) => {
  try {
    setLoading(true)
    setError('')
    setFieldErrors({});

    const { deviceToken, deviceId } = await getDeviceInfo();


    if (!data.email || !emailRegex.test(data.email)) {
      setError('Please enter a valid email (example@gmail.com)');
      setFieldErrors({ email: true });
      return;
    }

    if (!data.password || data.password.length < 6) {
      setError('Password must be at least 6 characters');
      setFieldErrors({ password: true });
      return;
    }

    
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,{...data , deviceToken , deviceId},{ withCredentials: true });

    // ✅ Extract user from backend response
    const result = response.data;
    setUser(result.account)
    // ✅ Redirect based on user type
    if (result.account.accountType === "user") {
      navigate("/client/feed");
    } else if (result.account.accountType === "business") {
      navigate(`/business/dashboard`);
    } else if (result.account.accountType === "super_admin") {
      navigate("/super_admin/dashboard");
    } else {
      navigate("/"); // fallback
    }

  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }finally{
    setLoading(false)
  }
};

export const businessAuth = async(setError , data ,navigate , setLoading , setUser , setFieldErrors)=>{
    try{

      setLoading(true)
      setError('')
      setFieldErrors({});

      if (!data.name || data.name.trim().length < 3) {
      setError('Business name must be at least 3 characters');
      setFieldErrors({ name: true });
      return;
    }

    if (!data.email || !emailRegex.test(data.email)) {
      setError('Please enter a valid email (example@gmail.com)');
      setFieldErrors({ email: true });
      return;
    }

    if (!data.password || data.password.length < 6) {
      setError('Password must be at least 6 characters');
      setFieldErrors({ password: true });
      return;
    }

    if (!data.confirm_password || data.confirm_password.length < 6) {
      setError('Confirm password must be at least 6 characters long');
      setFieldErrors({ confirm_password: true });
      return;
    }

    if (data.confirm_password&&data.password !== data.confirm_password) {
      setError('Passwords do not match');
      setFieldErrors({ confirm_password: true });
      return;
    }

    if (!data.category) {
      setError('Please select a category');
      setFieldErrors({ category: true });
      return;
    }

    if (!data.logo) {
      setError('Please upload a logo');
      setFieldErrors({ logo: true });
      return;
    }

    if (!data.description || data.description.length < 10) {
      setError('Description must be at least 10 characters');
      setFieldErrors({ description: true });
      return;
    }

    if (!data.number) {
      setError('Please enter a phone number');
      setFieldErrors({ number: true });
      return;
    }

    if (!data.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

      const formdata = new FormData()
      formdata.append('name' , data.name)
      formdata.append('email' , data.email)
      formdata.append('password' , data.password)
      formdata.append('category' , Number(data.category))
      formdata.append('image' , data.logo)
      formdata.append('description' , data.description)
      formdata.append('number' , data.number)
      if(data.locations.length>0){
        formdata.append('locations' , JSON.stringify(data.locations))
      }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/business` , formdata,{
          withCredentials:true,
          headers:{"Content-Type":"multipart/form-data"}
        })
        if(!response.error){
          navigate(`/verify_email`, {
              state:{
                email:data.email,
                accountType:'business'
              }
            })
        }
    }catch(err){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
    } finally{
      setLoading(false)
    }
}

export const handleGoogleAuth = async (navigate , setUser)=>{
  try{
    const res = await SocialLogin.login({
      provider: 'google',
      options: {}
    })
    const idToken = res.result.idToken

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/google` , idToken)
    if(!response.data.error){
      setUser(response.data.account)
      navigate('/client/feed')
    }
  }catch(error){
    console.log(error);
  }
}

export const handleFacebookAuth =async (navigate , setUser)=>{
    try{
    const res = await SocialLogin.login({
      provider: 'facebook',
      options: {}
    })
    const accessToken = res.result.accessToken

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/facebook` , accessToken)
    if(!response.data.error){
      setUser(response.data.account)
      navigate('/client/feed')
    }
  }catch(error){
    console.log(error);
  }
}

export const getUser = async(setLoading , setUser , setError)=>{
  try {
    setLoading(true)
    setError('')

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`,{
      withCredentials: true 
    });

    setUser(response.data); 

    console.log(response.data);
  } catch (err) {
      setUser(null);

    if (err.response?.data?.message) {
        setError(err.response.data.message)
    } else if (err.message) {
        setError(err.message)
    } else {
        setError('Something went wrong')
    }
    
      } finally{
        setLoading(false)
      }
    }

export const editAccount = async (formData, setLoading, setError , setUser , user , setFieldErrors , setFullError , isFromProfile) => {
  try {
    setLoading(true)
    setError('')
    setFullError('')
    setFieldErrors({});

    // --- General Validations ---
    if (isFromProfile&&!formData.name) {
      setError('Name is required');
      setFieldErrors(prev=>({...prev , name:true}))
      return;
    }

    if (isFromProfile&&!formData.email || !emailRegex.test(formData.email)) {
      setError('Email is required');
      setFieldErrors(prev=>({...prev , email:true}))
      return;
    }

      if (!isFromProfile&&!formData.password) {
        setError('Current password is required to change password');
        setFieldErrors(prev=>({...prev , password:true}))
        return;
      }
      if (!isFromProfile&&!formData.newPassword) {
        setError('New password is required');
        setFieldErrors(prev=>({...prev , newPassword:true}))
        return;
      }
      if (!isFromProfile&&!formData.confirmPassword) {
        setError('Please confirm your new password');
        setFieldErrors(prev=>({...prev , confirmPassword:true}))
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Confirm password does not match the new password');
        return;
      }

    // --- Account Type Specific Validations ---
    if (isFromProfile&&user?.accountType === 'user') {
      if (!formData.gender) {
        setError('Gender is required');
        setFieldErrors(prev=>({...prev , gender:true}))
        return;
      }
      if (!formData.governorate) {
        setError('Governorate is required');
        setFieldErrors(prev=>({...prev , governorate:true}))
        return;
      }
    } else if (isFromProfile&&user?.accountType === 'business') {
      if (!formData.category) {
        setError('Category is required');
        setFieldErrors(prev=>({...prev , category:true}))
        return;
      }
      if (!formData.description) {
        setError('Description is required');
        setFieldErrors(prev=>({...prev , description:true}))
        return;
      }
      if (!formData.number) {
        setError('Number is required');
        setFieldErrors(prev=>({...prev , number:true}))
        return;
      }
    }

    const fm = new FormData()
    if(formData.name){
      fm.append('name' , formData.name)
    }
    if(formData.email){
      fm.append('email' , formData.email)
    }

    if (formData.password) {
      fm.append('password', formData.password);
      fm.append('newPassword', formData.newPassword);
    }
    
    if (formData.image) {
      fm.append('image', formData.image);
    }

    if(user?.accountType==='user'){
      if(formData.gender){
        fm.append('gender' , formData.gender)
      }

      if(formData.governorate){
        fm.append('governorate' , formData.governorate)
      }
      
    } else if (user?.accountType==="business"){
      if(formData.category){
        fm.append('category' , Number(formData.category))
      }
      
      if(formData.description){
        fm.append('description' , formData.description)
      }

      if(formData.locations){
      fm.append('locations' , formData.locations)
      }

      if(formData.number){
      fm.append('number' , formData.number)
      }
    }

    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/editAccount`,
      fm,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }

    );
    if(response.data.error){
      setError(response.data.message)
      return { success: false }
    }else{
      setUser(response.data.account)
      return { success: true, message: response.data.message }
    }

    console.log(response);

    
  } catch (err) {
    if (err.response?.data?.message) {
      setFullError(err.response.data.message);
    } else if (err.message) {
      setFullError(err.message);
    } else {
      setFullError("Something went wrong");
    }
    return { success: false };
  } finally {
    setLoading(false);
  }
};

export const logout = async (
  setError,
  navigate,
  setUser,
  setLoading
) => {
  try {
    setLoading(true);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );

    // clear frontend auth state
    setUser(null);

    // navigate after successful logout
    navigate("/login");
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

export const handleResendEmail = async (setIsResending , setResendSuccess , setCountdown , setError) => {
  setIsResending(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/resend-verify-email`,
      {
        email,
        accountType, // "user" or "business"
      }
    );

    if (!response.error) {
        setIsResending(false);

        setResendSuccess(true);
        setCountdown(60); // reset countdown for resend button

        // Hide success after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000);
    }

  } catch (err) {
    console.error(err);
    if (err.response?.data?.message) {
      setError(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
    } else {
      setError(error.response?.message || 'Verification failed. The link may be invalid or expired.');
    }
  }
};

export const verifyToken = async(setLoading , setUser , setAccountType , setError)=>{
  try{
    setLoading(true)
      const { deviceToken, deviceId } = await getDeviceInfo();
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email/${token}` , {deviceId , deviceToken} , {withCredentials:true})
      if(!response.data.error){
        console.log(response.data.account)
        setUser(response.data.account)
        setAccountType(response.data.account.accountType)
      }
    }catch(error){
      console.log(error);
      setError(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
    }finally{
      setLoading(false)
    }
  }