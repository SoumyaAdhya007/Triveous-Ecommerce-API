/* This code is setting up a connection to a MongoDB database using the Mongoose library in a Node.js
application. */
const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(process.env.mongoURL);

module.exports = connection;
