
# API-I

### v.5.0.1

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
