// Import required modules
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// Create an instance of the Express application
const app = express();

// Connect to the MongoDB database
const connection = require("./Config/db");
// Import the swagger.js file
// const swaggerSpec = require("./swagger");
// Import routers for different routes
const { UserRouter } = require("./Routes/user.router");
const { CategoryRouter } = require("./Routes/category.router");
const { ProductRouter } = require("./Routes/product.router");
const { CartRouter } = require("./Routes/cart.router");
const { OrdersRouter } = require("./Routes/order.router");
// Use necessary middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(cookieParser()); // Parse cookies from incoming requests
app.use(express.json()); // Parse incoming JSON data

// Define a basic route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome To E-Commerce API");
});
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);
// Register different routers for specific routes
app.use("/user", UserRouter); // User-related routes
app.use("/category", CategoryRouter); // Category-related routes
app.use("/product", ProductRouter); // Product-related routes
app.use("/cart", CartRouter); // Cart-related routes
app.use("/order", OrdersRouter); // Order-related routes

// Start the server and listen on the specified port
app.listen(process.env.PORT, async () => {
  try {
    // Wait for the database connection to be established before starting the server
    await connection;
    console.log(`Connected to MongoDB`);
    console.log(`Server listening on port ${process.env.PORT}`);
  } catch (error) {
    console.log(`Error listening on port ${process.env.PORT} => ${error}`);
  }
});
