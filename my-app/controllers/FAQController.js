const FAQ = require("../models/FAQ");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const { createNew, updateOne, deleteOne } = require("../utils/factory");

exports.getAllFAQ = asyncCatch(async (req, res, next) => {
  const allFAQ = FAQ.find();
  res.status(200).json({
    success: true,
    data: {
      allFAQ,
    },
  });
});

exports.getFAQById = asyncCatch(async (req, res, next) => {
  const oneFAQ = FAQ.findById(req.params.id);
  if (!oneFAQ) next(new GlobalError("Invalid id: FINDONE", 404));
  res.status(200).json({
    success: true,
    data: {
      FAQ: oneFAQ,
    },
  });
});

exports.createFAQ = createNew(FAQ);
exports.updateFAQ = updateOne(FAQ);
exports.deleteFAQ = deleteOne(FAQ);
