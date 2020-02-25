var expect = require('chai').expect;
var db = require('../models');

before(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    done();
  });
});

describe('Creating a User', function() {
  it('should create successfully', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'Pineapple1234'
    }).then(function() {
      done();
    }).catch(function(error) {
      done(error);
    });
  });

  it('should throw an error on invalid email addresses', function(done) {
    db.user.create({
      email: 'notvalidemail',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'Pineapple1234'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid short first name', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: '',
      lastname: 'Doe',
      password: 'Pineapple1234'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid long first name', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBS',
      lastname: 'Doe',
      password: 'Pineapple1234'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid short last name', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: '',
      password: 'Pineapple1234'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid long last name', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBS',
      password: 'Pineapple1234'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid short password', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'short'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid long password', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBSbNC04qQU3c8zOn4HwGCFmzzCiHOh2v'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    })
  })  

  it('should throw an error on invalid missing capital password', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'nocapspassword11'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  it('should throw an error on invalid missing number password', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'NoNumbersPassword'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  }); 
   
  it('should throw an error on invalid missing lowercase password', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'NOLOWERCASEPASSWORD11'
    }).then(function(newUser) {
      done(newUser);
    }).catch(function(error) {
      done();
    });
  });

  

  it('should hash the password before save', function(done) {
    db.user.create({
      email: 'test@test.co',
      firstname: 'Jane',
      lastname: 'Doe',
      password: 'Pineapple1234'
    }).then(function(newUser) {
      if (newUser.password === 'Pineapple1234') {
        done(newUser);
      } else {
        done();
      }
    }).catch(function(error) {
      done(error);
    });
  });
});

describe('User instance methods', function() {
  describe('validPassword', function() {
    it('should validate a correct password', function(done) {
      db.user.findOne().then(function(user) {
        if (user.validPassword('Pineapple1234')) {
          done();
        } else {
          done(user);
        }
      }).catch(function(error) {
        done(error);
      });
    });

    it('should invalidate an incorrect password', function(done) {
      db.user.findOne().then(function(user) {
        if (!user.validPassword('nope')) {
          done();
        } else {
          done(user);
        }
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('toJSON', function() {
    it('should return a user without a password field', function(done) {
      db.user.findOne().then(function(user) {
        if (user.toJSON().password === undefined) {
          done();
        } else {
          done(user);
        }
      }).catch(function(error) {
        done(error);
      });
    });
  });
});

describe("Create new group by user", () => {
  it("Should create a group added to user", done => {
    db.user.findOrCreate({
      where: {
        email: "test@test.co"
      },
      defaults: {
        firstname: 'Jane',
        lastname: 'Doe',
        password: 'Pineapple1234'
      }
    }).then(([user, created]) => {
        db.group.findOrCreate({
          where: { name: "Settlers All Day Every Day" },
          defaults: { max_players: 3 }
        }).then(([group, created]) => {
            user.addGroup(group).then(group => {
              done();
            }).catch(err => {
              done(err);
            });
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });
});