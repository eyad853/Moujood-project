import axios from 'axios'

export const createCategory = async (setError , data , imagePreview , setCategories)=>{
    const tempId = Date.now();

    const tempCategory = {
        id:tempId,
        name:data.name,
        image:imagePreview,
        parent_id:data.parent_id
    }
    try{

        setCategories(prev => [...prev , tempCategory])

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories/createCategory` , data)

        const realCategory = response.data.category
        
        setCategories(prev => prev.map(cat=>cat.id===tempId?realCategory:cat))
    }catch(error){
        setCategories(prev => prev.filter(cat => cat.id !== tempId));

        if (error.response?.data?.message) {
            setError(error.response.data.message)
        } else if (error.message) {
            setError(error.message)
        } else {
            setError('Something went wrong')
        }
    }
}
export const editCategory = async (setError , data , imagePreview, categoryId , setCategories)=>{
    let previous;

  // Save old value for rollback
  setCategories(prev => {
    previous = prev.find(cat => cat.id === categoryId);
    return prev.map(cat =>cat.id === categoryId? {...cat,name: data.name,image: imagePreview,parent_id: data.parent_id  }: cat);
  });

    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/categories/editCategory/${categoryId}` , data)
    }catch(error){
        setCategories(prev =>prev.map(cat =>cat.id === categoryId ? previous : cat));

        if (error.response?.data?.message) {
            setError(error.response.data.message)
        } else if (error.message) {
            setError(error.message)
        } else {
            setError('Something went wrong')
        }
    }
}

export const deleteCategory = async (setError ,categoryId, setCategories)=>{

    let deletedCategory = null;
    try{

        setCategories(prev => {
            const updated = prev.filter(cat => {
                if (cat.id === categoryId) deletedCategory = cat; // save it
                return cat.id !== categoryId;
            });
            return updated;
        });

        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/deleteCategory/${categoryId}`)
    }catch(error){

         // Rollback UI if failed
        if (deletedCategory) {
            setCategories(prev => [...prev, deletedCategory]);
        }

        if (error.response?.data?.message) {
            setError(error.response.data.message)
        } else if (error.message) {
            setError(error.message)
        } else {
            setError('Something went wrong')
        }
    }
}

export const getAllCategories = async (setError , setCategories)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllCategories`)
        setCategories(response.data.categories)
    }catch(error){
        if (error.response?.data?.message) {
            setError(error.response.data.message)
        } else if (error.message) {
            setError(error.message)
        } else {
            setError('Something went wrong')
        }
    }
}

export const getAllSubCategories = async (setError , setCategories)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllSubCategories`)
        setCategories(response.data.categories)
    }catch(error){
        if (error.response?.data?.message) {
            setError(error.response.data.message)
        } else if (error.message) {
            setError(error.message)
        } else {
            setError('Something went wrong')
        }
    }
}