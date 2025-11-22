import express from 'express'
import { getBusinessPageData, getDashboardPageData, getUserPageData } from '../controllers/super_admin_data'
const categoriesRouter=express.Router()

categoriesRouter.get('/getBusinessPageData',getBusinessPageData)
categoriesRouter.get('/getUserPageData',getUserPageData)
categoriesRouter.get('/getDashboardPageData',getDashboardPageData)

export default categoriesRouter