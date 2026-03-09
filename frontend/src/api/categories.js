import axios from 'axios'

export const createCategory = async (setError , data , imagePreview , setCategories , t)=>{

    if (!data.name || data.name.trim().length === 0) {
        setError(t("limits:CATEGORY_NAME_REQUIRED"));
        return;
    }

    if (data.name.length > 50) {
        setError(t("limits:CATEGORY_NAME_TOO_LONG"));
        return;
    }

    if (!data.image) {
        setError(t("limits:IMAGE_REQUIRED"));
        return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(data.image.type)) {
        setError(t("limits:INVALID_IMAGE_TYPE"));
        return;
    }

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
    }catch(err){
        setCategories(prev => prev?.filter(cat => cat.id !== tempId));

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

export const editCategory = async (setError , data , imagePreview, categoryId , setCategories , t)=>{
    let previous;

    // Name required
    if (!data.name || data.name.trim().length === 0) {
        setError(t("limits:CATEGORY_NAME_REQUIRED"));
        return;
    }

    // Name max length
    if (data.name.length > 50) {
        setError(t("limits:CATEGORY_NAME_TOO_LONG"));
        return;
    }

    if (!data.image) {
        setError(t("limits:IMAGE_REQUIRED"));
        return;
    }

    // Image validation (if a new image is provided)
    if (data.image) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(data.image.type)) {
            setError(t("limits:INVALID_IMAGE_TYPE"));
            return;
        }
    }

  // Save old value for rollback
  setCategories(prev => {
    previous = prev.find(cat => cat.id === categoryId);
    return prev.map(cat =>cat.id === categoryId? {...cat,name: data.name,image: imagePreview,parent_id: data.parent_id  }: cat);
  });

    try{
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/categories/editCategory/${categoryId}` , data)
        console.log(response.data);
    }catch(err){
        setCategories(prev =>prev.map(cat =>cat.id === categoryId ? previous : cat));

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

export const deleteCategory = async (setError ,categoryId, setCategories , t)=>{
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
    }catch(err){

         // Rollback UI if failed
        if (deletedCategory) {
            setCategories(prev => [...prev, deletedCategory]);
        }

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

export const getAllCategories = async (setError , setCategories , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllCategories`)
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

export const getAllSubCategories = async (setError , setCategories , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/getAllSubCategories` , {withCredentials:true})
        setCategories(response.data.data)
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