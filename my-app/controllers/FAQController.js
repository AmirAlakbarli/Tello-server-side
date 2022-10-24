const FAQ = require("../models/FAQ");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const {
  getAll,
  getById,
  createNew,
  updateOne,
  deleteOne,
} = require("../utils/factory");

exports.getAllFAQ = getAll(FAQ);
exports.getFAQById = getById(FAQ);
exports.createFAQ = createNew(FAQ);
exports.updateFAQ = updateOne(FAQ);
exports.deleteFAQ = deleteOne(FAQ);
