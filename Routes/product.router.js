const express = require("express");
const ProductModel = require("../Models/category.model");
const CategorytModel = require("../Models/category.model");
const ProductRouter = express.Router();
ProductRouter.post("/add", async (req, res) => {
  const { title, price, description, availability, categoryId, images } =
    req.body;
  try {
    if (
      !title ||
      !price ||
      !description ||
      !availability ||
      !categoryId ||
      !images
    ) {
      return res.send(404).send({ message: "Please Provied All details" });
    }
    const findCategory = await CategorytModel.findOne({ _id: categoryId });
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    const product = await ProductModel({
      title,
      price,
      description,
      availability,
      categoryId,
      images,
    });
    await product.save();
    res.status(201).send({ message: "Product added successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
ProductRouter.get("/category/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const findCategory = await CategorytModel.findOne({ _id: categoryId });
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    const products = await CategorytModel.find({ categoryId });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
ProductRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
ProductRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  try {
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    if (payload.categoryId) {
      const findCategory = await CategorytModel.findOne({
        _id: payload.categoryId,
      });
      if (!findCategory) {
        return res.status(404).send({ message: "Category not found" });
      }
    }
    await ProductModel.findByIdAndUpdate({ _id: id }, payload);
    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
ProductRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    await ProductModel.delete({ _id: id });
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
module.exports = { ProductRouter };
