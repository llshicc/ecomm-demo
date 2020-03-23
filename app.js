const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userRouter = require('./route/admin/auth');
const productsRouter = require('./route/admin/products');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    keys: ['llshicc']
  })
);
app.use(userRouter);
app.use(productsRouter);
app.get('/', (req, res) => {
  return res.send(`${req.session.uid}`);
});

app.listen(port, () => {
  console.log('started in port 3000!');
});
