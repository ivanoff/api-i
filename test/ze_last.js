const { expect, request } = require('chai');

describe('process.env', () => {
  let api;
  const movies = [
    { name: "The World's End", rates: 7 },
    { name: 'Baby driver' },
    { name: 'Shaun of the Dead' },
    { name: 'Hot Fuzz', rates: 8 },
  ];
  const credentials = { login: 'test1', password: 'test1' };

  describe('LOG_LEVEL error', () => {
    before(async () => {
      process.env.LOG_LEVEL = 'error';

      api = new global.Api(global.configNoToken);
      await api.model('movies', { name: 'string', rates: 'integer' });
      await api.start();
      r = () => request(api.app.callback());
    });

    after(async () => await api.destroy());

    it('post movies returns 201', async () => {
      const res = await r().post('/movies').send(movies[0]);
      expect(res).to.have.status(201);
    });
  })

  describe('no LOG_LEVEL', () => {
    before(async () => {
      delete process.env.LOG_LEVEL;

      api = new global.Api(global.configNoToken);
      await api.model('movies', { name: 'string', rates: 'integer' });
      await api.start();
      r = () => request(api.app.callback());
    });

    after(async () => await api.destroy());

    it('post movies returns 201', async () => {
      const res = await r().post('/movies').send(movies[0]);
      expect(res).to.have.status(201);
    });
  })

  describe('Tokens via process.env', () => {
    before(async () => {
      process.env.TOKEN_SECRET = 'secret';
      process.env.TOKEN_EXPIRE = 90;

      api = new global.Api(global.configNoToken);
      await api.user(credentials);
      await api.start();
      r = () => request(api.app.callback());

      delete process.env.TOKEN_SECRET;
      delete process.env.TOKEN_EXPIRE;
    });

    after(async () => await api.destroy());

    it('returns 200 status code', async () => {
      const res = await r().post('/login').send(credentials);
      expect(res).to.have.status(200);
    });

    it('has body', async () => {
      const res = await r().post('/login').send(credentials);
      expect(res).to.have.property('body');
    });

    it('returns login', async () => {
      const res = await r().post('/login').send(credentials);
    });

    it('login i equal to credentials', async () => {
      const res = await r().post('/login').send(credentials);
      expect(res.body.login).to.eql(credentials.login);
    });

    it('returns refresh token', async () => {
      const res = await r().post('/login').send(credentials);
      expect(res.body).to.have.property('refresh');
      refresh = res.body.refresh;
    });
  })

  describe('DB via process.env', () => {
    before(async () => {
      process.env.DB_CLIENT = 'sqlite3';
      process.env.DB_CONNECTION = ':memory:';

      api = new global.Api(global.configNoDb);
      await api.model('movies', { name: 'string', rates: 'integer' });
      await api.start();
      r = () => request(api.app.callback());

      delete process.env.DB_CLIENT;
      delete process.env.DB_CONNECTION;
    });

    after(async () => await api.destroy());

    it('post movies returns 201', async () => {
      const res = await r().post('/movies').send(movies[0]);
      expect(res).to.have.status(201);
    });

    it('get movies returns 200', async () => {
      const res = await r().get('/movies');
      expect(res).to.have.status(200);
    });
  })

  describe('DB via process.env wit no connection', () => {

    it('post movies returns 201', async () => {
      process.env.DB_CLIENT = 'mysql';
      try {
        api = new global.Api(global.configNoDb);
      } catch (err) {
        expect(err.toString()).to.match(/Cannot find module 'mysql'/);
      } finally {
        delete process.env.DB_CLIENT;
      }
    });

  })


});
