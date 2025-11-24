import express from 'express'
import { editBusinessActivity, getBusinessPageData, getDashboardPageData, getUserPageData } from '../controllers/super_admin_data'
const suerAdminRouter=express.Router()

suerAdminRouter.get('/getBusinessPageData',getBusinessPageData)
suerAdminRouter.patch('/editBusinessActivity',editBusinessActivity)
suerAdminRouter.get('/getUserPageData',getUserPageData)
suerAdminRouter.get('/getDashboardPageData',getDashboardPageData)

export default suerAdminRouter