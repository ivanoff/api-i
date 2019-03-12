const makeMd5 = require('md5');

class LoginModel {
  constructor(db) {
    this.name = 'users';
    this.db = db;
  }

  async init() {
    const hasTable = await this.db.schema.hasTable(this.name);
    if (!hasTable) {
      await this.db.schema.createTable(this.name, (table) => {
        table.increments('id');
        table.timestamps();
        table.string('login');
        table.string('password');
        table.string('refresh');
        table.string('name');
      });
    }
  }

  async search({ login, password, refresh }) {
    const pass = password && makeMd5(password);
    const where = refresh ? { refresh } : { login };
    if (password) where.password = pass;
    return this.db(this.name).select('*').where(where).first();
  }

  async insert({ login, password, md5 }) {
    const pass = md5 || makeMd5(password);
    return this.db(this.name).insert({ login, password: pass }).returning('*');
  }

  async update(user, body) {
    return this.db(this.name).where({ id: user.id }).update(body);
  }
}

module.exports = LoginModel;
