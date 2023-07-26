// Import the Mongoose library
const mongoose = require("mongoose");

// Define the Mongoose schema for the "category" entity
const categorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create a Mongoose model named "category" based on the categorySchema
const CategorytModel = mongoose.model("category", categorySchema);

// Create an index on the "category" field to ensure uniqueness and faster queries
categorySchema.index({ category: 1 });

// Export the CategorytModel so that it can be used in other parts of the application
module.exports = CategorytModel;
