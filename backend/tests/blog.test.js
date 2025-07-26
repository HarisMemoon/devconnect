// tests/blog.test.js

import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import jwt from "jsonwebtoken";

let token;
let userId;

beforeAll(async () => {
  // Clear only blogs, not users (to avoid conflicts with other tests)
  await Blog.deleteMany({});

  // Create test user (or find existing one)
  let user = await User.findOne({ email: "blogtestuser@example.com" });
  if (!user) {
    user = await User.create({
      username: "blogtestuser",
      email: "blogtestuser@example.com",
      password: "Test@1234",
    });
  }

  userId = user._id;

  // Generate token
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
});

afterEach(async () => {
  await Blog.deleteMany({});
});

describe("Blog Routes", () => {
  test("Should create a blog", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        content: "This is a test blog post.",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Blog");
    expect(res.body.author).toBe(userId.toString());
  });

  test("Should fetch all blogs", async () => {
    await Blog.create({
      title: "Another Blog",
      content: "Test content",
      author: userId,
    });

    const res = await request(app).get("/api/blogs");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Should fetch single blog by ID", async () => {
    const blog = await Blog.create({
      title: "Single Blog",
      content: "More test content",
      author: userId,
    });

    const res = await request(app).get(`/api/blogs/${blog._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Single Blog");
  });

  test("Should update blog", async () => {
    const blog = await Blog.create({
      title: "Old Title",
      content: "Old content",
      author: userId,
    });

    const res = await request(app)
      .put(`/api/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        content: "Updated content",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("Should delete blog", async () => {
    const blog = await Blog.create({
      title: "To be deleted",
      content: "Some content",
      author: userId,
    });

    const res = await request(app)
      .delete(`/api/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("Should like a blog", async () => {
    const blog = await Blog.create({
      title: "Likeable Blog",
      content: "Some content",
      author: userId,
    });

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.likes.length).toBe(1);
    expect(res.body.likes[0]).toBe(userId.toString());
  });

  test("Should add a comment", async () => {
    const blog = await Blog.create({
      title: "Commentable Blog",
      content: "Some content",
      author: userId,
    });

    const res = await request(app)
      .post(`/api/blogs/${blog._id}/comment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Nice blog!",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.comments.length).toBe(1);
    expect(res.body.comments[0].text).toBe("Nice blog!");
  });
});
