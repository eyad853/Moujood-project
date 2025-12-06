import axios from 'axios'

export const createCategory = async (setError , data , imagePreview , setCategories)=>{
    const tempId = Date.now();

    const tempCategory = {
        id:tempId,
        name:data.name,
        image:imagePreview,
        parent_id:data.parent_id,
        category_usage:0,
        subcategory_usage:0
    }
    try{

        setCategories(prev => [...prev , tempCategory])

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("parent_id", data.parent_id === null ? "" : data.parent_id);
        formData.append("image", data.image);   // IMPORTANT

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/categories/createCategory` , formData , {
            headers:{"Content-Type":"multipart/form-data"}
        })
        console.log(response.data);

        const realCategory = response.data.category
        
        setCategories(prev => prev?.map(cat=>cat.id===tempId?realCategory:cat))
    }catch(error){
        setCategories(prev => prev?.filter(cat => cat.id !== tempId));

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
        console.log(response.data);
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
        console.log(response.data);
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
        console.log(response.data);

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
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllSubCategories` , {withCredentials:true})
        setCategories(response.data)
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