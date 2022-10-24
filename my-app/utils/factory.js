const asyncCatch = require("./asyncCatch");
const GlobalError = require("../errors/GlobalError");
const pluralize = require("pluralize");

const getAll = (Model) =>
  asyncCatch(async (req, res, next) => {
    const allDocuments = await Model.find();

    res.status(200).json({
      success: true,
      quantity: allDocuments.length,
      [pluralize(Model.modelName)]: allDocuments,
    });
  });

const getById = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const oneDocument = await Model.findById(id);
    if (!oneDocument)
      return next(new GlobalError(`Invalid id: Invalid Id: FINDONE `, 404));
    res.status(200).json({
      success: true,
      data: {
        [Model.modelName]: oneDocument,
      },
    });
  });

const createNew = (Model) =>
  asyncCatch(async (req, res, next) => {
    const created = await Model.create(req.body);
    if (!created)
      return next(
        new GlobalError(`Cannot create new ${Model.constructor.modelName}`, 500)
      );

    res.status(200).json({
      success: true,
      data: {
        [Model.modelName]: created,
      },
    });
  });

const updateOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    let updated;

    if (req.user.role === "admin") {
      updated = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    } else {
      Model.findOneAndUpdate({ _id: id, creator: req.user._id }, req.body, {
        new: true,
      });
    }

    if (!updated) return next(new GlobalError("Invalid Id: UPDATE", 500));
    res.status(200).json({
      success: true,
      data: {
        [Model.modelName]: updated,
      },
    });
  });

const deleteOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    let deleted;

    if (req.user.role === "admin") {
      deleted = await Model.findByIdAndDelete(id);
    } else {
      deleted = await Model.findOneAndDelete({
        _id: id,
        creator: req.user._id,
      });
    }

    if (!deleted) return next(new GlobalError("Invalid Id: DELETE", 500));
    res.status(200).json({
      success: true,
      message: "deleted",
    });
  });

module.exports = { getAll, getById, createNew, updateOne, deleteOne };
