const mongoose = require("mongoose");
require("dotenv").config();

// Connect to the MongoDB database using the 'mongoose.connect()' method.
// 'process.env.mongoURL' contains the MongoDB connection URL, which is specified in the '.env' file.
const connection = mongoose.connect(process.env.mongoURL);

// Export the connection so that other parts of the application can use it.
module.exports = connection;
