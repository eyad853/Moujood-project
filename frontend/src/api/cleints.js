import axios from 'axios'

const getFeedPageData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getFeedPageData`)
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

const getSubCategoriesOfCategory = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getSubCategoriesOfCategory`)
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

const getBusinessesOfCategoryData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getbusinessesOfCategoryData`)
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

const getBusinessPageData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getBusinessPageData`)
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

const getProfileData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clients/getprofileData`)
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