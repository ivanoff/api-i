[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]

# API-I

### v.7.2.1

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
  updateGet: (...raw) => ({raw}),
};

const api = new Api(config);

const updateGet = (...data) => ({ data});

(async () => {
  await api.model('books', { name: 'string' }, { links: 'writers', openMethods: ['GET', 'POST', 'DELETE'], updateGet });
  await api.model('writers', { name: 'string', birth: { type: 'date', required: true } });

  await api.start();

  await api.initData('books', [
    {name: "Alice's Adventures in Wonderland"},
    {name: "Moby-Dick; or, The Whale"},
  ])
})();

```

### GET request example

```curl localhost:8877/books```

```{"data":[[{"id":1,"created_at":null,"updated_at":null,"name":"Alice's Adventures in Wonderland"},{"id":2,"created_at":null,"updated_at":null,"name":"Moby-Dick; or, The Whale"}]]}```

### GET by id

```curl localhost:8877/books/2```

```{"id":2,"created_at":null,"updated_at":null,"name":"Moby-Dick; or, The Whale"}```


### POST request example

```curl -X POST -d '{"name":"Les Trois Mousquetaires"}' --header "Content-Type: application/json" localhost:8877/books```

```{"id":3}```

### DELETE request example

```curl -X DELETE localhost:8877/books/2```

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

