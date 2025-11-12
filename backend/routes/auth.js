import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import passport from 'passport'
import { businessesSignup, localSignup, login, oauthRedirect } from '../controllers/auth.js'
import { uploadFile } from '../utils/multer.js'

const authRouter = express.Router()

authRouter.post('/business' ,uploadFile('logo').single('logo'), businessesSignup)
authRouter.post('/local' , localSignup)
authRouter.get('/google' , passport.authenticate('google'))
authRouter.get('/google/callback' , passport.authenticate('google', {failureRedirect: '/login' }) , oauthRedirect)
authRouter.get('/facebook' , passport.authenticate('facebook'))
authRouter.get('/facebook/callback' , passport.authenticate('facebook', { failureRedirect: '/login' }) , oauthRedirect)
authRouter.post('/login' , login)
 
export default authRouter