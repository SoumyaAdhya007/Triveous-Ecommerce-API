// Import required modules
const express = require("express");

// Import the Category model
const CategoryModel = require("../Models/category.model");

// Create an Express router instance
const CategoryRouter = express.Router();

// CategoryRouter.post("/add", ...)
// Route to add a new category
CategoryRouter.post("/add", async (req, res) => {
  // Extract the category name from the request body
  const category = req.body.category;

  try {
    // Check if the category name is provided
    if (!category) {
      return res
        .status(409)
        .send({ message: "Please provide the category name" });
    }

    // Check if the category is a string
    if (typeof category !== "string") {
      return res.status(404).send({ message: "Category must be a string" });
    }

    // Create a new CategoryModel instance with the provided category name (converted to lowercase)
    const newCategory = new CategoryModel({
      category: category.toLowerCase(),
    });

    // Save the new category to the database
    await newCategory.save();

    // Return a success message with a 201 Created status
    res.status(201).send({ message: "Category added successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
});

// CategoryRouter.get("/", ...)
// Route to retrieve all categories
CategoryRouter.get("/", async (req, res) => {
  try {
    // Retrieve all categories from the CategoryModel
    const categories = await CategoryModel.find({});

    // Return the categories as a response with a 200 OK status
    res.status(200).send(categories);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
});

// CategoryRouter.patch("/change/:id", ...)
// Route to update a category
CategoryRouter.patch("/change/:id", async (req, res) => {
  // Extract the category ID from the URL parameter
  const id = req.params.id;

  // Extract the updated category name from the request body
  const category = req.body.category;

  try {
    // Find the category with the provided ID
    const findCategory = await CategoryModel.findOne({ _id: id });

    // If the category is not found, return a 404 Not Found status with an error message
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Check if the updated category is a string
    if (typeof category !== "string") {
      return res.status(404).send({ message: "Category must be a string" });
    }

    // Update the category name with the provided value (converted to lowercase)
    await CategoryModel.updateOne(
      { _id: id },
      { category: category.toLowerCase() }
    );

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "Category updated successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
});

// CategoryRouter.delete("/remove/:id", ...)
// Route to delete a category
CategoryRouter.delete("/remove/:id", async (req, res) => {
  // Extract the category ID from the URL parameter
  const id = req.params.id;

  try {
    // Find the category with the provided ID
    const findCategory = await CategoryModel.findOne({ _id: id });

    // If the category is not found, return a 404 Not Found status with an error message
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Delete the category from the database
    await CategoryModel.findOneAndDelete({ _id: id });

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
});

// Export the CategoryRouter so that it can be used in other parts of the application
module.exports = { CategoryRouter };
