const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");


//create a product
const createProduct = asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

// get a product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
});


// get all product
const getAllProduct = asyncHandler(async (req, res) => {
    try {
      const getallProduct = await Product.find();
      res.json(getallProduct);
    } catch (error) {
      throw new Error(error);
    }
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    console.log(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findOneAndUpdate({ _id:id }, req.body, {
        new: true,
      });
      console.log(updateProduct);
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deleteProduct = await Product.findOneAndDelete({ _id:id });
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { deleteProduct, updateProduct, getAllProduct, createProduct, getaProduct };