const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
});
const CategorytModel = mongoose.model("category", categorySchema);
categorySchema.index({ category: 1 });
module.exports = CategorytModel;
