const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

module.exports = class UsersRepository {
  constructor(filename) {
    this.path = path.join(
      __dirname,
      '../data/',
      filename || 'default-repo.json'
    );
    try {
      fs.accessSync(this.path);
    } catch (err) {
      fs.writeFileSync(this.path, '[]');
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.path, {
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
    const item = { id, ...attrs };
    records.push(item);
    await this.writeAll(records);
    return item;
  }

  async update(id, attrs) {
    // A request to update id will be ignore
    delete attrs.id;
    const records = await this.getAll();
    const item = records.find(i => i.id === id);
    Object.assign(item, attrs);
    await this.writeAll(records);
    return item;
  }

  async delete(id) {
    const records = await this.getAll();
    await this.writeAll(records.filter(item => item.id !== id));
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.path, JSON.stringify(records, null, 2));
  }
};
