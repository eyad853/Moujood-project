import dotenv from 'dotenv' 
dotenv.config()
import express from 'express'
import {businessesSignup, editAccount, forgotPassword, getUser, handleFacebookAuth, handleGoogleAuth, localSignup, login, logout, resendVerificationEmail, resetPassword, verifyEmail } from '../controllers/auth.js'
import { uploadFile } from '../utils/multer.js' 
import ensureAuth from '../utils/ensureAuth.js'


const authRouter = express.Router()

authRouter.post('/business' ,uploadFile('logo').single('image'), businessesSignup)
authRouter.post('/local' , localSignup)
authRouter.post('/google' , handleGoogleAuth)
authRouter.post('/facebook' , handleFacebookAuth)
authRouter.post('/login' , login)
authRouter.get('/me' ,ensureAuth, getUser)
authRouter.post('/logout' , logout)
authRouter.patch('/editAccount' ,uploadFile('logo').single('image'), editAccount)
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/resend-verify-email", resendVerificationEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
export default authRouter