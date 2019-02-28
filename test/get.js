const { expect, request } = require('chai');

describe('Get parameters', () => {
  let api;
  let r;
  const movies = [
    { name: 'Shaun of the Dead' },
    { name: 'Hot Fuzz', rates: 8 },
    { name: "The World's End", rates: 7 },
    { name: 'Baby driver' },
  ];

  before(async () => {
    api = new global.Api(global.configNoToken);
    await api.model('movies', { name: {type: 'string', required: true}, rates: 'integer' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  describe('Fill the data', () => {
    it('Add all movies and check the last one', async () => {
      for (let movie of movies) {
        await r().post('/movies').send(movie);
      }
      const res = await r().get('/movies');
      expect(res.body[movies.length - 1].name).to.eql(movies[movies.length - 1].name);
    });
  });

  describe('Search', () => {
    it('All data', async () => {
      const res = await r().get('/movies').query();
      expect(res.body.length).to.eql(4);
    });

    it('Full name', async () => {
      const res = await r().get('/movies?name=Hot Fuzz').query();
      expect(res.body.length).to.eql(1);
      expect(res.body[0].name).to.eql('Hot Fuzz');
    });

    it('Like name', async () => {
      const res = await r().get('/movies?name=:Hot%').query();
      expect(res.body.length).to.eql(1);
      expect(res.body[0].name).to.eql('Hot Fuzz');
    });

    it('Regexp name', async () => {
      const res = await r().get('/movies?name=~^.ot[\w\s]%2Bz{2}$').query();
      // expect(res.body.length).to.eql(1);
      // expect(res.body[0].name).to.eql('Hot Fuzz');
    });
  });

  describe('Pagination', () => {
    it('limit', async () => {
      const res = await r().get('/movies?_limit=2').query();
      expect(res.body.length).to.eql(2);
      expect(res.body[0].name).to.eql(movies[0].name);
    });

    it('limit and offset', async () => {
      const res = await r().get('/movies?_limit=1&_offset=2').query();
      expect(res.body.length).to.eql(1);
      expect(res.body[0].name).to.eql(movies[2].name);
    });

    it('page and per_page', async () => {
      const res = await r().get('/movies?_page=1&_per_page=2').query();
      expect(res.body.length).to.eql(2);
      expect(res.body[0].name).to.eql(movies[2].name);
    });

    it('limit and begin', async () => {
      const res = await r().get('/movies?_limit=1&_begin=2').query();
      expect(res.body.length).to.eql(1);
      expect(res.body[0].name).to.eql(movies[2].name);
    });

    it('limit and start', async () => {
      const res = await r().get('/movies?_limit=1&_start=2').query();
      expect(res.body.length).to.eql(1);
      expect(res.body[0].name).to.eql(movies[2].name);
    });

  });

  describe('Filters', () => {
    it('only name', async () => {
      const res = await r().get('/movies?_fields=name').query();
      expect(Object.keys(res.body[0])).to.eql(['name']);
      expect(res.body[0].name).to.eql(movies[0].name);
    });

    it('filter only name', async () => {
      const res = await r().get('/movies?_filter=name').query();
      expect(Object.keys(res.body[0])).to.eql(['name']);
      expect(res.body[0].name).to.eql(movies[0].name);
    });
  });

  describe('Sortings', () => {
    it('by name', async () => {
      const res = await r().get('/movies?_sort=name').query();
      expect(res.body[0].name).to.eql('Baby driver');
    });

    it('by name desc', async () => {
      const res = await r().get('/movies?_sort=-name').query();
      expect(res.body[0].name).to.eql("The World's End");
    });

    it('by rates desc', async () => {
      const res = await r().get('/movies?_sort=-rates').query();
      expect(res.body[0].name).to.eql('Hot Fuzz');
    });

    it('order by name desc', async () => {
      const res = await r().get('/movies?_order=-name').query();
      expect(res.body[0].name).to.eql("The World's End");
    });
  });

  describe('All together', () => {
    it('first name of the most rated movie', async () => {
      const res = await r().get('/movies?_sort=-rates&_limit=1&_fields=name').query();
      expect(res.body.length).to.eql(1);
      expect(res.body[0].name).to.eql('Hot Fuzz');
    });
  });

});
