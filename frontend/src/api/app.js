import axios from 'axios'

export const fetchAppVersion = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/app/version`);
    
    // Make sure response is valid
    if (!response.data.error) {
      const { latestVersion } = response.data;
      return latestVersion
    }
  } catch (error) {
    console.log(error);
  }
};