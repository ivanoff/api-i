const { expect } = require('chai');

describe('DB', () => {
  let api;

  before(async () => {
    api = new global.Api(global.configNoToken);
  });

  after(async () => await api.destroy());

  it('wrong replace error has stack', async () => {
    try {
      await api.models.replace('aa', 1, {bb:2});
    } catch(err) {
      expect(err).to.have.property('stack');
    }
  });

  it('wrong replace error has code', async () => {
    try {
      await api.models.replace('aa', 1, {bb:2});
    } catch(err) {
      expect(err).to.have.property('code').to.eql('SQLITE_ERROR');
    }
  });

});
