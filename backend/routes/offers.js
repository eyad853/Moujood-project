import express from 'express'
import { addOffer, deleteOffer, editOffer, getOffers, getOfferSheet } from '../controllers/offers.js'
import { uploadFile } from '../utils/multer.js'
import B_SA from '../utils/B&SA.js'

const offersRouter=express.Router()

offersRouter.post('/add',uploadFile('offers').single('image') ,addOffer)
offersRouter.patch('/edit/:offer_id' ,B_SA , uploadFile('offers').single('image'),editOffer)
offersRouter.get('/get',getOffers)
offersRouter.delete('/delete/:offer_id' ,B_SA ,deleteOffer)
offersRouter.get('/getOfferSheet/:offer_id',getOfferSheet)

export default offersRouter

