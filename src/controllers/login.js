const uuid = require('uuid');
const jwt = require('jsonwebtoken');

class LoginController {
  constructor({ config, models }) {
    this.models = models;
    if (!config.token.secret) throw 'NO_TOKEN_SECRET';
    this.secret = config.token.secret;
    this.expire = config.token.expire;
  }

  async login(ctx) {
    const { login, password, refresh } = ctx.request.body;
    const user = await this.models.login.search({ login, password, refresh });
    ctx.body = await this.updateUserData(user);
  }

  async update(ctx) {
    const { refresh } = ctx.request.body;
    const user = await this.models.login.search({ refresh });
    ctx.body = await this.updateUserData(user);
  }

  async register(ctx) {
    const { login, password } = ctx.request.body;
    await this.models.login.search({ login });
    ctx.body = await this.models.insert({ login, password });
  }

  async info(ctx) {
    ctx.body = await this.decoded(ctx.request);
  }

  decoded({ headers, query }) {
    const token = headers['x-access-token'] || query.token;
    if (!token) throw 'NO_TOKEN';
    return jwt.decode(token, this.secret);
  }

  async updateUserData(user) {
    if (!user) throw 'USER_NOT_FOUND';

    const refresh = uuid.v4();

    const {
      id, login, group, name,
    } = user;
    const data = {
      id, login, group, name, refresh,
    };

    const token = jwt.sign(data, this.secret, { expiresIn: this.expire || 60 });

    await this.models.login.update(user, { refresh });

    return { ...data, token };
  }
}

module.exports = LoginController;
