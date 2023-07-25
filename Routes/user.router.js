const express = require("express");
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = +process.env.saltRounds;
const LOGIN_TOKEN_SECRET = process.env.LOGIN_TOKEN_SECRET;
const UserModel = require("../Models/user.model");
UserRouter.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !phone || !password) {
    return res.status(409).send({ message: "Please provide all fields" });
  }
  try {
    const userWithEmailExists = await UserModel.findOne({ email });
    const userWithphoneExists = await UserModel.findOne({ phone });
    if (userWithEmailExists || userWithphoneExists) {
      return res.status(409).send({
        message: `${
          userWithEmailExists && userWithphoneExists
            ? "Email & Phone Number"
            : userWithEmailExists
            ? `Email`
            : `Phone number`
        } already registered`,
      });
    }
    bcrypt.hash(password, saltRounds, async (err, hashedPass) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      try {
        const user = new UserModel({
          name,
          email,
          password: hashedPass,
          phone,
        });
        await user.save();
        res.status(201).send({ message: "User Registered Sucessfully" });
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res
      .status(409)
      .send({ message: "Provide phone number and password to login" });
  }
  try {
    const user = await UserModel.findOne({ phone });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, async function (err, result) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (result) {
        var token = jwt.sign(
          { id: user._id, role: "user" },
          LOGIN_TOKEN_SECRET
        );
        res.cookie("token", token);
        res.status(200).send({
          message: "Login Sucessful",
          userInfo: user,
        });
      } else {
        res.status(401).send({ message: "Wrong Credentials" });
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
module.exports = { UserRouter };
