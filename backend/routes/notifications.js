import express from 'express'
import { createNotification, deleteNotification, editNotification, getAllNotifications } from '../controllers/notifications.js'
const notificationsRouter=express.Router()

notificationsRouter.post('/createNotification',createNotification)
notificationsRouter.patch('/editNotification',editNotification)
notificationsRouter.delete('/deleteNotification',deleteNotification)
notificationsRouter.get('/getAllNotfications',getAllNotifications)

export default notificationsRouter