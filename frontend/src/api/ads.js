import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/ads`;

export const addAd = async (file, ads, setAds, setError , t) => {
  try {

    if (!file) {
      setError(t(`limits:IMAGE_REQUIRED`));
      return;
    }

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
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }
    // Rollback
    setAds((prev) => prev.filter((ad) => ad.id !== tempId));
  }
};

export const getAds = async (setError , setAds , t) => {
  try {
    const res = await axios.get(`${API}/get`);
    setAds(res.data)
  } catch (err) {
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
};

export const editAd = async (id, file, ads, setAds, setError , t) => {
    const oldAd = ads.find((a) => a.id === id);
  try {

    if (!file) {
      setError(t("limits:IMAGE_REQUIRED"));
      return;
    }

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
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }

    // Rollback
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? oldAd : ad))
    );
  }
};

export const deleteAd = async (id, ads, setAds, setError , t) => {
  try {
    const oldAds = [...ads];

    // Optimistic remove
    setAds((prev) => prev.filter((ad) => ad.id !== id));

    await axios.delete(`${API}/delete/${id}`,{
        withCredentials:true
    });

  } catch (err) {
        if (err.response?.data?.message) {
            setError(t(`errors:${err.response.data.message}`))
        } else if (err.message === "Network Error") {
            setError(t("errors:NETWORK_ERROR"))
        } else if (err.message) {
            setError(t(`errors:${err.message}`))
        } else {
            setError(t("errors:SOMETHING_WENT_WRONG"))
        }

    // Rollback
    setAds(oldAds);
  }
};