// Import required modules
const express = require("express");
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = +process.env.saltRounds;
const LOGIN_TOKEN_SECRET = process.env.LOGIN_TOKEN_SECRET;
const UserModel = require("../Models/user.model");
const { Authentication } = require("../Middleware/authentication.middleware");
// Swagger documentation for /signup route
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User Registered Successfully
 *       409:
 *         description: Conflict - Please provide all fields / Email or Phone number already registered
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

// UserRouter.post("/signup", ...)
// Route to register a new user
UserRouter.post("/signup", async (req, res) => {
  // Extract user details from the request body
  const { name, email, password, phone } = req.body;

  // Check if all required user details are provided
  if (!name || !email || !phone || !password) {
    return res.status(409).send({ message: "Please provide all fields" });
  }

  try {
    // Check if a user with the provided email or phone already exists
    const userWithEmailExists = await UserModel.findOne({ email });
    const userWithPhoneExists = await UserModel.findOne({ phone });

    if (userWithEmailExists || userWithPhoneExists) {
      return res.status(409).send({
        message: `${
          userWithEmailExists && userWithPhoneExists
            ? "Email & Phone Number"
            : userWithEmailExists
            ? "Email"
            : "Phone number"
        } already registered`,
      });
    }

    // Hash the user's password using bcrypt
    bcrypt.hash(password, saltRounds, async (err, hashedPass) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }

      try {
        // Create a new UserModel instance with the user details
        const user = new UserModel({
          name,
          email,
          password: hashedPass,
          phone,
        });

        // Save the user to the database
        await user.save();

        // Return a success message with a 201 Created status
        res.status(201).send({ message: "User Registered Successfully" });
      } catch (error) {
        // If any error occurs during processing, return a 500 Internal Server Error status with an error message
        return res.status(500).send({ message: error.message });
      }
    });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userInfo:
 *                   $ref: "#/components/schemas/User"
 *       401:
 *         description: Unauthorized - Wrong Credentials
 *       404:
 *         description: Not Found - User not found
 *       409:
 *         description: Conflict - Provide email and password to login
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       headers:
 *         Set-Cookie:
 *           schema:
 *             type: string
 *             example: "token=YOUR_JWT_TOKEN; HttpOnly; Max-Age=604800; Path=/"
 */

// UserRouter.post("/login", ...)
// Route to authenticate a user and generate a JWT token upon successful login
UserRouter.post("/login", async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(409)
      .send({ message: "Provide email and password to login" });
  }

  try {
    // Find the user with the provided email
    const user = await UserModel.findOne({ email });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database using bcrypt
    bcrypt.compare(password, user.password, async function (err, result) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }

      if (result) {
        // If the password is correct, generate a JWT token
        const expiresIn = 7 * 24 * 60 * 60;
        const token = jwt.sign(
          { userID: user._id, role: "user" },
          LOGIN_TOKEN_SECRET,
          {
            expiresIn,
          }
        );

        // Set the JWT token as a cookie
        res.cookie("token", token);

        // Return a success message along with user information
        res.status(200).send({
          message: "Login Successful",
          userInfo: user,
        });
      } else {
        // If the password is incorrect, return a 401 Unauthorized status with an error message
        res.status(401).send({ message: "Wrong Credentials" });
      }
    });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

// UserRouter.use(Authentication);
// Middleware to ensure authentication for the routes below
UserRouter.use(Authentication);

/**
 * @swagger
 * /user/details:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         description: Unauthorized - User not found / Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         cart:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *         address:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               pincode:
 *                 type: number
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               road_name:
 *                 type: string
 *               isSelected:
 *                 type: boolean
 */

// UserRouter.get("/details", ...)
// Route to retrieve user details by userID
UserRouter.get("/details", async (req, res) => {
  // Extract userID from the request body (already authenticated through middleware)
  const userID = req.body.userID;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 401 Unauthorized status with an error message
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    // Return the user details with a 200 OK status
    res.status(200).send(user);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /user/address:
 *   get:
 *     summary: Get user addresses
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - User addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserAddress"
 *       401:
 *         description: Unauthorized - User not found / Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       properties:
 *         pincode:
 *           type: number
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         road_name:
 *           type: string
 *         isSelected:
 *           type: boolean
 */

// UserRouter.get("/address", ...)
// Route to retrieve user addresses by userID
UserRouter.get("/address", async (req, res) => {
  // Extract userID from the request body (already authenticated through middleware)
  const userID = req.body.userID;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 401 Unauthorized status with an error message
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    // Return the user's addresses with a 200 OK status
    res.status(200).send(user.address);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /user/address/add:
 *   post:
 *     summary: Add a new address for the user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pincode:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               road_name:
 *                 type: string
 *               isSelected:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OK - User address saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

// UserRouter.post("/address/add", ...)
// Route to add a new address to the user's address list
UserRouter.post("/address/add", async (req, res) => {
  // Extract address details from the request body
  const {
    userID,
    pincode,
    state,
    city,
    road_name,
    isSelected = false,
  } = req.body;

  // Check if all address details are provided
  if (!pincode || !state || !city || !road_name) {
    return res.status(404).send({ message: "Please provide all details" });
  }

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Create a new address object
    const newAddress = {
      pincode,
      state,
      city,
      road_name,
      isSelected,
    };

    // Push the new address to the user's address list
    user.address.push(newAddress);

    // Save the updated user to the database
    await user.save();

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "User address saved successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /user/address/select/{id}:
 *   patch:
 *     summary: Select a user address
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the address to select
 *     responses:
 *       200:
 *         description: OK - Address selected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - User not found / Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Address not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

// UserRouter.patch("/address/select/:id", ...)
// Route to select a specific address as the user's default address
UserRouter.patch("/address/select/:id", async (req, res) => {
  // Extract address ID and userID from the request parameters and body (already authenticated through middleware)
  const id = req.params.id;
  const userID = req.body.userID;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 401 Unauthorized status with an error message
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    // Find the selected address in the user's address list
    const selectedAddress = user.address.find(
      (addr) => addr._id.toString() === id
    );

    // If the selected address is not found, return a 404 Not Found status with an error message
    if (!selectedAddress) {
      return res.status(404).send({ message: "Address not found" });
    }

    // Mark the selected address as "isSelected" and update other addresses accordingly
    selectedAddress.isSelected = true;
    user.address.forEach((addr) => {
      if (addr._id.toString() !== id) {
        addr.isSelected = false;
      }
    });

    // Save the updated user to the database
    await user.save();

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "Address selected successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

// Export the UserRouter to be used in other parts of the application
module.exports = { UserRouter };
