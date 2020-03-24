const userReporsitory = require('./repositories/user');

(async () =>
  console.log(await userReporsitory.getOneBy({ email: 'test122@test.com' })))();
