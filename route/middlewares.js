const cartsRepo = require('../repositories/cart');

Object.assign(module.exports, {
  async checkCartId(req, res, next) {
    if (!req.session.cartId) {
      const cart = await cartsRepo.create({ products: [] });
      req.session.cartId = cart.id;
    }
    next();
  }
});
