const { expect, request } = require('chai');

describe('Server check', () => {
  let { config } = global;
  let { host, port } = config.server;
  let r;
  let api;
  let url;

  describe('No models', () => {
    before(async () => {
      url = `http://${host}:${port}`;
      api = new global.Api({...config, server: {...config.server, port, host:undefined, standalone: false} });
      await api.start();
    });

    after(async () => await api.destroy());

    it('Check connection', async () => {
      request(url);
      expect(true);
    });
  });

  describe('One model', () => {
    before(async () => {
      port++;
      url = `http://${host}:${port}`;
      api = new global.Api({...config, token: undefined, server: {...config.server, port, standalone: false} });
      await api.model('books', { name: 'string' });
      await api.start();
      r = () => request(url);
    });

    after(async () => await api.destroy());

    it('get model returns 200', async () => {
      const res = await r().get('/books');
      expect(res).to.have.status(200);
    });

    it('get model has body', async () => {
      const res = await r().get('/books');
      expect(res).to.have.property('body');
    });

    it('result is empty array', async () => {
      const res = await r().get('/books');
      expect(res.body).to.eql([]);
    });
  });

  describe('Two servers', () => {
    let r2;
    let api2;

    before(async () => {
      port++;
      url = `http://${host}:${port}`;
      let server = {...config.server, port, standalone: false};
      api = new global.Api({...config, server, token: undefined});
      await api.model('books', { name: 'string' });
      await api.start();
      r = () => request(url);

      port++;
      const url2 = `http://${host}:${port}`;
      api2 = new global.Api({...config, server: {...server, port}, token: undefined});
      await api2.model('movies', { name: 'string' });
      await api2.start();
      r2 = () => request(url2);
    });

    after(async () => {
      await api.destroy();
      await api2.destroy();
    });

    it('get first server model returns 200', async () => {
      const res = await r().get('/books');
      expect(res).to.have.status(200);
    });

    it('get second server model returns 200', async () => {
      const res = await r2().get('/movies');
      expect(res).to.have.status(200);
    });

    it('get first server wrong model returns 404', async () => {
      const res = await r().get('/movies');
      expect(res).to.have.status(404);
    });

    it('get second server wrong model returns 404', async () => {
      const res = await r2().get('/books');
      expect(res).to.have.status(404);
    });
  });
});
