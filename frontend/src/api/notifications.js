import axios from 'axios'

export const createNotification = async (notificationData,setUserNotifications , setBusinessNotifications,setLoading,setError) => {
  try {
    setLoading(true);
    setError('');

    console.log(notificationData);

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/notifications/createNotification`,notificationData);
    console.log('this is the create notification response:' , res);

    const notification = res.data.notification;
    notification.receiver_type==='user'?setUserNotifications(prev => [notification, ...prev]):setBusinessNotifications(prev => [notification, ...prev]);


  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Something went wrong');
    }
    console.error(err);

  } finally {
    setLoading(false);
  }
};

export const editNotification = async (id,notificationData,setError,setLoading ,  setUserNotifications , setBusinessNotifications) => {
  try {
    setLoading(true);
    setError('');

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
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Something went wrong');
    }
  } finally {
    setLoading(false);
  }
};

export const deleteNotification = async (id,receiver_type,setError , setNotifications,setUserNotifications,setBusinessNotifications) => {
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
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Something went wrong');
    }
  }
};


export const getAllNotifications = async (setError , receiver_type  , setUserNotifications , setBusinessNotifications)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getAllNotfications/${receiver_type}`)
        const notificatoins = response.data.notifications
        console.log(response.data);

        notificatoins&&receiver_type==='user'?setUserNotifications(notificatoins):setBusinessNotifications(notificatoins);
    }catch(err){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
    }
}

export const getAllUsers = async (setError , setUsers)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getAllUsers`)
        setUsers(response.data.users)
    }catch(err){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
    }
}

export const getAllBusinesses = async (setError , setBusinesses)=>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getAllBusinesses`)
        setBusinesses(response.data.businesses)
    }catch(err){
        if (err.response?.data?.message) {
            setError(err.response.data.message)
        } else if (err.message) {
            setError(err.message)
        } else {
            setError('Something went wrong')
        }
    }
}

export const fetchMyNotifications = async (receiver_type,setNotifications,setError) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getMyNotifications/${receiver_type}`, {withCredentials:true})
    console.log(res.data);
    setNotifications(res.data.notifications);
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

export const fetchNotificationDetails = async (
  notification_id,
  setNotification,
  setError
) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getNotificationDetails/${notification_id}`);
    console.log(res.data);

    setNotification(res.data.notification);

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

export const fetchNotificationCount = async (
  receiver_type,
  setNotificationsCount,
  setError
) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/getNotificationCount/${receiver_type}`, {withCredentials:true});
    console.log(res.data);
    setNotificationsCount(res.data.count);

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

export const markAllNotificationsAsRead = async (
  receiver_type,
  notifications,
  setNotifications,
  setError
) => {
  console.log('starting markin');
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
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};
