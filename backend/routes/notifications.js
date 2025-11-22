import express from 'express'
import { createNotification, deleteNotification, editNotification, getAllNotfications } from '../controllers/notifications'
const notificationsRouter=express.Router()

notificationsRouter.post('/createNotification',createNotification)
notificationsRouter.patch('/editNotification',editNotification)
notificationsRouter.delete('/deleteNotification',deleteNotification)
notificationsRouter.get('/getAllNotfications',getAllNotfications)

export default notificationsRouter