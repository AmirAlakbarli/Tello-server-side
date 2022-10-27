const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },
    
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

propertySchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } });
  next();
});

propertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

const Property = mongoose.model("property", propertySchema);
module.exports = Property;
