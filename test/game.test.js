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
            link: "https://example.com"
        }).then(() => {
            done();
        }).catch(err => {
            done(err);
        })
    });

    it("should throw an error on invalid short name", done => {
        db.game.create({
            name:"",
            link:"https://example.com"
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid long name", done => {
        db.game.create({
            name:"CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBS",
            link:"https://example.com"
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid url", done => {
        db.game.create({
            name: "Test Game",
            link: "notaurl"
        }).then(newGame => {
            done(newGame);
        }).catch(err => {
            done();
        });
    });
});