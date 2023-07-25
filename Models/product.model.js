const mongoose = require("mongoose");
const productSchma = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});
const ProductModel = mongoose.model("product", productSchma);
productSchma.index({ categoryId: 1 });
module.exports = ProductModel;
