import axios from "axios";
import { SocialLogin } from '@capgo/capacitor-social-login';
import { getDeviceInfo } from "../utils/deviceInfo";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{10,64}$/;

export const localAuth = async(setError , data ,navigate , setLoading , fromSuperAdminPage , setUser , setFieldErrors , t) => {
    try{
      setLoading(true)
      setError('')
      setFieldErrors({});

    // Name
    if (!fromSuperAdminPage&&!data.name || data?.name?.trim().length < 3) {
      setError(t('limits:NAME_MIN'));
      setFieldErrors(prev=>({...prev ,  name: true }));
      return;
    }

    // Email
    if (!data.email || !emailRegex.test(data.email)) {
      setError(t('limits:EMAIL_INVALID'));
      setFieldErrors(prev=>({...prev , email: true }));
      return;
    }

    const errors = [];

    if (!data.password || data.password.length < 8) {
      errors.push(t("limits:PASSWORD_MIN"));
    }

    if (!/[a-z]/.test(data.password)) {
      errors.push(t("limits:PASSWORD_LOWERCASE"));
    }

    if (!/[A-Z]/.test(data.password)) {
      errors.push(t('limits:PASSWORD_UPPERCASE'));
    }

    if (!/[@$!%*?&^#()_\-+=]/.test(data.password)) {
      errors.push(t('limits:PASSWORD_SPECIAL'));
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      setFieldErrors(prev => ({ ...prev, password: true }));
      return;
    }

    // Confirm password
    if (data.confirm_password && data.password !== data.confirm_password) {
      setError(t('limits:PASSWORD_CONFIRM_MATCH'));
      setFieldErrors(prev=>({...prev , confirm_password: true }));
      return;
    }

    // Gender
    if (!fromSuperAdminPage&&!data.gender) {
      setError(t('limits:GENDER_REQUIRED'));
      setFieldErrors(prev=>({...prev , gender: true }));
      return;
    }

    // Governorate
    if (!fromSuperAdminPage&&!data.governorate) {
      setError(t('limits:GOVERNORATE_REQUIRED'));
      setFieldErrors(prev=>({...prev, governorate: true }));
      return;
    }

    // Terms
    if (!fromSuperAdminPage && !data.acceptTerms) {
      setError(t('limits:TERMS_REQUIRED'));
      return;
    }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/local` , data , {withCredentials:true})
        
        if(!response?.data?.account){
            navigate(`/verify_email`, {
              state:{
                email:data.email,
                accountType:'user'
              }
            })
        }else{
          setUser(response?.data?.account)
          navigate('/super_admin/dashboard')
        }
    }catch(err){
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
    } finally{
      setLoading(false)
    }
}

export const login = async (setError, data, navigate , setLoading , setUser , setFieldErrors , t) => {
  try {
    setLoading(true)
    setError('')
    setFieldErrors({});

    const { deviceToken, deviceId } = await getDeviceInfo();


    if (!data.email || !emailRegex.test(data.email)) {
      setError(t('limits:EMAIL_INVALID'));
      setFieldErrors(prev=>({...prev , email: true }));
      return;
    }

    if (!data.password) {
      setError(t('limits:PASSWORD_REQUIRED'));
      setFieldErrors(prev=>({...prev , password: true }));
      return;
    }

    
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,{...data , deviceToken , deviceId},{ withCredentials: true });

    // ✅ Extract user from backend response
    const result = response.data;
    setUser(result.account)
    // ✅ Redirect based on user type
    if(result.accountNotVerified){
      navigate('/verify_email')
    }else if (result.account.accountType === "user") {
      navigate("/client/feed");
    } else if (result.account.accountType === "business") {
      navigate(`/business/dashboard`);
    } else if (result.account.accountType === "super_admin") {
      navigate("/super_admin/dashboard");
    } else {
      navigate("/"); // fallback
    }

  } catch (err) {
        // Handle unverified accounts returned as 403
      if (err.response?.status === 403 && err.response.data?.accountNotVerified) {
        navigate('/verify_email');
        return;
      }
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
  }finally{
    setLoading(false)
  }
};

export const businessAuth = async(setError , data ,navigate , setLoading , setUser , setFieldErrors , t)=>{
    try{

      setLoading(true)
      setError('')
      setFieldErrors({});

      if (!data.name || data.name.trim().length < 3) {
        setError(t('limits:BUSINESS_NAME_MIN'));
        setFieldErrors(prev=>({...prev ,  name: true }));
        return;
      }

      if (!data.email || !emailRegex.test(data.email)) {
        setError(t('limits:EMAIL_INVALID'));
        setFieldErrors(prev=>({...prev , email: true }));
        return;
      }

    const errors = [];

    if (!data.password || data.password.length < 8) {
      errors.push(t("limits:PASSWORD_MIN"));
    }

    if (!/[a-z]/.test(data.password)) {
      errors.push(t("limits:PASSWORD_LOWERCASE"));
    }

    if (!/[A-Z]/.test(data.password)) {
      errors.push(t('limits:PASSWORD_UPPERCASE'));
    }

    if (!/[@$!%*?&^#()_\-+=]/.test(data.password)) {
      errors.push(t('limits:PASSWORD_SPECIAL'));
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      setFieldErrors(prev => ({ ...prev, password: true }));
      return;
    }

    // Confirm password
    if (data.confirm_password && data.password !== data.confirm_password) {
      setError(t('limits:PASSWORD_CONFIRM_MATCH'));
      setFieldErrors(prev=>({...prev , confirm_password: true }));
      return;
    }

    if (!data.category) {
      setError(t('limits:CATEGORY_SELECT'));
      setFieldErrors(prev=>({...prev ,  category: true }));
      return;
    }

    if (!data.logo) {
      setError(t('limits:LOGO_REQUIRED'));
      setFieldErrors(prev=>({...prev ,  logo: true }));
      return;
    }

    if (!data.description || data.description.length < 10) {
      setError(t('limits:DESCRIPTION_MIN'));
      setFieldErrors(prev=>({...prev ,  description: true }));
      return;
    }

    if (!data.number) {
      setError(t("limits:PHONE_REQUIRED"));
      setFieldErrors(prev => ({ ...prev, number: true }));
      return;
    }
    
    if (!phoneRegex.test(data.number)) {
      setError(t("limits:PHONE_INVALID"));
      setFieldErrors(prev => ({ ...prev, number: true }));
      return;
    }

    if (!data.acceptTerms) {
      setError(t('limits:TERMS_REQUIRED'));
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
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
    } finally{
      setLoading(false)
    }
}

export const handleGoogleAuth = async (navigate , setUser)=>{
  try{
    const provider = 'google'

    const res = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      }
    })
    console.log(res);

    if (!res?.result?.idToken) {
      console.log("Google login failed: no idToken returned");
      return; // stop the function
    }

    const idToken = res.result.idToken;
    console.log("idToken : ",idToken);

    const { deviceToken, deviceId } = await getDeviceInfo();

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/google` , {idToken , deviceId , deviceToken , provider} , {withCredentials:true})
    if(response?.data?.account){
      setUser(response.data.account)
      navigate(response.data.account.accountType==='user'?'/client/feed':"/business/dashboard")
    }
  }catch(error){
    console.log(error);
  }
}

