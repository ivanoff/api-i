const { expect, request } = require('chai');

describe('Login', () => {
  let api;
  let r;
  let token;
  const movies = [
    { name: "Last Night In Soho" },
    { name: "Shadows" },
  ];

  const credentials = { login: 'test1', password: 'test2' };

  before(async () => {
    api = new global.Api(global.config);
    await api.user(credentials);
    await api.model('movies', { name: 'string' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

    describe('Wrong owner and group token usage', () => {
      it('has token', async () => {
        const res = await r().post('/login').send(credentials);
        expect(res.body).to.have.property('token');
        token = res.body.token;
      });

      it('get with bad token has 403 status', async () => {
        const res = await r().get('/my/WRONG/movies');
        expect(res).to.have.status(401);
      });

      it('post with wrong owner has 403 status', async () => {
        const res = await r().post('/my/WRONG/movies').set('X-Access-Token', token).send(movies[0]);
        expect(res).to.have.status(401);
      });

      it('get with bad token has 403 status', async () => {
        const res = await r().get('/my/WRONG/movies').set('X-Access-Token', token);
        expect(res).to.have.status(401);
      });

    });


});
