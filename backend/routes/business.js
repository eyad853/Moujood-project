import express from 'express'
import { editProfileData, getBusinessDashboardData, getBusinessOffers, getProfileData } from '../controllers/business.js'

const businessRouter=express.Router()

businessRouter.get('/getProfileData',getProfileData)
businessRouter.get('/getBusinessDashboardData',getBusinessDashboardData)
businessRouter.patch('/editProfileData',editProfileData)
businessRouter.get('/getBusinessOffers',getBusinessOffers)


export default businessRouter