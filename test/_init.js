const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const Api = require('../src');
const config = require('./mocks/config');

describe('Init', () => {
  global.Api = Api;
  global.config = config;
  global.configNoToken = {...config, token: undefined};
  global.configNoDb = {...config, token: undefined, db: undefined};
})