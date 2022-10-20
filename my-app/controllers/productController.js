const Product = require("../models/product");
const GlobalFilter = require("../utils/GlobalFilter");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const { deleteOne } = require("../utils/factory");

exports.getAllProducts = asyncCatch(async (req, res) => {
  let allProducts = new GlobalFilter(Product.find(), req.query);

  //! Filter, Sorting, Fields, Pagination
  allProducts.search().filter().fields().sort().paginate();
  const products = await allProducts.query;
  res.status(200).json({
    success: true,
    quantity: products.length,
    data: { products },
  });
});

exports.getProductById = asyncCatch(async (req, res, next) => {
  const id = req.params.id;
  const oneProduct = await Product.findById(id);
  if (!oneProduct) return next(new GlobalError("Invalid id: FINDONE", 404));
  res.status(200).json({
    success: true,
    data: {
      product: oneProduct,
    },
  });
});

exports.createProduct = asyncCatch(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  if (!newProduct) return next(new GlobalError("Cannot create new product", 500));
  res.status(201).json({
    success: true,
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = asyncCatch(async (req, res, next) => {
  const id = req.params.id;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedProduct) return next(new GlobalError("Invalid id: UPDATE", 500));

  res.status(200).json({
    success: true,
    data: {
      product:updatedProduct,
    },
  });
});

exports.deleteProduct = deleteOne(Product);
