import express from "express";
import { addUserCategory, getUserCategories, updateUserCategories } from "../controllers/lovedTopics.js";

const LovedCategoriesRouter = express.Router();

LovedCategoriesRouter.get("/get", getUserCategories);
LovedCategoriesRouter.put("/add", addUserCategory);
LovedCategoriesRouter.patch("/edit", updateUserCategories);

export default LovedCategoriesRouter;