const express = require('express');
const usersRepo = require('../../repositories/user');
const loginTemplate = require('../../views/admin/auth/login');
const signupTemplate = require('../../views/admin/auth/signup');
const { errorHandler } = require('./middlewares');

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
  errorHandler(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    await usersRepo.create({
      email,
      password
    });
    res.send('Sign up successfully');
  }
);

router.get('/login', (req, res) => {
  return res.send(loginTemplate());
});

router.post(
  '/login',
  [loginEmailValidation, loginPasswordValidation],
  errorHandler(loginTemplate),
  async (req, res) => {
    const user = await usersRepo.getOneBy({ email: req.body.email });
    req.session.uid = user.id;
    res.send('Login successful');
  }
);

router.get('/logout', (req, res) => {
  req.session.uid = null;
  res.redirect('/');
});

module.exports = router;
