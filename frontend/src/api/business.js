import axios from 'axios'

const getProfileData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getProfileData`)
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

const getBusinessDashboardData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getBusinessDashboardData`)
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

const editProfileData = async (setError)=>{
    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/businesses/editProfileData`)
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

const getBusinessOffers = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/businesses/getBusinessOffers`)
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