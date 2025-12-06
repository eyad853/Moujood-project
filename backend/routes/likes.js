import express from "express";
import { createLike, deleteLike } from "../controllers/likes.js";

const likesRouter = express.Router();

likesRouter.post("/create/:offer_id", createLike);
likesRouter.delete("/delete/:offer_id", deleteLike);

export default likesRouter;