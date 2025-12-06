import express from "express";
import { createComment, deleteComment, updateComment } from "../controllers/comments.js";

const commentsRouter = express.Router();

commentsRouter.post("/create/:offer_id", createComment);
commentsRouter.patch("/update/:comment_id", updateComment);
commentsRouter.delete("/delete/:id", deleteComment);

export default commentsRouter;
