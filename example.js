'use strict';
const Api = require('./src');

const config = {

  server: {
    host: 'localhost',
    port: 8877,
  },

  db: {
    client: 'sqlite3',
    connection: ':memory:',
  },

  token: {
    secret: 'REPLACE_IT',
    expire: 10,
  },

  updateGet: (...raw) => ({raw}),
};

const updateGet = (...data) => ({ data});

const api = new Api(config);

(async () => {
  await api.user({login: 'l', password: 'p'});

  await api.model('books', { name: 'string' }, { links: 'writers', openMethods: ['GET', 'POST', 'DELETE'], updateGet});

  await api.model('writers', { name: 'string', birth: { type: 'date', required: true } }, { openMethods: ['GET', 'POST', 'DELETE'] });

  await api.model('coments', { name: 'string', comment: 'string' }, { links: ['writers', 'books'], openMethods: ['GET', 'POST', 'DELETE'] });

  await api.start();

  await api.initData('books', [
    {name: 'name 1'},
    {name: 'name 2'},
    {name: 'name 3'},
  ])
})();

/**
//=== CREATE TABLES ===

// #1 CASE psql
create table _free_access(id serial PRIMARY KEY, name text, method text);
insert into table _free_access (name, method) values ('comments', 'GET'), ('comments', 'POST');
create table books(id serial PRIMARY KEY, name text);
create table writers(id serial PRIMARY KEY, name text, bitrh date not null);
create table comments(id serial PRIMARY KEY, name text, comment text);
create table books_writers(id serial PRIMARY KEY, books integer references books(id), writers integer references writers(id));
create table comments_books(id serial PRIMARY KEY, comments integer references comments(id), books integer references books(id));
create table comments_writers(id serial PRIMARY KEY, comments integer references comments(id), writers integer references writers(id));

// #2 CASE migration.js
api.model('books', { name: 'string' }, { links: 'writers', recreate: true });
api.model('writers', { name: 'string', birth: { type: 'date', required: true } }, { recreate: true } );
api.model('coments', { name: 'string', comment: 'string' }, { links: ['writers', 'books'], openMethods: ['GET', 'POST'], recreate: true });

// #3 CASE migration.js
api.recreate();
api.model('books', { name: 'string' });
api.model('writers', { name: 'string', birth: { type: 'date', required: true } } );
api.model('coments', { name: 'string', comment: 'string' });
api.links('books', 'writers');
api.links('comments', ['books', 'writers']);
api.openMethods('comments', ['GET', 'POST'])

//=== USAGE ===

// index.js
api.model('books');
api.model('writers');
api.model('coments');
api.start();

// index.js
api.models(['books', 'writers', 'coments']);
api.start();
*/
