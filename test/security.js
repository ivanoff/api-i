const { expect, request } = require('chai');

describe('Security', () => {
  let api;
  let r;
  const movies = [{ name: 'Hot Fuzz' }];
  const comments = [{ name: 'Edgar', comment: 'the best movie))' }];
  const directors = [{ name: 'Edgar Wright' }];
  const actors = [{ name: 'Simon Pegg' }];

  before(async () => {
    api = new global.Api(global.config);
    await api.model('movies', { name: 'string' });
    await api.model('comments', { name: 'string', comment: 'integer' }, { openMethods: ['GET', 'POST'], denyMethods: ['PUT', 'DELETE'] });
    await api.model('directors', { name: 'string' }, { openMethods: 'GET', denyMethods: 'DELETE' });
    await api.model('actors', { name: 'string' }, { openMethods: '*' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  describe('Check tocken access', () => {
    it('get movies returns 401', async () => {
      const res = await r().get('/movies');
      expect(res).to.have.status(401);
    });

    it('post movies returns 401', async () => {
      const res = await r().post('/movies').send(movies[0]);
      expect(res).to.have.status(401);
    });

    it('patch movies returns 401', async () => {
      const res = await r().patch('/movies/1').send(movies[0]);
      expect(res).to.have.status(401);
    });

    it('put movies returns 401', async () => {
      const res = await r().put('/movies/1').send(movies[0]);
      expect(res).to.have.status(401);
    });

    it('delete movies returns 401', async () => {
      const res = await r().delete('/movies/1');
      expect(res).to.have.status(401);
    });
  })

  describe('Check free access to GET and POST', () => {
    it('get comments returns 200', async () => {
      const res = await r().get('/comments');
      expect(res).to.have.status(200);
    });

    it('post comments returns 201', async () => {
      const res = await r().post('/comments').send(comments[0]);
      expect(res).to.have.status(201);
    });

    it('patch comments returns 401', async () => {
      const res = await r().patch('/comments/1').send(comments[0]);
      expect(res).to.have.status(401);
    });

    it('put comments returns 401', async () => {
      const res = await r().put('/comments/1').send(comments[0]);
      expect(res).to.have.status(401);
    });

    it('delete comments returns 401', async () => {
      const res = await r().delete('/comments/1');
      expect(res).to.have.status(401);
    });
  });

  describe('Check GET only free access', () => {
    it('get directors returns 200', async () => {
      const res = await r().get('/directors');
      expect(res).to.have.status(200);
    });

    it('post directors returns 401', async () => {
      const res = await r().post('/directors').send(directors[0]);
      expect(res).to.have.status(401);
    });

    it('patch directors returns 401', async () => {
      const res = await r().patch('/directors/1').send(directors[0]);
      expect(res).to.have.status(401);
    });

    it('put directors returns 401', async () => {
      const res = await r().put('/directors/1').send(directors[0]);
      expect(res).to.have.status(401);
    });

    it('delete directors returns 401', async () => {
      const res = await r().delete('/directors/1');
      expect(res).to.have.status(401);
    });
  });

  describe('Check free access to all methods', () => {
    it('get actors returns 200', async () => {
      const res = await r().get('/actors');
      expect(res).to.have.status(200);
    });

    it('post actors returns 201', async () => {
      const res = await r().post('/actors').send(actors[0]);
      expect(res).to.have.status(201);
    });

    it('patch actors returns 401', async () => {
      const res = await r().patch('/actors/1').send(actors[0]);
      expect(res).to.have.status(200);
    });

    it('put actors returns 401', async () => {
      const res = await r().put('/actors/1').send(actors[0]);
      expect(res).to.have.status(200);
    });

    it('delete actors returns 401', async () => {
      const res = await r().delete('/actors/1');
      expect(res).to.have.status(200);
    });
  });

});
