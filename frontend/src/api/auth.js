import axios from "axios";

export const localAuth = async(setError , data ,navigate , setLoading)=>{
    try{
      setLoading(true)
      if(data.password !== data.confirm_password){
        setError("Password and confirm password do not match")
        return
      }

      if(!data.acceptTerms){
        setError('Please accept the terms and conditions')
        return
      }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/local` , data , {withCredentials:true})
        if(response.status===201){
            navigate(`/client/feed`)
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

export const login = async (setError, data, navigate , setLoading) => {
  try {
    setLoading(true)
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      data,
      { withCredentials: true }
    );

    // ✅ Extract user from backend response
    const result = response.data;

    // ✅ Redirect based on user type
    if (result.accountType === "client") {
      navigate("/client/feed");
    } else if (result.accountType === "business") {
      navigate(`/Business/dashboard`);
    } else if (result.accountType === "super_admin") {
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

export const businessAuth = async(setError , data ,navigate , setLoading)=>{
    try{

      setLoading(true)
      if(data.password !== data.confirm_password){
        setError("Password and confirm password do not match")
      }

      if(!data.acceptTerms){
        setError('Please accept the terms and conditions')
      }

      const formdata = new FormData()
      formdata.append('name' , data.name)
      formdata.append('email' , data.email)
      formdata.append('password' , data.password)
      formdata.append('category' , data.businessCategory)
      formdata.append('image' , data.businessLogo)
      formdata.append('description' , data.businessDescription)
      formdata.append('addresses' , `${data.addressOne} , ${data.addressTwo}`)
      formdata.append('number' , data.businessPhone)

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/business` , formdata,{
          withCredentials:true,
          headers:{"Content-Type":"multipart/form-data"}
        })
        if(response.status===201){
            navigate(`/Business/dashboard`)
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

export const getUser = async(setError , setUser)=>{
  try{
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {withCredentials:true})
    setUser(data)
  }catch(error){
    if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
  }
}