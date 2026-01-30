import express from 'express'
import { createNotification, deleteNotification, editNotification, getAllBusinesses, getAllNotifications, getAllUsers, getMyNotifications, getNotificationCount, getNotificationDetails, markAllNotificationsAsRead } from '../controllers/notifications.js'
const notificationsRouter=express.Router()

notificationsRouter.post('/createNotification',createNotification)
notificationsRouter.patch('/editNotification/:id',editNotification)
notificationsRouter.delete('/deleteNotification/:id',deleteNotification)
notificationsRouter.get('/getAllNotfications/:receiver_type',getAllNotifications)
notificationsRouter.get("/getAllUsers", getAllUsers);
notificationsRouter.get("/getAllBusinesses", getAllBusinesses);
notificationsRouter.get("/getMyNotifications/:receiver_type", getMyNotifications);
notificationsRouter.get("/getNotificationDetails/:notification_id", getNotificationDetails);
notificationsRouter.get("/getNotificationCount/:receiver_type", getNotificationCount);
notificationsRouter.post("/markAllNotificationsAsRead/:receiver_type", markAllNotificationsAsRead);

export default notificationsRouter