const ControllersLogin = require('../controllers/login');

class LoginRouter {
  constructor({ router, config, models }) {
    const c = new ControllersLogin({ config, models });
    router.post('/register', c.register.bind(c));
  }
}

module.exports = LoginRouter;