export const handleFacebookAuth =async (navigate , setUser)=>{
    try{
      const provider = 'facebook'

    const res = await SocialLogin.login({
      provider: 'facebook',
      options: {
        permissions: ['email', 'public_profile'],
      }
    })
    console.log(res);
    

const accessToken =
  res?.result?.accessToken?.token ||
  res?.accessToken?.token;

    if (!accessToken) {
      console.log("Facebook login failed: no access token");
      return;
    }

    const { deviceToken, deviceId } = await getDeviceInfo();

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/facebook` , {accessToken , deviceToken , deviceId , provider} , {withCredentials:true})
    if(response?.data?.account){
      setUser(response.data.account)
      navigate(response.data.account.accountType==='user'?'/client/feed':"/business/dashboard")
    }
  }catch(error){
    console.log(error);
  }
}

export const getUser = async(setLoading , setUser , setError , setToken , t)=>{
  try {
    setLoading(true)
    setError('')
    const {deviceId } = await getDeviceInfo();
    
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me/${deviceId}`,{
      withCredentials: true 
    });

    if(response?.data?.account){
      setUser(response.data.account); 
      return response.data.hasToken
    }else{
      return true
    }
  } catch (err) {
      setUser(null);    
  } finally{
    setLoading(false)
  }
}

export const editAccount = async (formData, setLoading, setPageError , setUser , user , setFieldErrors , isFromProfile , t , setError) => {
  try {
    setLoading(true)
    setError('')
    setFieldErrors({});

    // --- General Validations ---
    if (isFromProfile&&!formData.name) {
      setError(t("limits:NAME_REQUIRED"));
      setFieldErrors(prev=>({...prev , name:true}))
      return;
    }

    if (isFromProfile&& (!formData.email || !emailRegex.test(formData.email))) {
      setError(t("limits:EMAIL_REQUIRED"));
      setFieldErrors(prev=>({...prev , email:true}))
      return;
    }

      if (!isFromProfile && !formData.password) {
        setError(t("limits:CURRENT_PASSWORD_REQUIRED"));
        setFieldErrors(prev => ({ ...prev, password: true }));
        return;
      }

      if (!isFromProfile && !formData.newPassword) {
        setError(t("limits:NEW_PASSWORD_REQUIRED"));
        setFieldErrors(prev => ({ ...prev, newPassword: true }));
        return;
      }

      if (!isFromProfile && !passwordRegex.test(formData.newPassword)) {
        setError(t("limits:NEW_PASSWORD_LIMITS"));
        setFieldErrors(prev => ({ ...prev, newPassword: true }));
        return;
      }

      if (!isFromProfile && !formData.confirmPassword) {
        setError(t("limits:CONFIRM_PASSWORD_REQUIRED"));
        setFieldErrors(prev => ({ ...prev, confirmPassword: true }));
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError(t('limits:CONFIRM_PASSWORD_MATCH'));
        setFieldErrors(prev => ({ ...prev, confirmPassword: true }));
        return;
      }

    // --- Account Type Specific Validations ---
    if (isFromProfile&&user?.accountType === 'user') {
      if (!formData.gender) {
        setError(t('limits:GENDER_REQUIRED'));
        setFieldErrors(prev=>({...prev , gender:true}))
        return;
      }
      if (!formData.governorate) {
        setError(t('limits:GOVERNORATE_REQUIRED'));
        setFieldErrors(prev=>({...prev , governorate:true}))
        return;
      }
    } else if (isFromProfile&&user?.accountType === 'business') {
      if (!formData.category) {
        setError(t('limits:CATEGORY_REQUIRED'));
        setFieldErrors(prev=>({...prev , category:true}))
        return;
      }
      if (!formData.description) {
        setError(t('limits:DESCRIPTION_REQUIRED'));
        setFieldErrors(prev=>({...prev , description:true}))
        return;
      }
          if (!formData.number) {
            setError(t("limits:PHONE_REQUIRED"));
            setFieldErrors(prev => ({ ...prev, number: true }));
            return;
          }

          if (!phoneRegex.test(formData.number)) {
            setError(t("limits:PHONE_INVALID"));
            setFieldErrors(prev => ({ ...prev, number: true }));
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

    
  } catch (err) {
        if (err.response?.data?.message) {
            setPageError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setPageError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setPageError(t(`errors:${err.message}`))
        } else {
            setPageError(t("errors:SOMETHING_WENT_WRONG"))
        }
    return { success: false };
  } finally {
    setLoading(false);
  }
};

export const logout = async (setError,navigate,setUser,setLoading , t) => {
  try {
    setLoading(true);
    const {deviceId } = await getDeviceInfo();

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {deviceId} , { withCredentials: true });

    // clear frontend auth state
    setUser(null);

    // navigate after successful logout
    navigate("/login");
  } catch (err) {
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
  } finally {
    setLoading(false);
  }
};

export const handleResendEmail = async (setIsResending , setResendSuccess , setCountdown , setError , t , email , accountType) => {
  setIsResending(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/resend-verify-email`,
      {
        email,
        accountType,
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
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
  }
};

export const verifyToken = async(setLoading , setUser , setAccountType , setError , token , t , setEmail)=>{
  try{
    setLoading(true)
      const { deviceToken, deviceId } = await getDeviceInfo();
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email/${token}` , {deviceId , deviceToken} , {withCredentials:true})
      setUser(response.data.account)
      setAccountType(response.data.account.accountType)
      setEmail(response.data.account.email)
    }catch(err){
      console.log(err);
        setEmail(err.response?.data?.email || "")
        setAccountType(err.response?.data?.accountType || "")
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
    }finally{
      setLoading(false)
    }
}

export const handleCreateToken = async()=>{
  try{
    const { deviceToken, deviceId } = await getDeviceInfo();
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/createToken` , {deviceId , deviceToken}, {withCredentials:true})
  }catch(error){
    console.log(error);
  }
}