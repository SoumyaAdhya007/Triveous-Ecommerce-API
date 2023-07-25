const express = require("express");
const CategorytModel = require("../Models/category.model");
const CategoryRouter = express.Router();
CategoryRouter.post("/add", async (req, res) => {
  const category = req.body.category;
  try {
    if (!category) {
      return res
        .status(409)
        .send({ message: "Please provide the category name" });
    }
    if (typeof category !== "string") {
      return res.status(404).send({ message: "category must be a string" });
    }
    const newCategory = new CategorytModel({
      category: category.toLocaleLowerCase(),
    });
    await newCategory.save();
    res.status(201).send({ message: "Category added successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
CategoryRouter.get("/", async (req, res) => {
  try {
    const categories = await CategorytModel.find({});
    res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
CategoryRouter.patch("/change/:id", async (req, res) => {
  const id = req.params.id;
  const category = req.body.category;

  try {
    const findCategory = await CategorytModel.findOne({ _id: id });
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    if (typeof category !== "string") {
      return res.status(404).send({ message: "category must be a string" });
    }
    await CategorytModel(
      { _id: id },
      { category: category.toLocaleLowerCase() }
    );
    res.status(200).send({ message: "Category updated successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
CategoryRouter.delete("/remove/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const findCategory = await CategorytModel.findOne({ _id: id });
    if (!findCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    await CategorytModel.findOneAndDelete({ _id: id });
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
module.exports = { CategoryRouter };
