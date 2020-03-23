const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/product');
const productNewTamplate = require('../../views/admin/products/new');
const { validationResult } = require('express-validator');
const {
  productNameValidation,
  productPriceValidation
} = require('./validations');

const router = express.Router();
const upload = multer();

router.get('/admin/products/new', (req, res) => {
  return res.send(productNewTamplate({ errors: null }));
});

router.post(
  '/admin/products/new',
  upload.single('image'),
  [productNameValidation, productPriceValidation],
  (req, res) => {
    console.log(req.body);
    res.send(validationResult(req).errors);
    console.log(req.file);
  }
);

module.exports = router;
