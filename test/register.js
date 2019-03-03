const { expect, request } = require('chai');

describe.skip('Register', () => {
  let api;
  let r;
  let token;
  let refresh;
  const movies = [
    { name: "Last Night In Soho" },
    { name: "Shadows" },
  ];

  const credentials = { login: 'test1', password: 'test1' };
  const credentials2 = { login: 'test2', password: 'test2' };

  before(async () => {
    api = new global.Api(global.config);
    await api.model('movies', { name: 'string' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  describe('Register', () => {
    it('Register first user', async () => {
      const res = await r().post('/register').send(credentials);
      expect(res).to.have.status(201);
    });
  });

  describe('Check login access', () => {

    describe('Post login', () => {
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

    });

    describe('Post login with refresh token only', () => {
      it('next returns not the same refresh token as previous one', async () => {
        const res = await r().post('/login').send(credentials);
        expect(res.body.refresh).is.not.eql(refresh);
        refresh = res.body.refresh;
      });

      it('returns 200', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res).to.have.status(200);
        refresh = res.body.refresh;
      });

      it('has body', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res).to.have.property('body');
        refresh = res.body.refresh;
      });

      it('returns login', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res.body).to.have.property('login');
        refresh = res.body.refresh;
      });

      it('returns token', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res.body).to.have.property('token');
        refresh = res.body.refresh;
      });

      it('returns refresh token', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res.body).to.have.property('refresh');
        refresh = res.body.refresh;
      });

      it('next returns not the same refresh token as previous one', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res.body.refresh).is.not.eql(refresh);
      });

      it('old refresh dont work, 404 not found', async () => {
        const res = await r().post('/login').send({refresh});
        expect(res).to.have.status(404);
      });
    });

    describe('Token usage', () => {
      it('has token', async () => {
        const res = await r().post('/login').send(credentials);
        expect(res.body).to.have.property('token');
        token = res.body.token;
        refresh = res.body.refresh;
      });

      it('post with X-Access-Token', async () => {
        const res = await r().post('/movies').set('X-Access-Token', token).send(movies[0]);
        expect(res).to.have.status(201);
      });

      it('post with token in body', async () => {
        const res = await r().post('/movies').send({...movies[0], token});
        expect(res).to.have.status(201);
      });

      it('get with X-Access-Token', async () => {
        const res = await r().get('/movies').set('X-Access-Token', token);
        expect(res).to.have.status(200);
      });

      it('get with token in query', async () => {
        const res = await r().get('/movies').query({token});
        expect(res).to.have.status(200);
      });

      it('token information with no token', async () => {
        const res = await r().get('/login');
        expect(res).to.have.status(401);
      });

      it('token information by X-Access-Token returns 200 status', async () => {
        const res = await r().get('/login').set('X-Access-Token', token);
        expect(res).to.have.status(200);
      });

      it('token information by X-Access-Token returns 200 status', async () => {
        const res = await r().get('/login').query({token});
        expect(res).to.have.status(200);
      });

      it('token information has login field', async () => {
        const res = await r().get('/login').set('X-Access-Token', token);
        expect(res.body).to.have.property('login');
      });

      it('token information is match with our credentials', async () => {
        const res = await r().get('/login').set('X-Access-Token', token);
        expect(res.body.login).to.eql(credentials.login);
      });

      it('update token by refresh', async () => {
        const res = await r().patch('/login').send({refresh});
        expect(res).to.have.status(200);
        expect(res.body.refresh).to.not.eql(refresh);
        expect(res.body.token).to.not.eql(token);
        token = res.body.token;
      });

      it('update token by old refresh has 404 status', async () => {
        const res = await r().patch('/login').send({refresh});
        expect(res).to.have.status(404);
      });

      it('new token information is match with our credentials', async () => {
        const res = await r().get('/login').set('X-Access-Token', token);
        expect(res.body.login).to.eql(credentials.login);
      });
    });

    describe('Wrong owner and group token usage', () => {
      it('has token', async () => {
        const res = await r().post('/login').send(credentials);
        expect(res.body).to.have.property('token');
        token = res.body.token;
      });

      it('post with wrong owner has 401 status', async () => {
        const res = await r().post('/my/WRONG/movies').set('X-Access-Token', token).send(movies[0]);
        expect(res).to.have.status(401);
      });

      it('post with wrong group has 401 status', async () => {
        const res = await r().post('/our/WRONG/movies').set('X-Access-Token', token).send(movies[0]);
        expect(res).to.have.status(401);
      });

      it('get with wrong owner 401 status', async () => {
        const res = await r().get('/my/WRONG/movies').set('X-Access-Token', token);
        expect(res).to.have.status(401);
      });

      it('get by id with wrong owner has 401 status', async () => {
        const res = await r().get('/my/WRONG/movies/1').set('X-Access-Token', token);
        expect(res).to.have.status(401);
      });

      it('get with bad token has 401 status', async () => {
        const res = await r().get('/our/WRONG/movies').set('X-Access-Token', token);
        expect(res).to.have.status(401);
      });

      it('get by id with bad token has 401 status', async () => {
        const res = await r().get('/our/WRONG/movies/1').set('X-Access-Token', token);
        expect(res).to.have.status(401);
      });
    });

    describe('Wrong Token usage', () => {
      it('has token', async () => {
        const res = await r().post('/login').send(credentials);
        expect(res.body).to.have.property('token');
        token = res.body.token + 'WRONG';
      });

      it('post with expired token has 403 status', async () => {
        const res = await r().post('/movies').set('X-Access-Token', token).send(movies[0]);
        expect(res).to.have.status(403);
      });

      it('get with bad token has 403 status', async () => {
        const res = await r().get('/movies').set('X-Access-Token', token);
        expect(res).to.have.status(403);
      });

      it('get with bad token has name BAD_TOKEN', async () => {
        const res = await r().get('/movies').set('X-Access-Token', token);
        expect(res.body.name).to.eql('BAD_TOKEN');
      });
    });

    describe('Wrong user add usage', () => {
      it('empty parameters', async () => {
        try {
          await api.user();
        } catch (err) {
          expect(err).to.eql('USER_NEED_CREDENTIALS');
        }
      });
      it('only login', async () => {
        try {
          await api.user({login: 'aaa'});
        } catch (err) {
          expect(err).to.eql('USER_NEED_CREDENTIALS');
        }
      });
      it('only password', async () => {
        try {
          await api.user({password: 'aaa'});
        } catch (err) {
          expect(err).to.eql('USER_NEED_CREDENTIALS');
        }
      });
      it('only md5', async () => {
        try {
          await api.user({md5: 'aaa'});
        } catch (err) {
          expect(err).to.eql('USER_NEED_CREDENTIALS');
        }
      });
      it('md5 and password', async () => {
        try {
          await api.user({md5: 'aaa'});
        } catch (err) {
          expect(err).to.eql('USER_NEED_CREDENTIALS');
        }
      });
    });

    it('Default expire check', async () => {
      const config = {...global.config, token:{ secret: 'AAA' }};
      const api2 = new global.Api(config);
      await api2.user(credentials);
      await api2.start();
      const r2 = () => request(api2.app.callback());
      const res = await r2().post('/login').send(credentials);
      expect(res).to.have.status(200);
      await api2.destroy();
    });

  });

});
