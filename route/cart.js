const express = require('express');
const cartsRepo = require('../repositories/cart');
const productsRepo = require('../repositories/product');
const { checkCartId } = require('./middlewares');
const cartTemplate = require('../views/cart/index');

const router = express.Router();

router.get('/cart', checkCartId, async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);
  /* cart {
    id,
    products: [
      item {id, quantity} => {id, quantity, product: {title, price} }
    ]
  }*/
  const items = await Promise.all(
    cart.products.map(async item => {
      item.product = await productsRepo.getOne(item.id);
      return item;
    })
  );
  res.send(cartTemplate({ items }));
});

router.post('/cart/products', checkCartId, async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);
  const product = cart.products.find(item => item.id === req.body.productId);
  if (product) {
    product.quantity += 1;
  } else {
    cart.products.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, cart);
  res.redirect('/cart');
});

router.post('/cart/products/:id/delete', checkCartId, async (req, res) => {
  const cart = await cartsRepo.getOne(req.session.cartId);
  cart.products = cart.products.filter(item => item.id !== req.params.id);
  await cartsRepo.update(cart.id, cart);
  res.redirect('/cart');
});

module.exports = router;
