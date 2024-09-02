const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://friendly-bombolone-b19b9a.netlify.app",
  "https://main--friendly-bombolone-b19b9a.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const expenseRoute = require("./routes/expenseRout");
const userRoute = require("./routes/userRoute");

// Function to connect to the database
const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      await mongoose.connect(process.env.secretUrl, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log("Connected to MongoDB");
      return;
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      // Wait for 5 seconds before retrying
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  console.error("Could not connect to MongoDB. Exiting...");
  process.exit(1);
};

// Function to start the server
const startServer = () => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Main function to run the application
const main = async () => {
  await connectDB(); // This will now retry up to 5 times

  // Apply routes
  app.use(expenseRoute);
  app.use(userRoute);

  // Start the server
  startServer();
};

main().catch((err) => console.error(err));

// Error handling for unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});
