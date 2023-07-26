// Import required modules
const express = require("express");
const ProductModel = require("../Models/product.model");
const CategorytModel = require("../Models/category.model");

// Create an Express router instance
const ProductRouter = express.Router();

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: string
 *               description:
 *                 type: string
 *               availability:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     parameters:
 *       - in: query
 *         name: apiKey
 *         schema:
 *           type: string
 *         required: true
 *         description: API key for authentication (if required)
 *     responses:
 *       201:
 *         description: Created - Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Category not found
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

// ProductRouter.post("/add", ...)
// Route to add a new product
ProductRouter.post("/add", async (req, res) => {
  // Extract product details from the request body
  const { title, price, description, availability, categoryId, images } =
    req.body;

  try {
    // Check if all required product details are provided
    if (
      !title ||
      !price ||
      !description ||
      !availability ||
      !categoryId ||
      !images
    ) {
      return res.status(404).send({ message: "Please Provide All Details" });
    }

    // Find the category with the provided categoryId
    const findCategory = await CategorytModel.findOne({ _id: categoryId });

    // If the category is not found, return a 404 Not Found status with an error message
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Create a new ProductModel instance with the product details
    const product = new ProductModel({
      title,
      price,
      description,
      availability,
      categoryId,
      images,
    });

    // Save the product to the database
    await product.save();

    // Return a success message with a 201 Created status
    res.status(201).send({ message: "Product added successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    return res.status(500).send({ message: error.message });
  }
});

/**
 * @swagger
 * /product/category/{categoryId}:
 *   get:
 *     summary: Get products by category ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to retrieve products for
 *     responses:
 *       200:
 *         description: OK - Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: string
 *                   description:
 *                     type: string
 *                   categoryId:
 *                     type: string
 *                   quantity:
 *                     type: string
 *       404:
 *         description: Not Found - Category not found
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

// ProductRouter.get("/category/:categoryId", ...)
// Route to retrieve all products for a specific category
ProductRouter.get("/category/:categoryId", async (req, res) => {
  // Extract the categoryId from the URL parameter
  const categoryId = req.params.categoryId;

  try {
    // Find the category with the provided categoryId
    const findCategory = await CategorytModel.findOne({ _id: categoryId });

    // If the category is not found, return a 404 Not Found status with an error message
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Retrieve all products for the specified category
    const products = await ProductModel.find({ categoryId });

    // Return the products as a response with a 200 OK status
    res.status(200).send(products);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

// ProductRouter.get("/:id", ...)
// Route to retrieve details of a specific product by its ID
ProductRouter.get("/:id", async (req, res) => {
  // Extract the product ID from the URL parameter
  const id = req.params.id;

  try {
    // Find the product with the provided ID
    const product = await ProductModel.findOne({ _id: id });

    // If the product is not found, return a 404 Not Found status with an error message
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Return the product details as a response with a 200 OK status
    res.status(200).send(product);
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

/**
 * @swagger
 * /product/change/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK - Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Product or Category not found
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

// ProductRouter.patch("/change/:id", ...)
// Route to update a specific product by its ID
ProductRouter.patch("/change/:id", async (req, res) => {
  // Extract the product ID from the URL parameter
  const id = req.params.id;

  // Extract the payload (updated product details) from the request body
  const payload = req.body;

  try {
    // Find the product with the provided ID
    const product = await ProductModel.findOne({ _id: id });

    // If the product is not found, return a 404 Not Found status with an error message
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // If the payload contains categoryId, check if the category exists
    if (payload.categoryId) {
      const findCategory = await CategorytModel.findOne({
        _id: payload.categoryId,
      });

      // If the category is not found, return a 404 Not Found status with an error message
      if (!findCategory) {
        return res.status(404).send({ message: "Category not found" });
      }
    }

    // Update the product with the provided payload
    await ProductModel.findByIdAndUpdate({ _id: id }, payload);

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK - Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found - Product not found
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

// ProductRouter.delete("/:id", ...)
// Route to delete a specific product by its ID
ProductRouter.delete("/:id", async (req, res) => {
  // Extract the product ID from the URL parameter
  const id = req.params.id;

  try {
    // Find the product with the provided ID
    const product = await ProductModel.findOne({ _id: id });

    // If the product is not found, return a 404 Not Found status with an error message
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Delete the product from the database
    await ProductModel.delete({ _id: id });

    // Return a success message with a 200 OK status
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    // If any error occurs during processing, return a 500 Internal Server Error status with an error message
    res.status(500).send({ message: error.message });
  }
});

// Export the ProductRouter so that it can be used in other parts of the application
module.exports = { ProductRouter };
