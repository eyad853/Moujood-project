import express from 'express'
import { addOffer, deleteOffer, editOffer, getOffers } from '../controllers/offers.js'
import { uploadFile } from '../utils/multer.js'
import B_SA from '../utils/B&SA.js'

const offersRouter=express.Router()

offersRouter.post('/add',uploadFile('offers').single('image') ,addOffer)
offersRouter.post('/edit/:offer_id',uploadFile('offers').single('image') , B_SA,editOffer)
offersRouter.post('/get',getOffers)
offersRouter.post('/delete/:offer_id',deleteOffer)

export default offersRouter