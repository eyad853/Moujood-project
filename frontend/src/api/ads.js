import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/ads`;

export const addAd = async (file, ads, setAds, setError) => {
  try {
    const tempId = Date.now();
    const tempAd = { id: tempId, image: URL.createObjectURL(file) };

    // Optimistic
    setAds([tempAd, ...ads]);

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(`${API}/add`, formData, {
        withCredentials:true,
        headers: { "Content-Type": "multipart/form-data" }
    });

    // Replace temporary with real returned ad
    setAds((prev) => prev.map((ad) => (ad.id === tempId ? res.data : ad)));

    return res.data;
  } catch (err) {
    if (err.response?.data?.message) {
        setError(err.response.data.message)
    } else if (err.message) {
        setError(err.message)
    } else {
        setError('Something went wrong')
    }
    // Rollback
    setAds((prev) => prev.filter((ad) => ad.id !== tempId));
  }
};

/* ============================
   GET ADS
============================ */
export const getAds = async (setError , setAds) => {
  try {
    const res = await axios.get(`${API}/get`);
    setAds(res.data)
  } catch (err) {
    if (err.response?.data?.message) {
        setError(err.response.data.message)
    } else if (err.message) {
        setError(err.message)
    } else {
        setError('Something went wrong')
    }
  }
};


export const editAd = async (id, file, ads, setAds, setError) => {
    const oldAd = ads.find((a) => a.id === id);
  try {

    const tempImage = URL.createObjectURL(file);

    // Optimistic update
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, image: tempImage } : ad))
    );

    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.patch(`${API}/update/${id}`, formData, {
        withCredentials:true,
        headers: { "Content-Type": "multipart/form-data" }
    });

    // Replace with real data
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? res.data : ad))
    );

  } catch (err) {
    if (err.response?.data?.message) {
        setError(err.response.data.message)
    } else if (err.message) {
        setError(err.message)
    } else {
        setError('Something went wrong')
    }

    // Rollback
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? oldAd : ad))
    );
  }
};

export const deleteAd = async (id, ads, setAds, setError) => {
  try {
    const oldAds = [...ads];

    // Optimistic remove
    setAds((prev) => prev.filter((ad) => ad.id !== id));

    await axios.delete(`${API}/delete/${id}`,{
        withCredentials:true
    });

  } catch (err) {
    if (err.response?.data?.message) {
        setError(err.response.data.message)
    } else if (err.message) {
        setError(err.message)
    } else {
        setError('Something went wrong')
    }

    // Rollback
    setAds(oldAds);
  }
};