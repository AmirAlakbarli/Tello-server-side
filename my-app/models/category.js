const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name must be defined!"],
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

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

const Category = mongoose.model("category");
module.exports = Category;
