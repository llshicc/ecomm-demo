const express = require('express');
const usersRepo = require('../../repositories/user');
const loginTemplate = require('../../views/admin/auth/login');
const signupTemplate = require('../../views/admin/auth/signup');
const { validationResult } = require('express-validator');

const {
  emailValidation,
  passwordValidation,
  passwordConfirmationValidation,
  loginEmailValidation,
  loginPasswordValidation
} = require('./validations');
const router = express.Router();

router.get('/signup', async (req, res) => {
  const user = (await usersRepo.getOne(req.session.uid)) || {};
  res.send(signupTemplate({ email: user.email }));
});

router.post(
  '/signup',
  [emailValidation, passwordValidation, passwordConfirmationValidation],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      await usersRepo.create({
        email,
        password
      });
      res.send('Sign up successfully');
    } else {
      res.send(signupTemplate({ errors }));
    }
  }
);

router.get('/login', (req, res) => {
  return res.send(loginTemplate({ errors: null }));
});

router.post(
  '/login',
  [loginEmailValidation, loginPasswordValidation],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const user = usersRepo.getOneBy({ email: req.body.email });
      req.session.uid = user.id;
      res.send('Login successful');
    } else {
      res.send(loginTemplate({ errors }));
    }
  }
);

module.exports = router;
