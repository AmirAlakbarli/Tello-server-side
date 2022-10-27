const mongoose = require("mongoose");

const FAQSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },

    title: {
      type: String,
      required: [true, "Please provide a title!"],
    },
    
    description: {
      type: String,
      required: [true, "Please provide a description!"],
    },
  },

  { timestamps: true }
);

FAQSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } });
  next();
});

const FAQ = mongoose.model("FAQ", FAQSchema);

module.exports = FAQ;
