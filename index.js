// Import required modules
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const rateLimit = require("express-rate-limit");

// Create an instance of the Express application
const app = express();

// Connect to the MongoDB database
const connection = require("./Config/db");

// Import routers for different routes
const { UserRouter } = require("./Routes/user.router");
const { CategoryRouter } = require("./Routes/category.router");
const { ProductRouter } = require("./Routes/product.router");
const { CartRouter } = require("./Routes/cart.router");
const { OrdersRouter } = require("./Routes/order.router");
// Use necessary middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON data
app.use(cookieParser()); // Parse cookies from incoming requests

// Define a basic route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome To E-Commerce API");
});
// Rate limiting settings (you can customize these values as per your requirement)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Apply the rate limiter to all requests
app.use(limiter);
// Serve the Swagger documentation using Swagger UI Express
// Register different routers for specific routes
app.use("/user", UserRouter); // User-related routes
app.use("/category", CategoryRouter); // Category-related routes
app.use("/product", ProductRouter); // Product-related routes
app.use("/cart", CartRouter); // Cart-related routes
app.use("/order", OrdersRouter); // Order-related routes
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:7080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
