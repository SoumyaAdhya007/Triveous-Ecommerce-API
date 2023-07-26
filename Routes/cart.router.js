// Import required modules
const express = require("express");

// Create an Express router instance
const CartRouter = express.Router();

// Import Mongoose models

const UserModel = require("../Models/user.model");
const ProductModel = require("../Models/product.model");

// Import the Authentication middleware
const { Authentication } = require("../Middleware/authentication.middleware");

// Apply the Authentication middleware to all routes in this router
CartRouter.use(Authentication);
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - User's cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   quantity:
 *                     type: string
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

// Route: GET "/cart"
// Retrieve the user's cart
CartRouter.get("/", async (req, res) => {
  // Extract the userID from the request body (previously set in the Authentication middleware)
  const userID = req.body.userID;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Get the user's cart from the user object
    const cart = user.cart;

    // Send the cart data as a response with a 200 OK status
    res.status(200).send(cart);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK - Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - User not found / Product is not available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Conflict - Product already in cart
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
 *             $ref: "#/components/schemas/CartItem"
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: string
 */

// Route: POST "/cart/add"
// Add a product to the user's cart
CartRouter.post("/add", async (req, res) => {
  // Extract the productId, quantity (default is 1), and userID from the request body
  const { productId, quantity = 1, userID } = req.body;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Find the product with the provided productId that is currently available
    const product = await ProductModel.findOne({
      _id: productId,
      availability: true,
    });

    // If the product is not found or is not available, return a 404 Not Found status with an error message
    if (!product) {
      return res.status(404).send({ message: "Product is not available" });
    }

    // Check if the product is already present in the user's cart (by comparing productId)
    if (user.cart.some((index) => index.productId.toString() === productId)) {
      return res.status(409).send({ message: "Product already in cart" });
    }

    // If the product is not already in the cart, add it to the user's cart using $push operation
    await UserModel.findOneAndUpdate(
      { _id: userID },
      {
        $push: {
          cart: {
            productId,
            quantity,
          },
        },
      }
    );

    // Return a success message with a 200 OK status
    res.send({ message: "Product added to cart" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /cart/remove/{id}:
 *   delete:
 *     summary: Remove a product from the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to remove from the cart
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Product not found in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       501:
 *         description: Not Implemented - An error occurred while removing the product from the cart
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
 *             $ref: "#/components/schemas/CartItem"
 *
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: number
 *
 */

// CartRouter.delete("/remove/:id", ...)
// Route to remove a product from the user's cart
CartRouter.delete("/remove/:id", async (req, res) => {
  // Extract the productId from the URL parameter
  const productId = req.params.id;

  // Extract the userId from the request body
  const { userId } = req.body;

  // Find the user with the provided userId
  const user = await UserModel.findOne({ _id: userId });

  // Retrieve the user's cart
  const cart = user.cart;

  // Check if the product is in the user's cart
  if (cart.some((index) => index.productId.toString() === productId)) {
    try {
      // If the product is in the cart, remove it from the cart using $pull operation
      await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { cart: { productId } },
        }
      );

      // Return a success message with a 200 OK status
      res
        .status(200)
        .send({ message: `Product with ID ${productId} removed from cart` });
    } catch (error) {
      // If any error occurs during processing, return a 501 Not Implemented status with an error message
      return res.status(501).send({ message: error.message });
    }
  } else {
    // If the product is not in the cart, return a 404 Not Found status with an error message
    return res.status(404).send({ message: "Product not found in cart" });
  }
});
/**
 * @swagger
 * /cart/increase/{id}:
 *   patch:
 *     summary: Increase quantity of an item in the user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to increase quantity in the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK - Quantity updated for the product in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Product not found in cart or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       501:
 *         description: Not Implemented - An error occurred during processing
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
 *     CartIncreaseParams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 */

// CartRouter.patch("/increase/:id", ...)
// Route to increase the quantity of a product in the user's cart
CartRouter.patch("/increase/:id", async (req, res) => {
  // Extract the productId from the URL parameter
  const productId = req.params.id;

  // Extract the userID from the request body
  const { userID } = req.body;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Retrieve the user's cart
    const cart = user.cart;

    // Find the item in the cart with the provided productId
    const foundItem = cart.find(
      (item) => item.productId.toString() === productId
    );

    if (foundItem) {
      // If the item is found and the quantity is less than 10, increase the quantity by 1 and save the user
      if (foundItem.quantity < 10) {
        foundItem.quantity++;
        await user.save();
        return res.status(200).send({
          message: `Quantity updated for product with ID ${productId}`,
        });
      } else {
        // If the quantity is already 10, return a 404 Not Found status with an error message
        return res
          .status(404)
          .send({ message: "You Cannot add more than 10 items" });
      }
    } else {
      // If the item is not found in the cart, return a 404 Not Found status with an error message
      return res.status(404).send({ message: "Product not found in cart" });
    }
  } catch (error) {
    // If any error occurs during processing, return a 501 Not Implemented status with an error message
    return res.status(501).send({ message: error.message });
  }
});
/**
 * @swagger
 * /cart/decrease/{id}:
 *   patch:
 *     summary: Decrease quantity of a product in the user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID to decrease quantity
 *     responses:
 *       200:
 *         description: OK - Quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Product not found in cart or cannot decrease less than one item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       501:
 *         description: Not Implemented - Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 */

// CartRouter.patch("/decrease/:id", ...)
// Route to decrease the quantity of a product in the user's cart
CartRouter.patch("/decrease/:id", async (req, res) => {
  // Extract the productId from the URL parameter
  const productId = req.params.id;

  // Extract the userID from the request body
  const { userID } = req.body;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Retrieve the user's cart
    const cart = user.cart;

    // Find the item in the cart with the provided productId
    const foundItem = cart.find(
      (item) => item.productId.toString() === productId
    );

    if (foundItem) {
      // If the item is found and the quantity is greater than 1, decrease the quantity by 1 and save the user
      if (foundItem.quantity > 1) {
        foundItem.quantity--;
        await user.save();
        return res.status(200).send({
          message: `Quantity updated for product with ID ${productId}`,
        });
      } else {
        // If the quantity is already 1, return a 404 Not Found status with an error message
        return res
          .status(404)
          .send({ message: "You cannot decrease less than one item." });
      }
    } else {
      // If the item is not found in the cart, return a 404 Not Found status with an error message
      return res.status(404).send({ message: "Product not found in cart" });
    }
  } catch (error) {
    // If any error occurs during processing, return a 501 Not Implemented status with an error message
    return res.status(501).send({ message: error.message });
  }
});

// Export the CartRouter so that it can be used
module.exports = {
  CartRouter,
};
