import axios from "axios";

export const localAuth = async(setError , data ,navigate)=>{
    try{
        console.log(data);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/local` , data , {withCredentials:true})
        if(response.status===201){
            navigate(`/clientPage`)
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
    const { user } = response.data;

    // ✅ Redirect based on user type
    if (user.user_type === "client") {
      navigate("/client-dashboard");
    } else if (user.user_type === "business") {
      navigate(`/business-dashboard/${user.id}`);
    } else if (user.user_type === "superadmin") {
      navigate("/admin-panel");
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
            navigate(`business/${response.data.user.id}`)
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
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/google`
}
export const handleFacebookAuth = ()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/facebook`
}
