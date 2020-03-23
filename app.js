const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userRouter = require('./route/admin/auth');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    keys: ['llshicc']
  })
);
app.use(userRouter);

app.get('/', (req, res) => {
  return res.send(`${req.session.uid}`);
});

app.listen(3000, () => {
  console.log('started in port 3000!');
});
