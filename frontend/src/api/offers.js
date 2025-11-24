import axios from 'axios'

const addOffer = async (setError)=>{
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/offers/add`)
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
const editOffer = async (setError,offerId)=>{
    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/offers/edit/${offerId}`)
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
const getOffers = async (setError)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/offers/get`)
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
const deleteOffer = async (setError)=>{
    try{
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/offers/delete`)
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