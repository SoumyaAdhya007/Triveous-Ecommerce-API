// Import required modules
const express = require("express");

// Import the Authentication middleware to protect routes
const { Authentication } = require("../Middleware/authentication.middleware");

// Import the OrderModel and UserModel
const OrderModel = require("../Models/order.model");
const UserModel = require("../Models/user.model");

// Create an Express router instance
const OrdersRouter = express.Router();

// Apply the Authentication middleware to protect routes
OrdersRouter.use(Authentication);
/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - User orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Order"
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
 *
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userID:
 *           type: string
 *         orderDate:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 */

// OrdersRouter.get("/", ...)
// Route to retrieve all orders for a specific user
OrdersRouter.get("/", async (req, res) => {
  // Extract the userID from the request body
  const { userID } = req.body;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 404 Not Found status with an error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Retrieve all orders for the user, sorted by orderDate in descending order
    const orders = await OrderModel.find({ userID }).sort({ orderDate: -1 });

    // Return the orders as a response with a 200 OK status
    return res.send(orders);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /order/details/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the order to retrieve details for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK - Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       404:
 *         description: Not Found - No such order found
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
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderDate:
 *           type: string
 *           format: date
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *         totalAmount:
 *           type: number
 */

// OrdersRouter.get("/details/:id", ...)
// Route to retrieve details of a specific order by its ID
OrdersRouter.get("/details/:id", async (req, res) => {
  // Extract the order ID from the URL parameter
  const id = req.params.id;

  try {
    // Find the order with the provided ID
    const order = await OrderModel.findOne({ _id: id });

    // If the order is not found, return a 404 Not Found status with an error message
    if (!order) {
      return res.status(404).send({ message: "No such order found" });
    }

    // Return the order details as a response with a 200 OK status
    res.status(200).send(order);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});
/**
 * @swagger
 * /order/place/{productId}:
 *   post:
 *     summary: Place an order for a product
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to be ordered
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK - Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request - Please select an address before placing the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - User not found / Product not found in user cart / Invalid or missing token
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

// OrdersRouter.post("/place/:productId", ...)
// Route to place an order for a specific product
OrdersRouter.post("/place/:productId", async (req, res) => {
  // Extract the productId from the URL parameter
  const productId = req.params.productId;

  // Extract the userID from the request body
  const { userID } = req.body;

  try {
    // Find the user with the provided userID
    const user = await UserModel.findOne({ _id: userID });

    // If the user is not found, return a 401 Unauthorized status with an error message
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    // Find the product in the user's cart with the provided productId
    const productInCart = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    // If the product is not found in the user's cart, return a 401 Unauthorized status with an error message
    if (!productInCart) {
      return res
        .status(401)
        .send({ message: "Product not found in user cart" });
    }

    // Find the selected address from the user's address list
    const address = user.address.find((addr) => addr.isSelected === true);

    // If no address is selected, return a 400 Bad Request status with an error message
    if (!address) {
      return res.status(400).send({
        message: "Please select an address before placing the order",
      });
    }

    // Create a new OrderModel instance with the order details
    const date = new Date();
    const order = new OrderModel({
      userID: user._id,
      role: "customer",
      productId: productInCart.productId,
      quantity: productInCart.quantity,
      address: address,
      orderDate: date,
    });

    // Save the order to the database
    await order.save();

    // Remove the product from the user's cart
    await UserModel.findOneAndUpdate(
      { _id: userID },
      {
        $pull: { cart: { productId } },
      }
    );

    // Return a success message with a 200 OK status
    res.send({ message: "Order Placed Successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

/**
 * @swagger
 * /order/return/{orderId}:
 *   patch:
 *     summary: Mark an order as returned
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be marked as returned
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - Order marked as returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request - Order cannot be returned (status is not "delivered")
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Order not found
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

// OrdersRouter.patch("/return/:orderId", ...)
// Route to mark an order as returned
OrdersRouter.patch("/return/:orderId", async (req, res) => {
  // Extract the orderId from the URL parameter
  const orderId = req.params.orderId;

  try {
    // Find the order with the provided orderId
    const order = await OrderModel.findOne({ _id: orderId });

    // If the order is not found, return a 404 Not Found status with an error message
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Check if the order status is "delivered"
    if (order.status !== "delivered") {
      return res.status(400).send({ message: "Order cannot be returned" });
    }

    try {
      // Set the order status to "return" and save the updated order
      order.status = "return";
      await order.save();

      // Return a success message with a 200 OK status
      res.send({ message: "Order Marked as Returned Successfully" });
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  } catch (error) {
    // If any error occurs during processing, return a 501 Not Implemented status with an error message
    return res.status(501).send({ message: error.message });
  }
});

/**
 * @swagger
 * /order/cancel/{orderId}:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to cancel
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: OK - Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request - Order cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Order not found
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

// OrdersRouter.delete("/cancel/:orderId", ...)
// Route to cancel an order
OrdersRouter.delete("/cancel/:orderId", async (req, res) => {
  // Extract the orderId from the URL parameter
  const orderId = req.params.orderId;

  try {
    // Find the order with the provided orderId
    const order = await OrderModel.findOne({ _id: orderId });

    // If the order is not found, return a 404 Not Found status with an error message
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Check if the order status is "delivered" or "returned"
    if (
      order.status === "delivered" ||
      order.status === "delivered" ||
      order.status === "returned"
    ) {
      return res.status(400).send({
        message: `${order.status} Order cannot be cancelled`,
      });
    }

    try {
      // Set the order status to "cancelled" and save the updated order
      order.status = "cancelled";
      await order.save();

      // Return a success message with a 200 OK status
      res.send({ message: "Order Cancelled Successfully" });
    } catch (error) {
      // If any error occurs during processing, return a 500 Internal Server Error status with an error message
      res.status(500).send({ message: error.message });
    }
  } catch (error) {
    // If any error occurs during processing, return a 501 Not Implemented status with an error message
    return res.status(501).send({ message: error.message });
  }
});

// Export the OrdersRouter so that it can be used in other parts of the application
module.exports = {
  OrdersRouter,
};
