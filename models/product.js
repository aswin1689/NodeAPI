const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  category: String,
  year: Number,
  seller: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
