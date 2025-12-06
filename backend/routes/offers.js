import express from 'express'
import { addOffer, deleteOffer, editOffer, getOffers } from '../controllers/offers.js'
import { uploadFile } from '../utils/multer.js'
import B_SA from '../utils/B&SA.js'

const offersRouter=express.Router()

offersRouter.post('/add',uploadFile('offers').single('image') ,addOffer)
offersRouter.patch('/edit/:offer_id',uploadFile('offers').single('image'),editOffer)
offersRouter.get('/get',getOffers)
offersRouter.delete('/delete/:offer_id',deleteOffer)

export default offersRouter

