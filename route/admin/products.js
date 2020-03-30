const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/product');
const productNewTemplate = require('../../views/admin/products/new');
const productEditTemplate = require('../../views/admin/products/edit');
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
      image: req.body.image.buffer.toString('base64')
    });
    res.send('submited');
  }
);

router.get('/admin/products/:id', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    return res.send(`${req.params.id} is not exist`);
  }
  return res.send(productEditTemplate({ product }));
});

router.put(
  '/admin/products/:id',
  requireAuth,
  upload.single('image'),
  uploadHandler,
  [productNameValidation, productPriceValidation, imageValidation],
  errorHandler(productEditTemplate),
  async (req, res) => {
    const newProduct = { title: req.body.title, price: req.body.price };
    if (req.body.image)
      newProduct.image = req.body.image.buffer.toString('base64');
    await productsRepo.update(req.params.id, newProduct);
    return res.redirect('/admin/products');
  }
);

router.delete('/admin/products/:id', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    return res.send(`${req.params.id} is not exist`);
  }
  await productsRepo.delete(req.params.id);
  return res.redirect('/admin/products');
});

module.exports = router;
