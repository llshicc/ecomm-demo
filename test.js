const userReporsitory = require('./repositories/user');

(async () =>
  console.log(await userReporsitory.getOneBy({ email: 'cc@cc.com' })))();
