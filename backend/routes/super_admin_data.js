import express from 'express'
import { editBusinessActivity, getBusinessPageData, getCategoriesPageData, getDashboardPageData, getUserPageData } from '../controllers/super_admin_data.js'
import isAdmin from '../utils/isAdmin.js'
const suerAdminRouter=express.Router()

suerAdminRouter.get('/getBusinessPageData',getBusinessPageData)
suerAdminRouter.patch('/editBusinessActivity', isAdmin ,editBusinessActivity)
suerAdminRouter.get('/getUserPageData',getUserPageData)
suerAdminRouter.get('/getDashboardPageData',getDashboardPageData)
suerAdminRouter.get('/getCategoriesPageData',getCategoriesPageData)

export default suerAdminRouter