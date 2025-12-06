import axios from 'axios'

const getProfileData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getProfileData` , {withCredentials:true})
    }catch(error){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else 
            setError('Something went wrong')
        }
    }


export const getBusinessDashboardData = async (setError ,setOffers,setTotalScans,setTotalSales,setTotalOffers,setTotalLikes , setCategories)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getBusinessDashboardData` , {withCredentials:true})
        setOffers(response.data.latest_offers)
        setTotalScans(response.data.total_scans)
        setTotalSales(response.data.total_sales)
        setTotalOffers(response.data.total_offers)
        setTotalLikes(response.data.total_likes)
        setCategories(response.data.categories)
        console.log(response.data.categories);
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

export const editProfileData = async (setError)=>{
    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/businesses/editProfileData` , {withCredentials:true})
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

export const getBusinessOffers = async (setError , setLoading , setOffers , setCategories)=>{
    try{
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getBusinessOffers` , {withCredentials:true})
        setOffers(response.data.offers)
        setCategories(response.data.categories)
    }catch(error){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
    }finally{
        setLoading(false)
    }
}

