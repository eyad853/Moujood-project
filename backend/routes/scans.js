import express from 'express';
import {getBusinessOffersForScan,addScanAndPoints} from '../controllers/scans.js';

const scansRouter = express.Router();

scansRouter.get('/getBusinessOffers/:businessId',getBusinessOffersForScan);
scansRouter.post('/addScan',addScanAndPoints);

export default scansRouter;