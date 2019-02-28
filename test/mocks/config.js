module.exports = {

  server: {
    host: 'localhost',
    port: 18877,
    standalone: true,
  },

  db: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
  },

  token: {
    secret: 'TEST',
    expire: 10,
  },

};
