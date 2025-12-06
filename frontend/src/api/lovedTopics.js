import axios from "axios";

export const addUserCategory = async (setError, Ids) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/lovedCategoies/add`, {
      categories: Ids,
    });
  } catch (error) {
    if (err.response?.data?.message) setError(err.response.data.message);
    else if (err.message) setError(err.message);
    else setError("Something went wrong");
  }
};

export const updateUserCategories = async (setError, Ids) => {
  try {
    const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/lovedCategoies/edit`, {
      categories: Ids,
    });
  } catch (error) {
    if (err.response?.data?.message) setError(err.response.data.message);
    else if (err.message) setError(err.message);
    else setError("Something went wrong");
  }
};

export const getUserCategories = async (setError, setCategories) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lovedCategoies/get`);
    setCategories(res.data.categories);
  } catch (error) {
    if (err.response?.data?.message) setError(err.response.data.message);
    else if (err.message) setError(err.message);
    else setError("Something went wrong");
  }
};