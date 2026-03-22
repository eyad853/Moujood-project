import axios from 'axios'

export const createNotification = async (notificationData,setUserNotifications , setBusinessNotifications,setLoading,setError , t) => {
  try {
    setLoading(true);
    setError('');

    if (!notificationData.title || notificationData.title.trim().length === 0) {
      setError(t("limits:NOTIFICATION_TITLE_REQUIRED"));
      return;
    }
    if (notificationData.title.length > 100) {
      setError(t("limits:NOTIFICATION_TITLE_TOO_LONG"));
      return;
    }

    if (!notificationData.message || notificationData.message.trim().length === 0) {
      setError(t("limits:NOTIFICATION_MESSAGE_REQUIRED"));
      return;
    }
    if (notificationData.message.length > 2000) {
      setError(t("limits:NOTIFICATION_MESSAGE_TOO_LONG"));
      return;
    }

    if (!notificationData.receiver_type || !["user", "business"].includes(notificationData.receiver_type)) {
      setError(t("limits:INVALID_RECEIVER_TYPE"));
      return;
    }

    // if (!notificationData.filter_value || notificationData.filter_value.toString().trim().length === 0) {
    //   setError(t("limits:FILTER_VALUE_REQUIRED"));
    //   return;
    // }

    // ✅ Conditional validation for 'specific'
    if (notificationData.filter_type === "specific") {
      if (!notificationData.specific_names || notificationData.specific_names.length === 0) {
        setError(t("limits:SPECIFIC_NAMES_REQUIRED"));
        return;
      }
    }

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/notifications/createNotification`,notificationData);

    const notification = res.data.notification;
    notification.receiver_type==='user'?setUserNotifications(prev => [notification, ...prev]):setBusinessNotifications(prev => [notification, ...prev]);


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
    console.error(err);

  } finally {
    setLoading(false);
  }
};

export const editNotification = async (id,notificationData,setError,setLoading ,  setUserNotifications , setBusinessNotifications , t) => {
  try {
    setLoading(true);
    setError('');

    if (!notificationData.title || notificationData.title.trim().length === 0) {
      setError(t("limits:NOTIFICATION_TITLE_REQUIRED"));
      return;
    }
    if (notificationData.title.length > 100) {
      setError(t("limits:NOTIFICATION_TITLE_TOO_LONG"));
      return;
    }

    if (!notificationData.message || notificationData.message.trim().length === 0) {
      setError(t("limits:NOTIFICATION_MESSAGE_REQUIRED"));
      return;
    }
    if (notificationData.message.length > 2000) {
      setError(t("limits:NOTIFICATION_MESSAGE_TOO_LONG"));
      return;
    }

    if (!notificationData.receiver_type || !["user", "business"].includes(notificationData.receiver_type)) {
      setError(t("limits:INVALID_RECEIVER_TYPE"));
      return;
    }

    if (!notificationData.filter_value || notificationData.filter_value.toString().trim().length === 0) {
      setError(t("limits:FILTER_VALUE_REQUIRED"));
      return;
    }

    // ✅ Conditional validation for 'specific'
    if (notificationData.filter_type === "specific") {
      if (!notificationData.specific_names || notificationData.specific_names.length === 0) {
        setError(t("limits:SPECIFIC_NAMES_REQUIRED"));
        return;
      }
    }

    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/notifications/editNotification/${id}`,
      notificationData
    );

     const updatedNotification = response.data.notification;

    // Update UI state
    if (updatedNotification.receiver_type === 'user') {
      setUserNotifications(prev =>
        prev.map(n => (n.id === updatedNotification.id ? updatedNotification : n))
      );
    } else {
      setBusinessNotifications(prev =>
        prev.map(n => (n.id === updatedNotification.id ? updatedNotification : n))
      );
    }

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
  } finally {
    setLoading(false);
  }
};

export const deleteNotification = async (id,receiver_type,setError , setNotifications,setUserNotifications,setBusinessNotifications , t) => {
  let backup = null;

  try {
    if(setUserNotifications || setBusinessNotifications){
      // 1️⃣ Optimistic UI update (save backup)
      if (receiver_type === 'user') {
        setUserNotifications(prev => {
          backup = prev;
          return prev.filter(n => n.id !== id);
        });
      } else {
        setBusinessNotifications(prev => {
          backup = prev;
          return prev.filter(n => n.id !== id);
        });
      }
    }

    if(setNotifications){
      setNotifications(prev=>prev.filter(n=>n.id!==id))
    }

    // 2️⃣ Backend request
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/notifications/deleteNotification/${id}`, {withCredentials:true}
    );

  } catch (err) {
    // 3️⃣ Rollback UI
    if (backup) {
      receiver_type === 'user'
        ? setUserNotifications(backup)
        : setBusinessNotifications(backup);
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
};

export const getAllNotifications = async (setError , receiver_type  , setUserNotifications , setBusinessNotifications , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getAllNotfications/${receiver_type}`)
        const notificatoins = response.data.notifications
        notificatoins&&receiver_type==='user'?setUserNotifications(notificatoins):setBusinessNotifications(notificatoins);
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

export const getAllUsers = async (setError , setUsers , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getAllUsers`)
        setUsers(response.data.users)
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

export const getAllBusinesses = async (setError , setBusinesses , t)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getAllBusinesses`)
        setBusinesses(response.data.businesses)
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

export const fetchMyNotifications = async (receiver_type,setNotifications,setError , t) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getMyNotifications/${receiver_type}`, {withCredentials:true})
    setNotifications(res.data.notifications);
    return res.data.notifications
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

export const fetchNotificationDetails = async (notification_id,setNotification,setError , t) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getNotificationDetails/${notification_id}`);
    setNotification(res.data.notification);

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

export const fetchNotificationCount = async (receiver_type,setNotificationsCount,setError , t) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getNotificationCount/${receiver_type}`, {withCredentials:true});
    setNotificationsCount(res.data.count);

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

export const markAllNotificationsAsRead = async (receiver_type,notifications,setNotifications,setError , t) => {
  const prevNotifications = notifications;

  // 🔹 optimistic update
  setNotifications(
    notifications.map(n => ({
      ...n,
      is_read: true
    }))
  );

  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/notifications/markAllNotificationsAsRead/${receiver_type}` ,{} ,   {withCredentials:true});

  } catch (err) {
    // 🔴 rollback
    setNotifications(prevNotifications);

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
