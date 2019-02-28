const { expect, request } = require('chai');

describe('Linked models', () => {
  let api;
  let r;
  const movies = [
    { id: 1, name: 'Baby driver' },
    { id: 2, name: 'Hot Fuzz', genres: [{name: 'Action'}, {}, {name: 'Comedy'}] },
  ];
  const genres = [
    { id: 1, name: 'Action', movies: 1 },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Crime', movies: 1 },
  ];
  const actors = [
    { name: 'Simon Pegg' },
    { name: 'Nick Frost' },
  ];
  const directors = [
    { name: 'Edgar Wright', movies: [1, 2] },
  ];

  before(async () => {
    api = new global.Api(global.configNoToken);
    const name = 'string';
    await api.model('movies', { name }, { links: [ 'genres', 'directors' ]});
    await api.model('genres', { name });
    await api.model('actors', { name }, { links: 'movies'});
    await api.model('directors', { name }, { links: 'movies'});
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  describe('Add data', () => {
    it('add movies', async () => {
      await r().post('/movies').send(movies[0]);
      const res = await r().post('/movies').send(movies[1]);
      expect(res).to.have.status(201);
    });

    it('add first genres', async () => {
      const res = await r().post('/genres').send(genres[0]);
      expect(res).to.have.status(201);
    });

    it('add genres', async () => {
      await r().post('/genres').send(genres[1]);
      const res = await r().post('/genres').send(genres[2]);
      expect(res).to.have.status(201);
    });

    it('add actor', async () => {
      const res = await r().post('/movies/2/actors').send(actors[0]);
      expect(res).to.have.status(201);
    });

    it('add director by link to 2nd movie and links in send request', async () => {
      const res = await r().post('/movies/2/directors').send(directors[0]);
      expect(res).to.have.status(201);
    });

  });

  describe('Check directors', () => {
    it('movies by director returns 200', async () => {
      const res = await r().get('/directors/1/movies');
      expect(res).to.have.status(200);
    });
    it('directors by first movie returns 200', async () => {
      const res = await r().get('/movies/1/directors');
      expect(res).to.have.status(200);
    });
    it('get 2 movies by director', async () => {
      const res = await r().get('/directors/1/movies');
      expect(res.body.length).to.eql(2);
    });
    it('check first movie by director', async () => {
      const res = await r().get('/directors/1/movies');
      expect(res.body[0].name).to.eql(movies[0].name);
    });
    it('check second movie by director', async () => {
      const res = await r().get('/directors/1/movies');
      expect(res.body[1].name).to.eql(movies[1].name);
    });
    it('get director by first movie', async () => {
      const res = await r().get('/movies/1/directors');
      expect(res.body.length).to.eql(1);
    });
    it('check director by first movie', async () => {
      const res = await r().get('/movies/1/directors');
      expect(res.body[0].name).to.eql(directors[0].name);
    });
    it('get director by second movie', async () => {
      const res = await r().get('/movies/2/directors');
      expect(res.body.length).to.eql(1);
    });
    it('check director by first movie', async () => {
      const res = await r().get('/movies/2/directors');
      expect(res.body[0].name).to.eql(directors[0].name);
    });
  });

  describe('Check actors', () => {
    it('movies by actor returns 200', async () => {
      const res = await r().get('/actors/1/movies');
      expect(res).to.have.status(200);
    });
    it('actors by first movie returns 200', async () => {
      const res = await r().get('/movies/1/actors');
      expect(res).to.have.status(200);
    });
    it('get 1 movies by actor', async () => {
      const res = await r().get('/actors/1/movies');
      expect(res.body.length).to.eql(1);
    });
    it('check movie by actor', async () => {
      const res = await r().get('/actors/1/movies');
      expect(res.body[0].name).to.eql(movies[1].name);
    });
    it('get actor by second movie', async () => {
      const res = await r().get('/movies/2/actors');
      expect(res.body.length).to.eql(1);
    });
    it('check actor by second movie', async () => {
      const res = await r().get('/movies/2/actors');
      expect(res.body[0].name).to.eql(actors[0].name);
    });
  });

  describe('Check genres', () => {
    it('movies by genre returns 200', async () => {
      const res = await r().get('/genres/1/movies');
      expect(res).to.have.status(200);
    });
    it('genres by first movie returns 200', async () => {
      const res = await r().get('/movies/1/genres');
      expect(res).to.have.status(200);
    });
    it('get 2 movies by first genre', async () => {
      const res = await r().get('/genres/1/movies');
      expect(res.body.length).to.eql(2);
    });
    it('get 1 movie by second genre', async () => {
      const res = await r().get('/genres/2/movies');
      expect(res.body.length).to.eql(1);
    });
    it('get 1 movie by third genre', async () => {
      const res = await r().get('/genres/3/movies');
      expect(res.body.length).to.eql(1);
    });
    it('check first movie by first genre', async () => {
      const res = await r().get('/genres/1/movies');
      expect(res.body[0].name).to.eql(movies[1].name);
    });
    it('check second movie by first genre', async () => {
      const res = await r().get('/genres/1/movies');
      expect(res.body[1].name).to.eql(movies[0].name);
    });
    it('check movie by second genre', async () => {
      const res = await r().get('/genres/2/movies');
      expect(res.body[0].name).to.eql(movies[1].name);
    });
    it('check movie by third genre', async () => {
      const res = await r().get('/genres/3/movies');
      expect(res.body[0].name).to.eql(movies[0].name);
    });
    it('get 2 genres by first movie', async () => {
      const res = await r().get('/movies/1/genres');
      expect(res.body.length).to.eql(2);
    });
    it('get 2 genres by second movie', async () => {
      const res = await r().get('/movies/2/genres');
      expect(res.body.length).to.eql(2);
    });
    it('check first genre by first movie', async () => {
      const res = await r().get('/movies/1/genres');
      expect(res.body[0].name).to.eql(genres[0].name);
    });
    it('check second genre by first movie', async () => {
      const res = await r().get('/movies/1/genres');
      expect(res.body[1].name).to.eql(genres[2].name);
    });
    it('check first genre by second movie', async () => {
      const res = await r().get('/movies/2/genres');
      expect(res.body[0].name).to.eql(genres[0].name);
    });
    it('check second genre by second movie', async () => {
      const res = await r().get('/movies/2/genres');
      expect(res.body[1].name).to.eql(genres[1].name);
    });
  });

});
