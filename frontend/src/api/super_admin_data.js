import axios from 'axios'

const getBusinessPageData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getBusinessPageData`)
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
const editBusinessActivity = async (setError)=>{
    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/super_admin/editBusinessActivity`)
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
const getUserPageData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getUserPageData`)
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
const getDashboardPageData = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getDashboardPageData`)
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

export const getCategoriesPageData = async (setError , setCategories)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getCategoriesPageData`)
        if(response){
            setCategories(response.data.categories)
        console.log(response.data);

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