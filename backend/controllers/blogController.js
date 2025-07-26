// controllers/blogController.js
import Blog from "../models/Blog.js";

// @desc   Create a new blog post
// @route  POST /api/blogs
// @access Private
export const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
    });
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// @desc   Get all blog posts
// @route  GET /api/blogs
// @access Public
export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .populate("comments.user", "username");
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// @desc   Get single blog post by ID
// @route  GET /api/blogs/:id
// @access Public
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username email")
      .populate("comments.user", "username");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// @desc   Update a blog post
// @route  PUT /api/blogs/:id
// @access Private (only author)
export const updateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a blog post
// @route  DELETE /api/blogs/:id
// @access Private (only author)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc   Like or Unlike a blog post
// @route  POST /api/blogs/:id/like
// @access Private
export const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user._id.toString();
    const index = blog.likes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      blog.likes.push(req.user._id);
    } else {
      blog.likes.splice(index, 1);
    }
    await blog.save();
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// @desc   Add a comment
// @route  POST /api/blogs/:id/comment
// @access Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = {
      user: req.user._id,
      text,
    };
    blog.comments.push(comment);
    await blog.save();
    // populate the newly added comment's user field
    const populated = await blog.populate("comments.user", "username");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};
