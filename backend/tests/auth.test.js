import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

// After each test: clear users collection
afterEach(async () => {
  await User.deleteMany();
});

// —— Registration tests
describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "TestUser",
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toMatch(/registered successfully/i);

    // Confirm in DB
    const userInDb = await User.findOne({ email: "testuser@example.com" });
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe("TestUser");
  });

  it("should not allow duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      username: "UserOne",
      email: "dupe@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      username: "UserTwo",
      email: "dupe@example.com",
      password: "password456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("already exists");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "nofield@example.com" }); // missing username & password

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});

// —— Login tests
describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    // seed a user to login against
    await request(app).post("/api/auth/register").send({
      username: "haris",
      email: "haris@example.com",
      password: "123456",
    });
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "haris@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toMatch(/login successful/i);
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "haris@example.com",
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("invalid");
  });

  it("should not login non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nouser@example.com",
        password: "pass123",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "haris@example.com" }); // missing password

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
