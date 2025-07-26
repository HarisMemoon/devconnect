// models/Blog.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  content:  { type: String, required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
}, {
  timestamps: true,  // adds createdAt, updatedAt
});

export default mongoose.model("Blog", blogSchema);
