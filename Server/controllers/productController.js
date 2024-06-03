const Product = require('../models/product');

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, qty, rate } = req.body;
  try {
    const product = await Product.create({ name, qty, rate, user: req.user._id });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all products for a user
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product by id
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, qty, rate } = req.body;
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name, qty, rate },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a product by id
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ _id: id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
