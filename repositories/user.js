const Repository = require('./repository');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async create(attrs) {
    const records = await this.getAll();
    const id = crypto.randomBytes(8).toString('hex');
    const salt = crypto.randomBytes(4).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);
    records.push({ id, ...attrs, password: `${buf.toString('hex')}.${salt}` });
    await this.writeAll(records);
  }

  async verifyPassword(password, submitedPassword) {
    const [hashed, salt] = password.split('.');
    const buf = await scrypt(submitedPassword, salt, 64);
    return hashed === buf.toString('hex');
  }
}

module.exports = new UsersRepository('users.json');
