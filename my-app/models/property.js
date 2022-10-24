const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property name must be defined!"],
    },

    values: {
      type: Array,
      required: [true, "Property values must be defined!"],
    },
  },

  { timestamps: true }
);

propertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

const Property = mongoose.model("property", propertySchema);
module.exports = Property;
