const users = require('./users');
const home = require('./home');

module.exports = function(app) {
  app.get('/', home.show);

  // Routes for account creation
  app.post('/users', users.create);
  app.post('/users/:id/verify', users.verify);
  app.post('/users/:id/resend', users.resend);
  app.get('/users/:id', users.showUser);
  app.post('/users/auth', users.auth);
}
