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
            res.body.forEach((thread, i, threads) => {
              assert.isObject(thread);
              assert.hasAllKeys(thread, [
                "_id",
                "text",
                "created_on",
                "bumped_on",
                "replies",
                "replycount",
              ]);
              if (i > 1) {
                assert.isAtMost(
                  Date.parse(threads[i].bumped_on),
                  Date.parse(threads[i - 1].bumped_on)
                );
              }
              if (thread._id === "t1") {
                assert.isArray(thread.replies);
                assert.isAtMost(thread.replies.length, 3);
                thread.replies.forEach((reply) => {
                  assert.isObject(reply);
                  assert.hasAllKeys(reply, ["_id", "text", "created_on"]);
                });
              }
            });
            done();
          });
      });
    });

    suite("DELETE", function () {
      test("delete a thread", function (done) {
        chai
          .request(server)
          .delete(THREADS_ROUTE)
          .send({
            thread_id: "t11",
            delete_password: "thread password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });

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
              "replycount",
            ]);
            assert.isArray(res.body.replies);
            assert.equal(res.body.replycount, res.body.replies.length);
            if (res.body.replies.length) {
              assert.isAbove(
                Date.parse(res.body.bumped_on),
                Date.parse(res.body.created_on)
              );
            }
            res.body.replies.forEach((reply) => {
              assert.isObject(reply);
              assert.hasAllKeys(reply, ["_id", "text", "created_on"]);
            });
            done();
          });
      });
    });

    suite("PUT", function () {});

    suite("DELETE", function () {});
  });
});
