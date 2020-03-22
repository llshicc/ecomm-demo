const express = require('express');
const path = require('path');
const userReporsitory = require('../../repositories/user');
const loginTemplate = require('../../views/admin/auth/login');
const signupTemplate = require('../../views/admin/auth/signup');
const router = express.Router();

router.get('/signup', async (req, res) => {
  const user = (await userReporsitory.getOne(req.session.uid)) || {};
  res.send(signupTemplate({ email: user.email }));
});

router.post('/signup', async (req, res) => {
  if (req.body.password !== req.body['confirm-password']) {
    res.send('Password is not same in confirmtion');
  }
  const { email, password } = req.body;
  await userReporsitory.create({
    email,
    password
  });
  res.send('Sign up successfully');
});

router.get('/login', (req, res) => {
  return res.send(loginTemplate());
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // find email
  const user = await userReporsitory.getOneBy({ email });
  if (!user) {
    return res.send('This email is not registered');
  }
  // check password
  if (!(await userReporsitory.verifyPassword(user.password, password))) {
    return res.send('Password is not correct');
  }
  // set session
  req.session.uid = user.id;
  res.send('Login successful');
});

module.exports = router;
