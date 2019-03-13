const { expect, request } = require('chai');

describe('DB', () => {
  let api;
  const movies = [
    { name: "The World's End", rates: 7 },
    { name: 'Baby driver' },
    { name: 'Shaun of the Dead' },
    { name: 'Hot Fuzz', rates: 8 },
  ];

  describe('Work with created tables', () => {
    before(async () => {
      api = new global.Api(global.configNoToken);
      await api.models.db.raw('CREATE TABLE movies (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), rates INTEGER)');
      await api.model('movies');
      await api.start();
      r = () => request(api.app.callback());
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

    it('get movies by id returns 200', async () => {
      const res = await r().get('/movies/1');
      expect(res).to.have.status(200);
    });

    it('movies name is matched', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.name).to.eql(movies[0].name);
    });
  })

  describe('Work with created tables', () => {
    before(async () => {
      api = new global.Api(global.configNoToken);
      await api.model('movies', { name: 'string', rates: 'integer' });
      await api.start();
      await api.stop();

      await api.model('movies');
      await api.start();
      r = () => request(api.app.callback());
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

    it('get movies by id returns 200', async () => {
      const res = await r().get('/movies/1');
      expect(res).to.have.status(200);
    });

    it('movies name is matched', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.name).to.eql(movies[0].name);
    });
  })

  describe('DB via process.env', () => {
    const { DB_CLIENT, DB_CONNECTION } = process.env;

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

  describe('Catch errors', () => {
    before(async () => {
      api = new global.Api(global.configNoToken);
    });

    after(async () => await api.destroy());

    it('wrong replace error has stack', async () => {
      await api.models.db.raw('CREATE TABLE movies (name VARCHAR(255))');
      try {
        await api.model('movies', { name: 'string' });
      } catch(err) {
        expect(err).to.eql('TABLE_EXISTS');
      }
    });

    it('wrong replace error has stack', async () => {
      try {
        await api.models.replace('aa', 1, {bb:2});
      } catch(err) {
        expect(err).to.have.property('stack');
      }
    });

    it('wrong replace error has code', async () => {
      try {
        await api.models.replace('aa', 1, {bb:2});
      } catch(err) {
        expect(err).to.have.property('code').to.eql('SQLITE_ERROR');
      }
    });
  });

});
