/* This code is defining a Mongoose schema for a user and exporting it as a model. */
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
        unique: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      orderDate: {
        type: Date,
        required: true,
      },
    },
  ],
});
const UserModel = mongoose.model("user", userSchema);
userSchema.index({ email: 1, phone: 1 });
module.exports = UserModel;
