const expect = require("chai").expect;
const db = require("../models");

before(done => {
    db.sequelize.sync({ force: true })
        .then(() => {
            done();
        });
});

describe("Creating a Game", () => {

    it("should create successfully", done => {
        db.game.create({
            name: "Test Game",
            link: "SVQRjsXrhj"
        }).then(() => {
            done();
        }).catch(err => {
            done(err);
        })
    });

    it("should throw an error on invalid short name", done => {
        db.game.create({
            name:"",
            link:"SVQRjsXrhj"
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid long name", done => {
        db.game.create({
            name:"CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBS",
            link:"SVQRjsXrhj"
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid short link", done => {
        db.game.create({
            name: "Test Game",
            link: ""
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid long link", done => {
        db.game.create({
            name: "Test Game",
            link: "CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBS"
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });
});