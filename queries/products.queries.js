const Product = require("../database/models/products.model");

exports.getProducts = () => {
  return Product.find({}).exec();
};

exports.createProduct = async (product) => {
  try {
    const newProduct = new Product(product);
    return newProduct.save();
  } catch (e) {
    throw e;
  }
};

exports.findProductPerId = (id) => {
  return Product.findById(id).exec();
};

exports.updateProduct = async (id, updatedData) => {
  try {
    return await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();
  } catch (e) {
    throw e;
  }
};

exports.deleteProduct = async (id) => {
  try {
    return await Product.findByIdAndDelete(id).exec();
  } catch (e) {
    throw e;
  }
};
