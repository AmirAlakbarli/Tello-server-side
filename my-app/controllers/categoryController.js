const Category = require("../models/category");

const {
  getAll,
  getById,
  createNew,
  updateOne,
  deleteOne,
} = require("../utils/factory");

exports.getAllCategories = getAll(Category);
exports.getCategoryById = getById(Category);
exports.createCategory = createNew(Category);
exports.updateCategory = updateOne(Category);
exports.deleteCategory = deleteOne(Category);
