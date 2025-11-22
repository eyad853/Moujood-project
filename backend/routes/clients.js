import express from 'express'
import { getbusinessesOfCategoryData, getBusinessPageData, getFeedPageData, getprofileData, getSubCategoriesOfCategory } from '../controllers/clients'
const clientsRouter=express.Router()

clientsRouter.get('/getFeedPageData',getFeedPageData)
clientsRouter.get('/getSubCategoriesOfCategory',getSubCategoriesOfCategory)
clientsRouter.get('/getbusinessesOfCategoryData',getbusinessesOfCategoryData)
clientsRouter.get('/getBusinessPageData',getBusinessPageData)
clientsRouter.get('/getprofileData',getprofileData)

export default clientsRouter