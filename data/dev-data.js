const mongoose = require("mongoose");
require("dotenv").config({ path: "../config.env" });
const fs = require("fs");
const Product = require("../src/models/product");

//! MongoDB Connection
const DB = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
  if (err) return console.log("Error occured");
  const products = JSON.parse(
    fs.readFileSync(`${__dirname}/../products-data.json`)
  );

  async function importData() {
    try {
      await Product.create(products);
      console.log("Data was imported");
    } catch (error) {
      console.log(error);
    }

    process.exit();
  }

  async function deleteData() {
    try {
      await Product.deleteMany();
      console.log("Data was deleted");
    } catch (error) {
      console.log(error);
    }

    process.exit();
  }

  switch (process.argv[2]) {
    case "import":
      importData();
      break;

    case "delete":
      deleteData();
      break;

    default:
      break;
  }
});
