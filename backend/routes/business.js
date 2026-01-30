import express from 'express'
import {getBusinessDashboardData, getBusinessOffers, getProfileData } from '../controllers/business.js'

const businessRouter=express.Router()

businessRouter.get('/getProfileData',getProfileData)
businessRouter.get('/getBusinessDashboardData',getBusinessDashboardData)
businessRouter.get('/getBusinessOffers',getBusinessOffers)


export default businessRouter