import express from 'express'
import { editProfileData, getProfileData } from '../controllers/business_profile'

const business_profileRoutes=express.Router()

business_profileRoutes.get('/getProfileData',getProfileData)
business_profileRoutes.patch('/editProfileData',editProfileData)

export default business_profileRoutes