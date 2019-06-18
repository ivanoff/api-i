[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]

# API-I

### v.5.3.1

## Example

```npm i -S api-i```

```npm i -S sqlite3```


example.js

```
const Api = require('api-i');
const config = {
  server: {
    port: 8877,
  },
  db: {
    client: 'sqlite3',
    connection: ':memory:',
  },
};

const api = new Api(config);

api.model('books', { name: 'string' }, { links: 'writers' });
api.model('writers', { name: 'string', birth: { type: 'date', required: true } });

api.start();

```

## Created by

  Dimitry Ivanov <2@ivanoff.org.ua> # curl -A cv ivanoff.org.ua

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/api-i
[npm-version-image]: http://img.shields.io/npm/v/api-i.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/api-i.svg?style=flat

[travis-url]: https://travis-ci.org/ivanoff/api-i
[travis-image]: https://travis-ci.org/ivanoff/api-i.svg?branch=master

[appveyor-url]: https://ci.appveyor.com/project/ivanoff/api-i/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/lp3nhnam1eyyqh33/branch/master?svg=true

[coveralls-url]: https://coveralls.io/github/ivanoff/api-i?branch=master
[coveralls-image]: https://coveralls.io/repos/github/ivanoff/api-i/badge.svg?branch=master

