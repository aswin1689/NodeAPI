const User = require("../models/user");
const Product = require("../models/product");
module.exports = {
  index: async (req, res, next) => {
    const user = await User.find({});
    res.status(200).json(user);
  },

  newUser: async (req, res, next) => {
    const newUser = new User(req.value.body);
    const user = await newUser.save();
    res.status(201).json(user);
  },

  getUser: async (req, res, next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId);
    res.status(200).json(user);
  },

  replaceUser: async (req, res, next) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    const user = await User.findByIdAndUpdate(userId, newUser);
    res.status(200).json({ success: true });
  },

  updateUser: async (req, res, next) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    const user = await User.findByIdAndUpdate(userId, newUser);
    res.status(200).json({ success: true });
  },

  deleteUser: async (req, res, next) => {
    const { userId } = req.value.params;
    await User.findByIdAndRemove(userId);
    res.status(200).json({
      message: "user deleted successfully"
    });
  },

  getUserProducts: async (req, res, next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).populate("products");
    res.status(200).json(user.products);
  },

  newUserProduct: async (req, res, next) => {
    const { userId } = req.value.params;
    const newProduct = new Product(req.value.body);
    const user = await User.findById(userId);
    newProduct.seller = user;
    await newProduct.save();
    user.products.push(newProduct);
    await user.save();
    res.status(201).json(newProduct);
  }
};
