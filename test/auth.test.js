const expect = require('chai').expect;
const request = require('supertest');
const app = require('../index');
const db = require('../models');

before(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    done();
  });
});

describe('Auth Controller', function() {
  describe('POST /signup', function() {
    it('should redirect to /home on success', function(done) {
      request(app).post('/signup')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'new@new.co',
        firstname: 'Brian',
        lastname: 'Smith',
        password: 'Pineapple1234'
      })
      .expect('Location', '/home')
      .expect(302, done);
    });

    it('should redirect to /auth/signup on failure', function(done) {
      request(app).post('/signup')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'new',
        firstname: 'Brian',
        lastname: 'Smith',
        password: 'p'
      })
      .expect('Location', '/')
      .expect(302, done);
    });
  });

  describe('POST /login', function() {
    it('should redirect to /home on success', function(done) {
      request(app).post('/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'new@new.co',
        password: 'Pineapple1234'
      })
      .expect('Location', '/home')
      .expect(302, done);
    });

    it('should redirect to / on failure', function(done) {
      request(app).post('/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: 'new@new.co',
        password: 'p'
      })
      .expect('Location', '/')
      .expect(302, done);
    });
  });

  describe('GET /logout', function() {
    it('should redirect to /', function(done) {
      request(app).get('/logout')
      .expect('Location', '/')
      .expect(302, done);
    });
  });
});
