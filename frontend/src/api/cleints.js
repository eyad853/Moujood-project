import axios from 'axios'

export const getFeedPageData = async (setError , setOffers , setCategories , setAds)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getFeedPageData` , {withCredentials:true})
        setOffers(response.data.offers)
        setCategories(response.data.categories)
        setAds(response.data.ads)
        console.log(response.data);
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

export const getSubCategoriesOfCategory = async (setError , setCategories , categoryId)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getSubCategoriesOfCategory/${categoryId}`)
        setCategories(response.data.subCategories)
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

export const getBusinessesOfCategory = async (setError , setBusinesses , categoryId)=>{
    try{
        console.log('started');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getbusinessesOfCategory/${categoryId}`)
        console.log(response.data);
        setBusinesses(response.data.businesses)
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

export const getBusinessPageData = async (setError , setBusiness , setCategories , setOffers , business_id , businessId , setMarkers)=>{
    const usedId = businessId?businessId:business_id
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getBusinessPageData/${usedId}`)
        setCategories(response.data.subCategories)
        setBusiness(response.data.business)
        setOffers(response.data.offers)
        setMarkers(response.data.locations)
        console.log(response.data.locations);
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

const getProfileData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getprofileData`)
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

export const getUserPoints = async (setPoints, setError) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/clients/getUserPoints`,
      { withCredentials: true }
    );

    setPoints(res.data.total_points);
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