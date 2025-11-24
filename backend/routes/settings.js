import express from 'express'
import { editSettings, getSettings } from '../controllers/settings'
const settingsRouter=express.Router()

settingsRouter.get('/getSettings',getSettings)
settingsRouter.patch('/editSettings',editSettings)

export default settingsRouter