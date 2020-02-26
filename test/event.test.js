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
        db.group.findOrCreate({
            where: {
                id: 0
            }, defaults: {
                name: "Test Group",
                description: "This is a test group.",
                maxPlayers: 6
            }
        }).then(([group, created]) => {
            db.event.create({
                datetime: "2022-02-24 15:38:36.38-08",
                description: "Test Description for an event",
                location: "111 Main Street, Seatlle 98107 WA",
                isVirtual: false,
                groupId: group.id
            }).then(() => {
                done();
            }).catch(err => {
                done(err);
            });
        }).catch(err => {
            done(err);
        });
    });

    it("should throw an error on groupId not existing", done => {
        db.event.create({
            datetime: "2022-02-24 15:38:36.38-08",
            description: "Test Description for an event",
            location: "111 Main Street, Seatlle 98107 WA",
            isVirtual: false,
            groupId: 2
        }).then(newEvent => {
            done(newEvent);
        }).catch(err => {
            done();
        });
    });

    it("should throw an error on invalid past date", done => {
        db.event.create({
            datetime: "1900-02-24 15:38:36.38-08",
            description: "Test Description for an event",
            location: "111 Main Street, Seatlle 98107 WA",
            isVirtual: false,
            groupId: 2
        }).then(newEvent => {
            done(newEvent);
        }).catch(err => {
            done();
        });
    });
});