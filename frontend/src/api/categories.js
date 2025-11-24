import axios from 'axios'

export const createCategory = async (setError)=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories/createCategory`)
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
export const editCategory = async (setError)=>{
    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/categories/editCategory`)
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
export const deleteCategory = async (setError)=>{
    try{
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/deleteCategory`)
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

export const getAllCategories = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllCategories`)
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

export const getAllSubCategories = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllSubCategories`)
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