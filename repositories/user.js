const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    this.filename = filename || 'users.json';
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf-8'
      })
    );
  }
  async getOne(id) {
    return await this.getOneBy({ id });
  }

  async getOneBy(attrs) {
    const records = await this.getAll();
    for (let item of records) {
      let find = true;
      for (let attr in attrs) {
        if (item[attr] !== attrs[attr]) find = false;
      }
      if (find) {
        return item;
      }
    }
  }

  async create(attrs) {
    const records = await this.getAll();
    const id = crypto.randomBytes(8).toString('hex');
    const salt = crypto.randomBytes(4).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);
    records.push({ id, ...attrs, password: `${buf.toString('hex')}.${salt}` });
    await this.writeAll(records);
  }

  async update(id, attrs) {
    if (attrs.hasOwnProperty('id')) {
      throw new Error('Id can not be modified');
    }
    const records = await this.getAll();
    const item = records.find(i => i.id === id);
    Object.assign(item, attrs);
    await this.writeAll(records);
  }

  async delete(id) {
    const records = await this.getAll();
    await this.writeAll(records.filter(item => item.id !== id));
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  async verifyPassword(password, submitedPassword) {
    const [hashed, salt] = password.split('.');
    const buf = await scrypt(submitedPassword, salt, 64);
    return hashed === buf.toString('hex');
  }
}

module.exports = new UsersRepository();
