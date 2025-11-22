import express from 'express'
import { createCategory, deleteCategory, editCategory, getAllCategories, getAllSubCategories } from '../controllers/categories'
const categoriesRouter=express.Router()

categoriesRouter.post('/createCategory',createCategory)
categoriesRouter.patch('/editCategory',editCategory)
categoriesRouter.delete('/deleteCategory',deleteCategory)
categoriesRouter.get('/getAllCategories',getAllCategories)
categoriesRouter.get('/getAllSubCategories',getAllSubCategories)

export default categoriesRouter