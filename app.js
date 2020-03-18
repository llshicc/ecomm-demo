const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieSession = require('cookie-session');
const userReporsitory = require('./repositories/user');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    keys: ['cc']
  })
);

app.get('/', (req, res) => {
  return res.send(`${req.session.uid}`);
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/signup.html'));
});

app.post('/signup', async (req, res) => {
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

app.get('/login', (req, res) => {
  return res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.post('/login', async (req, res) => {
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

app.listen(3000, () => {
  console.log('started in port 3000!');
});
