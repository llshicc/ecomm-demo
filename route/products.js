const express = require('express');
const productsRepo = require('../repositories/product');
const productsTemplate = require('../views/products/index');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsTemplate({ products }));
});

module.exports = router;
