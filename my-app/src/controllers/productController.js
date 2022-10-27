const Product = require("../models/product");
const GlobalFilter = require("../utils/GlobalFilter");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const {
  getAll,
  getById,
  createNew,
  updateOne,
  deleteOne,
} = require("../utils/factory");

exports.getAllProducts = getAll(Product);
exports.getProductById = getById(Product);
exports.createProduct = createNew(Product);
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);
