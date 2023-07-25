const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const connection = require("./Config/db");
const { UserRouter } = require("./Routes/user.router");
const { CategoryRouter } = require("./Routes/category.router");
const { ProductRouter } = require("./Routes/product.router");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To E-Commerce API");
});
app.use("/user", UserRouter);
app.use("/category", CategoryRouter);
app.use("/product", ProductRouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Connected to MongoDB `);
    console.log(`Server listening on port ${process.env.PORT}`);
  } catch (error) {
    console.log(`Error listening on port ${process.env.PORT} => ${error}`);
  }
});
