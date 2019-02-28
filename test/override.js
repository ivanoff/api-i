const { expect, request } = require('chai');

describe('Override methods', () => {
  let api;
  let r;
  const movies = [
    { name: "Last Night In Soho" },
    { name: "Shadows" },
  ];
  let moviesOverrided = [
    { name: "Last Night In Soho (2020)" },
    { name: "Shadows (2021)" },
  ];
  const movieNameToAdd = 'Untitled Sparks Documentary (2019)';
  const tableNameToSwitch = 'my_movies_table';

  before(async () => {
    api = new global.Api(global.configNoToken);
    await api.model('movies', { name: 'string' });
    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  it('Standart post', async () => {
    const res = await r().post('/movies').send(movies[0]);
    expect(res.body.id).to.eql(1);
  });

  it('Standart get', async () => {
    const res = await r().get('/movies');
    expect(res.body[0].name).to.eql(movies[0].name);
  });

  it('Standart get by id', async () => {
    const res = await r().get('/movies/1');
    expect(res.body.name).to.eql(movies[0].name);
  });

  it('Override get and get all movies', async () => {
    api.override.get('/movies', async ctx => ctx.body = moviesOverrided);
    const res = await r().get('/movies');
    expect(res.body[0].name).to.eql(moviesOverrided[0].name);
  });

  it('Standart post add second movie', async () => {
    const res = await r().post('/movies').send(movies[1]);
    expect(res.body.id).to.eql(2);
  });

  it('Standart get by id still return old data for first movie', async () => {
    const res = await r().get('/movies/1');
    expect(res.body.name).to.eql(movies[0].name);
  });

  it('Standart get by id still return old data for second movie', async () => {
    const res = await r().get('/movies/2');
    expect(res.body.name).to.eql(movies[1].name);
  });

  it('Override get by id and get first overrided movie', async () => {
    api.override.get('/movies/:id', async ctx => ctx.body = moviesOverrided[ctx.params.id-1]);
    const res = await r().get('/movies/1');
    expect(res.body.name).to.eql(moviesOverrided[0].name);
  });

  it('Get second overrided movie', async () => {
    const res = await r().get('/movies/2');
    expect(res.body.name).to.eql(moviesOverrided[1].name);
  });

  it('Override post and add movie', async () => {
    api.override.post('/movies', async ctx => ctx.body = moviesOverrided.push( ctx.request.body ));
    const res = await r().post('/movies').send({ name: movieNameToAdd });
    expect(res.body).to.eql(moviesOverrided.length);
  });

  it('Get third overrided movie', async () => {
    const res = await r().get('/movies/3');
    expect(res.body.name).to.eql(movieNameToAdd);
  });

  it('Return standart get method and get all movies', async () => {
    api.override.get('/movies', api.controllers('movies').get);
    const res = await r().get('/movies');
    expect(res.body[0].name).to.eql(movies[0].name);
  });

  it('Switch get and post to new table', async () => {
    await api.db.schema.createTable(tableNameToSwitch, table => {
      table.increments('id');
      table.string('name');
    });

    api.override.get('/movies', api.controllers(tableNameToSwitch).get);
    api.override.post('/movies', api.controllers(tableNameToSwitch).post);

    await r().post('/movies').send({ name: movieNameToAdd });
    const res = await r().get('/movies');
    expect(res.body[0].name).to.eql(movieNameToAdd);
  });

  it('Override patch', async () => {
    api.override.patch('/movies/:id', async ctx => ctx.body = ['patch']);
    const res = await r().patch('/movies/1');
    expect(res.body[0]).to.eql('patch');
  });

  it('Override put', async () => {
    api.override.put('/movies/:id', async ctx => ctx.body = ['put']);
    const res = await r().put('/movies/1');
    expect(res.body[0]).to.eql('put');
  });

  it('Override patch', async () => {
    api.override.delete('/movies/:id', async ctx => ctx.body = ['delete']);
    const res = await r().delete('/movies/1');
    expect(res.body[0]).to.eql('delete');
  });

});
