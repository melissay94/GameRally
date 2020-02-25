var expect = require('chai').expect;
var request = require('supertest');
var app = require('../index');
var db = require('../models');
var agent = request.agent(app);

before(done => {
  db.sequelize.sync({ force: true }).then(() => {
    done();
  });
});

describe('GET /profile', () => {
  it('should redirect to / if not logged in', done => {
    request(app).get('/profile')
    .expect('Location', '/')
    .expect(302, done);
  });

  it('should return a 200 response if logged in', done => {
    agent.post('/signup')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      email: 'my@user.co',
      firstname: 'Brian',
      lastname: 'Smith',
      password: 'Pineapple1234'
    })
    .expect(302)
    .expect('Location', '/home')
    .end((error, res) => {
      if (error) {
        done(error);
      } else {
        agent.get('/profile')
        .expect(200, done);
      }
    });
  });
});
