const { expect, request } = require('chai');

describe('Expired Token', () => {
  let api;
  let r;
  let token;
  const movies = [{ name: "Last Night In Soho" }];

  const credentials = { login: 'test1', password: 'test2' };

  before(async () => {
    api = new global.Api({...global.config, token: { secret: 'TEST', expire: -1 }});
    await api.user(credentials);
    await api.model('movies', { name: 'string' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  describe('Expired Token usage', () => {
    it('has token', async () => {
      const res = await r().post('/login').send(credentials);
      expect(res.body).to.have.property('token');
      token = res.body.token;
    });

    it('post with expired token return 403', async () => {
      const res = await r().post('/movies').set('X-Access-Token', token).send(movies[0]);
      expect(res).to.have.status(403);
    });

    it('get with expired token return 403', async () => {
      const res = await r().get('/movies').set('X-Access-Token', token);
      expect(res).to.have.status(403);
    });

    it('get with bad token has name TOKEN_EXPIRED', async () => {
      const res = await r().get('/movies').set('X-Access-Token', token);
      expect(res.body.name).to.eql('TOKEN_EXPIRED');
    });
  });

});
