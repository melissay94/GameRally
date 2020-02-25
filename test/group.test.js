const expect = require("chai").expect;
const db = require("../models");

before(done => {
    db.sequelize.sync({ force: true })
        .then(() => {
            done();
        });
});

describe("Creating a Group", () => {
    it("should create successfully", done => {
        db.group.create({
            name: "Test Group",
            description: "This is a test group.",
            max_players: 6
        }).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });

    it("should throw an error on invalid short name", done => {
        db.group.create({
            name: "",
            description: "This is a test group.",
            max_players: 6
        }).then(newGroup => {
            done(newGroup);
        }).catch(err => {
            done();
        })
    });

    it("should throw an error on invalid long name", done => {
        db.group.create({
            name:"CHC6iNnbuEgGhX5fZuX7VjGppEbapR03ftVoiWOMS1agZHg9S1Xpm1085XKvTgRYr42BBS",
            description: "This is a test group.",
            max_players: 6
        }).then(newGroup => {
            done(newGroup);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid max player amount", done => {
        db.group.create({
            name: "Test Group",
            description: "This is a test group.",
            max_players: 0
        }).then(newGroup => {
            done(newGroup);
        }).catch(err => {
            done();
        });
    });
});

describe("Create new event by group", () => {
    db.group.findOne().then(group => {
        group.createEvent({
            datetime: "2022-02-24 15:38:36.38-08",
            description: "Test Description for an event",
            location: "111 Main Street, Seatlle 98107 WA",
            isVirtual: false,
            group_id: group.id
        }).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
});
