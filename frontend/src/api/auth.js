import axios from "axios";

export const localAuth = async(setError , data ,navigate)=>{
    try{
        console.log(data);
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
    } 
}

export const login = async (setError, data, navigate) => {
  try {
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
  }
};

export const businessAuth = async(setError , data ,navigate)=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/business` , data,{withCredentials:true})
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
    } 
}

export const handleGoogleAuth = ()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`
}
export const handleFacebookAuth = ()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/facebook`
}
