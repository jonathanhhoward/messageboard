const chaiHttp = require("chai-http");
const chai = require("chai");
const server = require("../server");

const assert = chai.assert;
chai.use(chaiHttp);

const THREADS_ROUTE = "/api/threads/test";
const REPLIES_ROUTE = "/api/replies/test";

suite("Functional Tests", function () {
  suite("API ROUTING FOR /api/threads/:board", function () {
    suite("POST", function () {
      test("add a new thread", function (done) {
        chai
          .request(server)
          .post(THREADS_ROUTE)
          .type("form")
          .send({
            text: "thread text",
            delete_password: "thread password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.match(res.redirects[0], /\/b\/test\/$/);
            done();
          });
      });
    });

    suite("GET", function () {
      test("list recent threads", function (done) {
        chai
          .request(server)
          .get(THREADS_ROUTE)
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);

            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.isObject(res.body[0]);
            assert.hasAllKeys(res.body[0], [
              "_id",
              "text",
              "created_on",
              "bumped_on",
              "replies",
            ]);
            for (let i = 1; i < res.body.length; ++i) {
              assert.isAtMost(
                Date.parse(res.body[i].bumped_on),
                Date.parse(res.body[i - 1].bumped_on)
              );
            }

            for (const thread of res.body) {
              if (thread._id === "t1") {
                assert.isArray(thread.replies);
                assert.isAtMost(thread.replies.length, 3);
                assert.isObject(thread.replies[0]);
                assert.hasAllKeys(thread.replies[0], [
                  "_id",
                  "text",
                  "created_on",
                ]);
                break;
              }
            }

            done();
          });
      });
    });

    suite("DELETE", function () {});

    suite("PUT", function () {});
  });

  suite("API ROUTING FOR /api/replies/:board", function () {
    suite("POST", function () {
      test("add a new reply", function (done) {
        chai
          .request(server)
          .post(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t1",
            text: "reply text",
            delete_password: "reply password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.match(res.redirects[0], /\/b\/test\/t1/);
            done();
          });
      });
    });

    suite("GET", function () {
      test("get a thread", function (done) {
        chai
          .request(server)
          .get(REPLIES_ROUTE)
          .query({ thread_id: "t1" })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);

            assert.isObject(res.body);
            assert.hasAllKeys(res.body, [
              "_id",
              "text",
              "created_on",
              "bumped_on",
              "replies",
            ]);

            assert.isArray(res.body.replies);
            if (res.body.replies.length) {
              assert.isAbove(
                Date.parse(res.body.bumped_on),
                Date.parse(res.body.created_on)
              );
            }

            assert.isObject(res.body.replies[0]);
            assert.hasAllKeys(res.body.replies[0], [
              "_id",
              "text",
              "created_on",
            ]);
            done();
          });
      });
    });

    suite("PUT", function () {});

    suite("DELETE", function () {});
  });
});
