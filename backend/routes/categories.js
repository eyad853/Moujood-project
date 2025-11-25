import express from 'express'
import { createCategory, deleteCategory, editCategory, getAllCategories, getAllSubCategories } from '../controllers/categories.js'
import { uploadFile } from '../utils/multer.js'
const categoriesRouter=express.Router()

categoriesRouter.post('/createCategory',uploadFile('categories').single('image'),createCategory)
categoriesRouter.patch('/editCategory/:id',uploadFile('categories').single('image'),editCategory)
categoriesRouter.delete('/deleteCategory/:id',deleteCategory)
categoriesRouter.get('/getAllCategories',getAllCategories)
categoriesRouter.get('/getAllSubCategories',getAllSubCategories)

export default categoriesRouter