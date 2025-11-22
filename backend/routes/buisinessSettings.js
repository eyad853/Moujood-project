import express from 'express'
import { editSettings, getSettings } from '../controllers/buisinessSettings'
const businessSettingsRouter=express.Router()

businessSettingsRouter.get('/getBusinessPageData',getSettings)
businessSettingsRouter.patch('/getUserPageData',editSettings)

export default businessSettingsRouter