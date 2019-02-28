const { expect, request } = require('chai');

describe('main API', () => {
  let api;
  let r;

  const movies = [
    { name: "The World's End", rates: 7 },
    { name: 'Baby driver' },
    { name: 'Shaun of the Dead' },
    { name: 'Hot Fuzz', rates: 8 },
  ];

  before(async () => {
    api = new global.Api(global.configNoToken);
    await api.model('movies', { name: 'string', rates: 'integer' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  it('Check connection', async () => {
    request(api);
    expect(true);
  });

  describe('GET requests', () => {
    it('get movies returns 200', async () => {
      const res = await r().get('/movies');
      expect(res).to.have.status(200);
    });

    it('get movies has body', async () => {
      const res = await r().get('/movies');
      expect(res).to.have.property('body');
    });

    it('get movies result is empty array', async () => {
      const res = await r().get('/movies');
      expect(res.body).to.eql([]);
    });
  });

  describe('POST requests', () => {
    it('post movies returns 201', async () => {
      const res = await r().post('/movies').send(movies[0]);
      expect(res).to.have.status(201);
    });

    it('get movies returns array with 1 element', async () => {
      const res = await r().get('/movies');
      expect(res.body.length).to.eql(1);
    });

    it('get movies returns name of first movie', async () => {
      const res = await r().get('/movies');
      expect(res.body[0].name).to.eql(movies[0].name);
    });

    it('get movies by id result is not array', async () => {
      const res = await r().get('/movies/1');
      expect(res.body instanceof Array).to.be.false;
    });

    it('get movies by id returns name of first movie', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.name).to.eql(movies[0].name);
    });

    it('get movies by id returns count of rates', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.rates).to.eql(movies[0].rates);
    });

    it('post second movies returns 201 also', async () => {
      const res = await r().post('/movies').send(movies[1]);
      expect(res).to.have.status(201);
    });

    it('get movies returns array with 2 elements', async () => {
      const res = await r().get('/movies');
      expect(res.body.length).to.eql(2);
    });

    it('get movies returns name of first movie', async () => {
      const res = await r().get('/movies');
      expect(res.body[0].name).to.eql(movies[0].name);
    });

    it('get movies returns name of first movie', async () => {
      const res = await r().get('/movies');
      expect(res.body[1].name).to.eql(movies[1].name);
    });

    it('get movies by id result is not array', async () => {
      const res = await r().get('/movies/2');
      expect(Array.isArray(res.body)).to.be.false;
    });

    it('get movies by id returns name of first movie', async () => {
      const res = await r().get('/movies/2');
      expect(res.body.name).to.eql(movies[1].name);
    });
  });

  describe('PATCH requests', () => {
    it('patch movies returns 200', async () => {
      const res = await r().patch('/movies/1').send(movies[2]);
      expect(res).to.have.status(200);
    });

    it('get movies by id returns new name of first movie', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.name).to.eql(movies[2].name);
    });

    it('get movies by id returns correct count of rates', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.rates).to.eql(movies[0].rates);
    });

    it('second movie has old name', async () => {
      const res = await r().get('/movies/2');
      expect(res.body.name).to.eql(movies[1].name);
    });
  });

  describe('PUT requests', () => {
    it('put movies returns 200', async () => {
      const res = await r().put('/movies/1').send(movies[3]);
      expect(res).to.have.status(200);
    });

    it('get movies by id returns new name of first movie', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.name).to.eql(movies[3].name);
    });

    it('get movies by id returns correct count of rates', async () => {
      const res = await r().get('/movies/1');
      expect(res.body.rates).to.eql(movies[3].rates);
    });

    it('second movie has old name', async () => {
      const res = await r().get('/movies/2');
      expect(res.body.name).to.eql(movies[1].name);
    });
  });

  describe('DELETE requests', () => {
    it('delete movies returns 200', async () => {
      const res = await r().delete('/movies/1');
      expect(res).to.have.status(200);
    });

    it('get movies by id returns 404', async () => {
      const res = await r().get('/movies/1');
      expect(res).to.have.status(404);
    });

    it('get movies returns array with 1 element', async () => {
      const res = await r().get('/movies');
      expect(res.body.length).to.eql(1);
    });

    it('get movies returns array with 1 element', async () => {
      const res = await r().get('/movies');
      expect(res.body[0].name).to.eql(movies[1].name);
    });

    it('second movie has old name', async () => {
      const res = await r().get('/movies/2');
      expect(res.body.name).to.eql(movies[1].name);
    });
  });

});
