import express from 'express'
import {getBusinessDashboardData, getBusinessOffers } from '../controllers/business.js'

const businessRouter=express.Router()

businessRouter.get('/getBusinessDashboardData',getBusinessDashboardData)
businessRouter.get('/getBusinessOffers',getBusinessOffers)


export default businessRouter