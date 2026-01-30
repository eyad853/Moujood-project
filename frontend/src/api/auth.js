import axios from "axios";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10,15}$/;

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
        setUser(response.data.account)
        if(response.data.account.accountType==='user'){
            navigate(`/client/feed`)
        }else{
          navigate('/super_admin/dashboard')
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
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      data,
      { withCredentials: true }
    );

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
        if(response.status===201){
          setUser(response.data.account)
          navigate(`/business/dashboard`)
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

export const handleGoogleAuth = ()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`
}
export const handleFacebookAuth = ()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/facebook`
}

export const getUser = async(setLoading , setUser)=>{
  try {
    setLoading(true)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`,{ withCredentials: true });
    setUser(response.data); 
    console.log(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      setUser(null); 
  }

      setUser(null);
      } finally{
        setLoading(false)
      }
    }

export const editAccount = async (formData, setLoading, setError , setUser , user) => {
  try {
    setLoading(true);
    const fm = new FormData()
    if(user?.accountType==='user'){
      fm.append('name' , formData.name)
      fm.append('email' , formData.email)
      if (formData.password) {
        fm.append('password', formData.password);
      }
      if (formData.image) {
        fm.append('image', formData.image);
      }
      fm.append('gender' , formData.gender)
      fm.append('governorate' , formData.governorate)
    } else if (user?.accountType==="business"){
      fm.append('name' , formData.name)
      fm.append('email' , formData.email)
      if (formData.password) {
        fm.append('password', formData.password);
      }
      if (formData.image) {
        fm.append('image', formData.image);
      }
      fm.append('category' , Number(formData.category))
      fm.append('description' , formData.description)
      fm.append('locations' , formData.locations)
      fm.append('number' , formData.number)
    }

    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/editAccount`,
      fm,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }

    );
    if(!response.error){
      setUser(response.data.account)
    }

    console.log(response);

    
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