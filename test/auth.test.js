const expect = require('chai').expect;
const request = require('supertest');
const app = require('../index');
const db = require('../models');
var agent = request.agent(app);

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
        firstName: 'Brian',
        lastName: 'Smith',
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
        firstName: 'Brian',
        lastName: 'Smith',
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

// describe("Home Page", () => {
//   it('should return a 200 response if logged in', done => {
//     agent.post('/signup')
//     .set('Content-Type', 'application/x-www-form-urlencoded')
//     .send({
//       email: 'my@user.co',
//       firstname: 'Brian',
//       lastname: 'Smith',
//       password: 'Pineapple1234'
//     })
//     .expect(302)
//     .expect('Location', '/home')
//     .end((error, res) => {
//       if (error) {
//         done(error);
//       } else {
//         agent.get('/home')
//         .expect(200, done);
//       }
//     });
//   });
// });