import { Router } from 'express';
import { uploadFile } from '../utils/multer.js';
import { addAd, deleteAd, editAd, getAds } from '../controllers/ads.js';

const adsRouter = Router();

const upload = uploadFile('ads'); // uploads/ads folder

adsRouter.post('/add', upload.single('image'), addAd);
adsRouter.get('/get', getAds);
adsRouter.patch('/update/:id', upload.single('image'), editAd);
adsRouter.delete('/delete/:id', deleteAd);

export default adsRouter;