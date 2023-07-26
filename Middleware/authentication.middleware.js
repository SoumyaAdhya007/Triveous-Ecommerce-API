// Import the required modules
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware function for authentication
const Authentication = (req, res, next) => {
  // Get the JWT token from the request's cookies or headers
  let token = req.cookies.token || req.headers.authorization.split(" ")[1];

  // Check if the token is missing
  if (!token) {
    // If token is missing, return a 401 Unauthorized status with an error message
    return res.status(401).send({ message: "Access Denied" });
  }

  // Verify the JWT token using the secret from the environment variable (LOGIN_TOKEN_SECRET)
  jwt.verify(token, process.env.LOGIN_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      // If token verification fails, return a 404 Not Found status with an error message
      return res.status(404).send({ message: err.message });
    }

    try {
      // If the token is valid, extract the user ID from the decoded token and add it to the request body
      req.body.userID = decoded.userID;
      // Call the next middleware or route handler in the chain
      next();
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      return res.status(500).send({ message: error.message });
    }
  });
};

// Export the middleware function to be used in other parts of the application
module.exports = {
  Authentication,
};
