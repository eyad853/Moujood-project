import express from 'express'
import { getBusinessesOfCategory, getBusinessPageData, getFeedPageData, getSubCategoriesOfCategory, getUserPoints } from '../controllers/clients.js'
const clientsRouter=express.Router()

clientsRouter.get('/getFeedPageData',getFeedPageData)
clientsRouter.get('/getSubCategoriesOfCategory/:category_id',getSubCategoriesOfCategory)
clientsRouter.get('/getbusinessesOfCategory/:id',getBusinessesOfCategory)
clientsRouter.get('/getBusinessPageData/:businessId',getBusinessPageData)
clientsRouter.get('/getUserPoints', getUserPoints);


export default clientsRouter