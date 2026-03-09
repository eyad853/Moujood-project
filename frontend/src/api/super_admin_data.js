import axios from 'axios'

export const getBusinessPageData = async (setError , setBusinesses, t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getBusinessPageData`)
        console.log(response.data);
        setBusinesses(response.data)
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

export const editBusinessActivity = async (setError ,businesses, business , setBusinesses, t)=>{
    const oldBusinesses = [...businesses]; // rollback backup
    try{

    // Optimistic update
    setBusinesses(prev =>
      prev.map(item =>
        item.id === business.id
          ? { ...item, active: !item.active }
          : item
      )
    );
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/super_admin/editBusinessActivity/${business.id}` , {} , {withCredentials:true})
    }catch(err){
        setBusinesses(oldBusinesses);
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

export const getUserPageData = async (setError , setUsers , setTotalPercantage , setMalePercantage , setFemalePercantage, t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getUserPageData`)
        console.log(response.data);
        setUsers(response.data.total_users)
        setTotalPercantage(response.data.percentage_total)
        setMalePercantage(response.data.percentage_male)
        setFemalePercantage(response.data.percentage_female)
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

export const getDashboardPageData = async (setError, setPercentages , setTotalUsers , setTotalBusinesses , setTotalScans , setTotalSales , setSalesChartData, t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getDashboardPageData`)
        console.log(response.data);
        setPercentages(response.data.percentages)
        setTotalUsers(response.data.totalUsers)
        setTotalBusinesses(response.data.totalBusinesses)
        setTotalScans(response.data.totalScans)
        setTotalSales(response.data.totalSales)
        setSalesChartData(response.data.salesChartData)
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

export const getCategoriesPageData = async (setError , setCategories, t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getCategoriesPageData`)
        if(response){
            setCategories(response.data.categories)
        console.log(response.data);

        }
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

export const getOffersPageData = async (setError , setOffers, t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/super_admin/getOffersPageData`)
        console.log(response.data);
        setOffers(response.data)
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