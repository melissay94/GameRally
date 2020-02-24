const expect = require("chai").expect;
const db = require("../models");

before(done => {
    db.sequelize.sync({ force: true })
        .then(() => {
            done();
        });
});

describe("Create an Event", () => {
    it("should create successfully", done => {
        db.event.create({
            description: "Test Description for an event",
            location: "111 Main Street, Seatlle 98107 WA",
            isVirtual: false,
            group_id: 2
        }).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });

    it("should throw an error on invalid past date", done => {
        db.event.create({
            datetime: "1900-02-24 15:38:36.38-08",
            description: "Test Description for an event",
            location: "111 Main Street, Seatlle 98107 WA",
            isVirtual: false,
            group_id: 2
        }).then(newEvent => {
            done();
        }).catch(err => {
            done();
        });
    });
});