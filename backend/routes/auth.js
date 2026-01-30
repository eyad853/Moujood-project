import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import passport from 'passport'
import {businessesSignup, editAccount, getUser, localSignup, login, logout, oauthRedirect } from '../controllers/auth.js'
import { uploadFile } from '../utils/multer.js' 
import ensureAuth from '../utils/ensureAuth.js'


const authRouter = express.Router()

authRouter.post('/business' ,uploadFile('logo').single('image'), businessesSignup)
authRouter.post('/local' , localSignup)
authRouter.get('/google' , passport.authenticate('google' , {scope:['profile','email']}))
authRouter.get('/google/callback' , passport.authenticate('google', {failureRedirect: `${process.env.frontendURL}/login` }) , oauthRedirect)
authRouter.get('/facebook' , passport.authenticate('facebook' , { scope: ['email']} ))
authRouter.get('/facebook/callback' , passport.authenticate('facebook', { failureRedirect: `${process.env.frontendURL}/login` }) , oauthRedirect)
authRouter.post('/login' , login)
authRouter.get('/me' ,ensureAuth, getUser)
authRouter.post('/logout' , logout)
authRouter.patch('/editAccount' ,uploadFile('logo').single('image'), editAccount)
export default authRouter