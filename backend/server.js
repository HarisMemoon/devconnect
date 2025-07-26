import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// 👇 Conditionally load the correct .env file
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
  console.log('✅ Loaded .env.test for testing');
} else {
  dotenv.config();
  console.log('✅ Loaded default .env');
}

const PORT = process.env.PORT || 5000;

// Connect DB and start server (only if not testing)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

export default app; // 👈 Important: allows tests to import app without starting the server
