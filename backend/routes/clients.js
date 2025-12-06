import express from 'express'
import { getBusinessesOfCategoryData, getBusinessPageData, getFeedPageData, getProfileData, getSubCategoriesOfCategory } from '../controllers/clients.js'
const clientsRouter=express.Router()

clientsRouter.get('/getFeedPageData',getFeedPageData)
clientsRouter.get('/getSubCategoriesOfCategory',getSubCategoriesOfCategory)
clientsRouter.get('/getbusinessesOfCategoryData',getBusinessesOfCategoryData)
clientsRouter.get('/getBusinessPageData',getBusinessPageData)
clientsRouter.get('/getprofileData',getProfileData)

export default clientsRouter