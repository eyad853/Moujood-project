import express from 'express'
import { editProfileData, getBusinessDashboardData, getProfileData } from '../controllers/business'

const businessRoutes=express.Router()

businessRoutes.get('/getProfileData',getProfileData)
businessRoutes.get('/getBusinessDashboardData',getBusinessDashboardData)
businessRoutes.patch('/editProfileData',editProfileData)

export default businessRoutes