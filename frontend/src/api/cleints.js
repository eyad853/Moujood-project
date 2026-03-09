import axios from 'axios'

export const getFeedPageData = async (setError , setOffers , setCategories , setAds , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getFeedPageData` , {withCredentials:true})
        setOffers(response.data.offers)
        setCategories(response.data.categories)
        setAds(response.data.ads)
        console.log(response.data);
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
    }
}

export const getSubCategoriesOfCategory = async (setError , setCategories , categoryId , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getSubCategoriesOfCategory/${categoryId}`)
        setCategories(response.data.subCategories)
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
    }
}

export const getBusinessesOfCategory = async (setError , setBusinesses , categoryId , t)=>{
    try{
        console.log('started');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getbusinessesOfCategory/${categoryId}`)
        console.log(response.data);
        setBusinesses(response.data.businesses)
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
    }
}

export const getBusinessPageData = async (setError , setBusiness , setCategories , setOffers , business_id , businessId , setMarkers , t)=>{
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
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
    }
}

export const getUserPoints = async (setPoints, setError , t)=>{
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/clients/getUserPoints`,
      { withCredentials: true }
    );

    setPoints(res.data.total_points);
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
  }
};