import express from 'express'
import { addOffer, deleteOffer, editOffer, getOffers } from '../controllers/offers'
import { uploadFile } from '../utils/multer'

const offersRouter=express.Router()

offersRouter.post('/add',addOffer)
offersRouter.post('/edit/:offer_id',editOffer)
offersRouter.post('/get',getOffers)
offersRouter.post('/delete',deleteOffer)

export default offersRouter