const Property = require("../models/property");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const { deleteOne } = require("../utils/factory");

exports.getAllProperties = asyncCatch(async (req, res, next) => {
  const allProperties = await Property.find();
  res.status(200).json({
    success: true,
    quantity: allProperties.length,
    data: { allProperties },
  });
});

exports.getPropertyById = asyncCatch(async (req, res, next) => {
  const id = req.id;
  const property = await Property.findById(id);
  if (!property) next(new GlobalError("Invalid id: FINDONE", 404));
  res.status(200).json({
    success: true,
    data: { property },
  });
});

exports.createProperty = asyncCatch(async (req, res, next) => {
  const newProperty = await Property.create(req.body);
  if (!newProperty) next(new GlobalError("Cannot create a new property!", 500));
  res.status(201).json({
    success: true,
    data: {
      property: newProperty,
    },
  });
});

exports.updateProperty = asyncCatch(async (req, res, next) => {
  const id = req.params.id;
  const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedProperty) return next(new GlobalError("Invalid id: UPDATE", 404));

  res.status(200).json({
    success: true,
    data: {
      property: updatedProperty,
    },
  });
});

exports.deleteProduct = deleteOne(Property);
