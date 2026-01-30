import axios from 'axios';

export const addScan = async (data,navigate,setError , setLoading) => {
  try {
    setLoading(true)
    const response = await axios.post('/api/scans/scan',data);

    if (!response.data.error) {
      navigate('/client/feed');
    }
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }finally{
    setLoading(false)
  }
};


export const getBusinessOffersForScan = async (businessId,setOffers,setError) => {
  try {
    const response = await axios.get(`/api/scans/business/${businessId}/offers`);

    setOffers(response.data.offers);

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