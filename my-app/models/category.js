const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema(
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
      required: [true, "Category name must be defined!"],
      unique: true,
    },

    slug: String,

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
  },

  { timestamps: true }
);

categorySchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } });
  next();
});

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
