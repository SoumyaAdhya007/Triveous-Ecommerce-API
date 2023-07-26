// Import the Mongoose library
const mongoose = require("mongoose");

// Define the Mongoose schema for the "order" entity
const orderSchema = mongoose.Schema({
  // Reference to the user who placed the order (by their ObjectId)
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the "User" model for population
    required: true,
  },
  // Reference to the product ordered (by its ObjectId)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to the "Product" model for population
    required: true,
  },
  // Quantity of the product ordered (default value is 1)
  quantity: {
    type: Number,
    default: 1,
  },
  // Shipping address details for the order
  address: {
    pincode: { type: String, required: true }, // Pincode of the delivery address
    state: { type: String, required: true }, // State of the delivery address
    city: { type: String, required: true }, // City of the delivery address
    road_name: { type: String, required: true }, // Road name or address line of the delivery address
  },
  // Status of the order (can only be one of the specified enum values)
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "return",
      "returned",
    ],
    default: "pending",
  },
  // Role of the user placing the order (customer, seller, admin)
  role: {
    type: String,
    enum: ["customer", "seller", "admin"],
    require: true,
  },
  // Date of when the order was placed
  orderDate: {
    type: Date,
    required: true,
  },
});

// Create a Mongoose model named "order" based on the orderSchema
const OrderModel = mongoose.model("order", orderSchema);

// Export the OrderModel so that it can be used in other parts of the application
module.exports = OrderModel;
