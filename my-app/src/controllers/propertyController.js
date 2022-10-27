const Property = require("../models/property");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const {
  getAll,
  getById,
  createNew,
  updateOne,
  deleteOne,
} = require("../utils/factory");

exports.getAllProperties = getAll(Property);
exports.getPropertyById = getById(Property);
exports.createProperty = createNew(Property);
exports.updateProperty = updateOne(Property);
exports.deleteProperty = deleteOne(Property);


