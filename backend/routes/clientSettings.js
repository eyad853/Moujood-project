import express from 'express'
import { editSettings, getSettings } from '../controllers/clientSettings'
const clientSettingsRouter=express.Router()

clientSettingsRouter.get('/getBusinessPageData',getSettings)
clientSettingsRouter.patch('/getUserPageData',editSettings)

export default clientSettingsRouter