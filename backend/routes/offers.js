import express from 'express'
import { addOffer, deleteOffer, editOffer, getBusinessOffers, getOffers } from '../controllers/offers'
import { uploadFile } from '../utils/multer'

const offersRoutes=express.Router()

offersRoutes.post('/add',addOffer)
offersRoutes.post('/edit',editOffer)
offersRoutes.post('/get',getOffers)
offersRoutes.post('/delete',deleteOffer)
offersRoutes.get('/getBusinessOffers',getBusinessOffers)

export default offersRoutes