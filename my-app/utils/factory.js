const asyncCatch = require("./asyncCatch");
const GlobalError = require("../errors/GlobalError");

const deleteOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;

    let deleted;

    if (req.user.role === "admin") {
      deleted = await Model.findOneAndDelete({
        _id: id,
      });
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

const updateOne = (Model) =>
  asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    let updated = await Model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!updated) return next(new GlobalError("Invalid Id: UPDATE", 500));
    res.status(200).json({
      success: true,
      data: {
        [Model.constructor.modelName]: updated,
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
        [Model.constructor.modelName]: created,
      },
    });
  });

module.exports = { createNew, updateOne, deleteOne };
