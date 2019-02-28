const ControllersLogin = require('../controllers/login');

class LoginRouter {
  constructor({ router, config, models }) {
    const c = new ControllersLogin({ config, models });
    router.get('/login', c.info.bind(c));
    router.post('/login', c.login.bind(c));
    router.patch('/login', c.update.bind(c));
  }
}

module.exports = LoginRouter;
