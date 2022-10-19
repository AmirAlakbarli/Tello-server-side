const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name must be defined!"],
    },

    description: {
      type: String,
    },

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category id must be defined!"],
      },
    ],

    ratingsQuantity: {
      type: Number,
    },

    ratingsAverage: {
      type: Number,
    },

    variants: [Object],
  },
  { timestamps: true }
);
