const { validationResult } = require('express-validator');

Object.assign(module.exports, {
  errorHandler(templateFunc) {
    return function handleError(req, res, next) {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.send(templateFunc({ errors }));
      }
      return next();
    };
  },

  requireAuth(req, res, next) {
    if (!req.session.uid) {
      return res.redirect('/login');
    }
    return next();
  },

  uploadHandler(req, res, next) {
    if (req.file) {
      req.body.image = req.file;
    }
    return next();
  }
});
