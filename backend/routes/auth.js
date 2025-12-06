import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import passport from 'passport'
import {businessesSignup, getUser, localSignup, login, oauthRedirect } from '../controllers/auth.js'
import { uploadFile } from '../utils/multer.js' 
import ensureAuth from '../utils/ensureAuth.js'


const authRouter = express.Router()

authRouter.post('/business' ,uploadFile('logo').single('image'), businessesSignup)
authRouter.post('/local' , localSignup)
authRouter.get('/google' , passport.authenticate('google' , {scope:['profile','email']}))
authRouter.get('/google/callback' , passport.authenticate('google', {failureRedirect: '/login' }) , oauthRedirect)
authRouter.get('/facebook' , passport.authenticate('facebook' , {scope:['email']}))
authRouter.get('/facebook/callback' , passport.authenticate('facebook', { failureRedirect: '/login' }) , oauthRedirect)
authRouter.post('/login' , login)
authRouter.get('/me' ,ensureAuth, getUser)
authRouter.delete('/logout' , getUser)
 
export default authRouter