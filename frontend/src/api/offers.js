import axios from 'axios'

export const addOffer = async (setError, setOffers, formData, imagePreview , setTotalOffers , setCategories) => {
    const selectedCategory = formData.category;
    // TEMP optimistic offer
    const tempOffer = {
        offer_id: Date.now(),        // fake ID until backend returns real one
        title: formData.title,
        description: formData.description,
        offer_price_before: formData.priceBeforeOffer,
        offer_price_after: formData.priceAfterOffer,
        image: imagePreview,
        category:formData.category.id,
        scans: 0,         // use your preview
        isTemp: true
    };

    setOffers(prev => [...prev, tempOffer]);
    if(setTotalOffers){
        setTotalOffers(prev=>prev+1)
    }

    if(setCategories){
        setCategories(prev => {
            const exists = prev.some(cat => Number(cat.id) === Number(selectedCategory.id));
            if (!exists) {
                return [...prev, selectedCategory];
            }
            return prev;
        });
    }


    // Build FormData for backend
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("offer_price_before", Number(formData.priceBeforeOffer));
    fd.append("offer_price_after", Number(formData.priceAfterOffer));
    fd.append("category", formData.category.id);
    if (formData.image) {
        fd.append("image", formData.image);
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/offers/add`,
            fd,
            { withCredentials: true }
        );
        console.log('created succesffully');

        // Replace temp with real backend data
        setOffers(prev =>
            prev.map(o =>
                o.offer_id === tempOffer.offer_id ? {...response.data , scans: 0} : o
            )
        );

    } catch (err) {
        // Rollback optimistic update
        setOffers(prev =>
            prev.filter(o => o.offer_id !== tempOffer.offer_id)
        );
        setTotalOffers?.(prev=>prev-1)

        setCategories(prev => {
            const wasNew = !prev.some(cat => Number(cat.id) === Number(selectedCategory.id));
            if (wasNew) {
                return prev.filter(cat => cat.id !== selectedCategory.id);
            }
            return prev;
        });

        if (err.response?.data?.message) setError(err.response.data.message);
        else if (err.message) setError(err.message);
        else setError("Something went wrong");
    }
};



export const editOffer = async (setError, offerId, setOffers, formData, imagePreview , setCategories) => {
    let oldOffer;
    let oldCategories;
    const selectedCategory = formData.category;

    if(setCategories){
        setCategories(prev => {
                oldCategories = [...prev];
                return prev;
        });
    }


    // TEMP optimistic UI
    setOffers(prev => {
        const updated = prev.map(o => {
            if (o.offer_id === offerId) {
                oldOffer = { ...o };

                return {
                    ...o,
                    title: formData.title,
                    description: formData.description,
                    offer_price_before: formData.priceBeforeOffer,
                    offer_price_after: formData.priceAfterOffer,
                    category: formData.category.id,
                    image: imagePreview ? imagePreview : o.image
                };
            }
            return o;
        });

        // Update categories based on the updated offers
        if (setCategories && oldOffer && oldOffer.category !== formData.category) {
            const oldCategoryId = oldOffer.category;
            const newCategoryId = formData.category.id;

            setCategories(prevCats => {
                let cats = [...prevCats];

                // Add new category if it doesn't exist
                if (selectedCategory && !cats.some(cat => cat.id === newCategoryId)) {
                    cats.push(selectedCategory);
                }

                // Check if old category is still used by other offers
                const oldCategoryStillUsed = updated.some(o => 
                    o.offer_id !== offerId && o.category === oldCategoryId
                );

                // Remove old category if no longer used
                if (!oldCategoryStillUsed) {
                    cats = cats.filter(cat => cat.id !== oldCategoryId);
                }

                return cats;
            });
        }

        return updated;
    });
    

    // Build FormData
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("offer_price_before", Number(formData.priceBeforeOffer));
    fd.append("offer_price_after", Number(formData.priceAfterOffer));
    fd.append("category", formData.category?.id ?? formData.category);
    if (formData.image) {
        fd.append("image", formData.image);
    }

    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/offers/edit/${offerId}`,
            fd,
            { withCredentials: true }
        );
        console.log('edited succesffully');


        // Replace temp with real
        setOffers(prev =>
  prev.map(o => {
    if (o.offer_id === offerId) {
      // Only keep the fields your frontend expects
      const updatedOffer = response.data;
      return {
        ...o,
        offer_id: updatedOffer.offer_id,
        title: updatedOffer.title,
        description: updatedOffer.description,
        image: updatedOffer.image,
        offer_price_before: updatedOffer.offer_price_before,
        offer_price_after: updatedOffer.offer_price_after,
        category: updatedOffer?.category
      };
    }
    return o;
  })
);

    } catch (err) {
        // rollback
        setOffers(prev =>
            prev.map(o =>
                o.offer_id === offerId ? oldOffer : o
            )
        );

        if (setCategories && oldCategories) {
            setCategories(oldCategories);
        }

        if (err.response?.data?.message) setError(err.response.data.message);
        else if (err.message) setError(err.message);
        else setError("Something went wrong");
    }
};


export const getOffers = async (setError , setOffers)=>{
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

export const deleteOffer = async (setError, setOffers, offerId , setCategories) => {
    let deleted;

    // optimistic
    // optimistic - remove offer and update categories
    setOffers(prev => {
        deleted = prev.find(o => o.offer_id === offerId);
        const remaining = prev.filter(o => o.offer_id !== offerId);

        // Update categories after removing offer
        if (setCategories && deleted) {
            const deletedCategoryId = deleted.category;

            setCategories(prevCats => {
                // Check if this category is still used by remaining offers
                const categoryStillUsed = remaining.some(o => o.category === deletedCategoryId);

                // Remove category if no longer used
                if (!categoryStillUsed) {
                    return prevCats.filter(cat => cat.id !== deletedCategoryId);
                }

                return prevCats;
            });
        }

        return remaining;
    });

    try {
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/offers/delete/${offerId}`,
            { withCredentials: true }
        );

    } catch (err) {
        // rollback
        setOffers(prev => [...prev, deleted]);

        if (setCategories && deleted) {
            setCategories(prevCats => {
                // Add category back if it was removed
                const categoryExists = prevCats.some(cat => cat.id === deleted.category);
                if (!categoryExists) {
                    return [...prevCats, deleted.category];
                }
                return prevCats;
            });
        }

        if (err.response?.data?.message) setError(err.response.data.message);
        else if (err.message) setError(err.message);
        else setError("Something went wrong");
    }
};

export const getOfferSheet = async (offer_id, setOffer , setMarkers , setError) => {
  try {

    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/offers/getOfferSheet/${offer_id}`);
    console.log(data);

    setOffer(data.offer); // assuming your API returns { offer: {...} }
    if(setMarkers){
        setMarkers(data.markers)
    }
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};


