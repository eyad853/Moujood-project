import axios from 'axios'

export const getBusinessDashboardData = async (setError ,setOffers,setTotalOffers,setTotalLikes , setCategories , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getBusinessDashboardData` , {withCredentials:true})
        setOffers(response.data.latest_offers)
        setTotalOffers(response.data.total_offers)
        setTotalLikes(response.data.total_likes)
        setCategories(response.data.categories)
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

export const getBusinessOffers = async (setError , setLoading , setOffers , setCategories , t)=>{
    try{
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getBusinessOffers` , {withCredentials:true})
        setOffers(response.data.offers)
        setCategories(response.data.categories)
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
    }finally{
        setLoading(false)
    }
}

