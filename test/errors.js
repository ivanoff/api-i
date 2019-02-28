const { expect, request } = require('chai');

describe('Check errors', () => {
  let api;
  let r;

  before(async () => {
    api = new global.Api(global.config);
    await api.user({login: 1, password: 1});

    // Create self-defined proxied error
    api.error.NO_TOKEN_IN_HEADER = { NO_TOKEN: 'You have no token in headers' };

    // Create self-defined error
    api.error.SELF_DEFINED = { status: 418, teapod: true };

    api.router.post('/error', async ctx => {
      switch( ctx.request.body[0] ) {
        case 'plain_text': throw 'Just plain text';
        case 'plain_object': throw ['Just plain object'];
        case 'not_found': throw 'NOT_FOUND';

        case 'stack_plain': throw new Error ('Error text');
        case 'stack_not_found': throw new Error('NOT_FOUND');

        case 'dev_message': throw { 'NO_TOKEN': 'no token' };
        case 'proxied': throw 'NO_TOKEN_IN_HEADER';
        case 'self_defined': throw 'SELF_DEFINED';

      }
    });

    api.router.get('/error_sql', async ctx => {
      await api.models.db('errorNamedTable').select('*');
    });

    await api.start();
    r = () => request(api.app.callback());
  });

  after(async () => await api.destroy());

  it('Empty model name', async () => {
    try {
      await api.model()
    } catch (err) {
      expect(err).to.have.property('stack');
    }
  });

  it('Method not found has 404 status', async () => {
    const res = await r().get('/books');
    expect(res).to.have.status(404);
  });

  it('Method not found has body', async () => {
    const res = await r().get('/books');
    expect(res).to.have.property('body');
  });

  it('Method not found has name property', async () => {
    const res = await r().get('/books');
    expect(res.body).to.have.property('name');
  });

  it('User not found has 404 status', async () => {
    const res = await r().post('/login').send({refresh: '123'});
    expect(res).to.have.status(404);
  });

  it('User not found has name USER_NOT_FOUND', async () => {
    const res = await r().post('/login').send({refresh: '123'});
    expect(res.body).to.have.property('name').to.eql('USER_NOT_FOUND');
  });

  it('test error plain_text has 520 status', async () => {
    const res = await r().post('/error').send(['plain_text']);
    expect(res).to.have.status(520);
  });

  it('test error plain_object has 520 status', async () => {
    const res = await r().post('/error').send(['plain_object']);
    expect(res).to.have.status(520);
  });

  it('test error plain_text has error', async () => {
    const res = await r().post('/error').send(['plain_text']);
    expect(res.body).to.have.property('error').to.eql('Just plain text');
  });

  it('test error not_found has 404 status', async () => {
    const res = await r().post('/error').send(['not_found']);
    expect(res).to.have.status(404);
  });

  it('test error not_found has name', async () => {
    const res = await r().post('/error').send(['not_found']);
    expect(res.body).to.have.property('name').to.eql('NOT_FOUND');
  });

  it('test error not_found has message', async () => {
    const res = await r().post('/error').send(['not_found']);
    expect(res.body).to.have.property('message').to.eql('Not Found');
  });

  it('test error stack_plain has 520 status', async () => {
    const res = await r().post('/error').send(['stack_plain']);
    expect(res).to.have.status(520);
  });

  it('test error stack_plain has developerMessage', async () => {
    const res = await r().post('/error').send(['stack_plain']);
    expect(res.body).to.have.property('developerMessage').to.eql('Error text');
  });

  it('test error stack_plain has stack', async () => {
    const res = await r().post('/error').send(['stack_plain']);
    expect(res.body).to.have.property('stack').to.match(/^Error: Error text/);
  });

  it('test error stack_not_found has 404 status', async () => {
    const res = await r().post('/error').send(['stack_not_found']);
    expect(res).to.have.status(404);
  });

  it('test error stack_not_found has name', async () => {
    const res = await r().post('/error').send(['stack_not_found']);
    expect(res.body).to.have.property('name').to.eql('NOT_FOUND');
  });

  it('test error stack_not_found has message', async () => {
    const res = await r().post('/error').send(['stack_not_found']);
    expect(res.body).to.have.property('message').to.eql('Not Found');
  });

  it('test error dev_message has 401 status', async () => {
    const res = await r().post('/error').send(['dev_message']);
    expect(res).to.have.status(401);
  });

  it('test error dev_message has name', async () => {
    const res = await r().post('/error').send(['dev_message']);
    expect(res.body).to.have.property('name').to.eql('NO_TOKEN');
  });

  it('test error dev_message has developerMessage', async () => {
    const res = await r().post('/error').send(['dev_message']);
    expect(res.body).to.have.property('developerMessage').to.eql('no token');
  });

  it('test error proxied has 401 status', async () => {
    const res = await r().post('/error').send(['proxied']);
    expect(res).to.have.status(401);
  });

  it('test error proxied has name', async () => {
    const res = await r().post('/error').send(['proxied']);
    expect(res.body).to.have.property('name').to.eql('NO_TOKEN');
  });

  it('test error proxied has developerMessage', async () => {
    const res = await r().post('/error').send(['proxied']);
    expect(res.body).to.have.property('developerMessage').to.eql('You have no token in headers');
  });

  it('test error self_defined has 418 status', async () => {
    const res = await r().post('/error').send(['self_defined']);
    expect(res).to.have.status(418);
  });

  it('test error self_defined has name', async () => {
    const res = await r().post('/error').send(['self_defined']);
    expect(res.body).to.have.property('name').to.eql('SELF_DEFINED');
  });

  it('test error self_defined is teapod', async () => {
    const res = await r().post('/error').send(['self_defined']);
    expect(res.body).to.have.property('teapod').to.eql(true);
  });

  it('test error sql has 520 status', async () => {
    const res = await r().get('/error_sql');
    expect(res).to.have.status(520);
  });

  it('test error sql has name', async () => {
    const res = await r().get('/error_sql');
    expect(res.body).to.have.property('name').to.eql('Error: select * from `errorNamedTable` - SQLITE_ERROR: no such table: errorNamedTable');
  });

});
