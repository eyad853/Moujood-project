import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [isNotificationSheetOpen , setIsNotificationSheetOpen]=useState(false)
    const [selectedNotification , setSelectedNotification]=useState(null)

  return (
    <NotificationContext.Provider value={{
      isNotificationSheetOpen,
      setIsNotificationSheetOpen,
      selectedNotification,
      setSelectedNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);