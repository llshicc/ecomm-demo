const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/product');
const productNewTemplate = require('../../views/admin/products/new');
const productsTemplate = require('../../views/admin/products/index');
const {
  productNameValidation,
  productPriceValidation,
  imageValidation
} = require('./validations');
const { errorHandler, requireAuth, uploadHandler } = require('./middlewares');

const router = express.Router();
const upload = multer();

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  return res.send(productsTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  return res.send(productNewTemplate());
});

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  uploadHandler,
  [productNameValidation, productPriceValidation, imageValidation],
  errorHandler(productNewTemplate),
  async (req, res) => {
    await productsRepo.create({
      title: req.body.title,
      price: req.body.price,
      image: req.file.buffer.toString('base64')
    });
    res.send('submited');
  }
);

module.exports = router;
