import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
} from "../controllers/blogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createBlogValidator, commentValidator } from '../validators/blogValidators.js';
import validate from '../middleware/validate.js';


const router = express.Router();

router.route("/")
  .get(getAllBlogs)
  .post(verifyToken, createBlogValidator, validate, createBlog);

router.route("/:id")
  .get(getBlogById)
  .put(verifyToken, createBlogValidator, validate, updateBlog)
  .delete(verifyToken, deleteBlog);

router.post("/:id/like", verifyToken, toggleLike);
router.post("/:id/comment", verifyToken, commentValidator, validate, addComment);

export default router;
