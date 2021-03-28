const chaiHttp = require("chai-http");
const chai = require("chai");
const server = require("../server");
const seed = require("../db/seed");
const clear = require("../db/clear");

const assert = chai.assert;
chai.use(chaiHttp);

const THREADS_ROUTE = "/api/threads/test";
const REPLIES_ROUTE = "/api/replies/test";

suite("Functional Tests", function () {
  before(async function () {
    await seed();
  });

  after(async function () {
    await clear();
  });

  suite("API ROUTING FOR /api/threads/:board", function () {
    suite("POST", function () {
      test("create thread", function (done) {
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

    suite("PUT", function () {
      test("report thread", function (done) {
        chai
          .request(server)
          .put(THREADS_ROUTE)
          .type("form")
          .send({ thread_id: "t1" })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("thread does not exist", function (done) {
        chai
          .request(server)
          .put(THREADS_ROUTE)
          .type("form")
          .send({ thread_id: "t0" })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "thread not found");
            done();
          });
      });
    });

    suite("DELETE", function () {
      test("delete thread with password", function (done) {
        chai
          .request(server)
          .delete(THREADS_ROUTE)
          .type("form")
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

      test("incorrect password", function (done) {
        chai
          .request(server)
          .delete(THREADS_ROUTE)
          .type("form")
          .send({
            thread_id: "t10",
            delete_password: "password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 401);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });

      test("thread does not exist", function (done) {
        chai
          .request(server)
          .delete(THREADS_ROUTE)
          .type("form")
          .send({
            thread_id: "t0",
            delete_password: "password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "thread not found");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function () {
    suite("POST", function () {
      test("create reply on thread", function (done) {
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
            assert.match(res.redirects[0], /\/b\/test\/t1$/);
            done();
          });
      });

      test("thread does not exist", function (done) {
        chai
          .request(server)
          .post(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t0",
            text: "reply text",
            delete_password: "reply password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "thread not found");
            done();
          });
      });
    });

    suite("GET", function () {
      test("show all replies on thread", function (done) {
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

      test("thread does not exist", function (done) {
        chai
          .request(server)
          .get(REPLIES_ROUTE)
          .query({ thread_id: "t0" })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "thread not found");
            done();
          });
      });
    });

    suite("PUT", function () {
      test("report reply on thread", function (done) {
        chai
          .request(server)
          .put(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t1",
            reply_id: "r1",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("thread does not exist", function (done) {
        chai
          .request(server)
          .put(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t0",
            reply_id: "r1",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "thread not found");
            done();
          });
      });

      test("reply does not exist", function (done) {
        chai
          .request(server)
          .put(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t1",
            reply_id: "r0",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "reply not found");
            done();
          });
      });
    });

    suite("DELETE", function () {
      test("change reply to '[deleted]' on thread", function (done) {
        chai
          .request(server)
          .delete(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t1",
            reply_id: "r1",
            delete_password: "reply password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("incorrect password", function (done) {
        chai
          .request(server)
          .delete(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t1",
            reply_id: "r1",
            delete_password: "password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 401);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });

      test("thread does not exist", function (done) {
        chai
          .request(server)
          .delete(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t0",
            reply_id: "r1",
            delete_password: "reply password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "thread not found");
            done();
          });
      });

      test("reply does not exist", function (done) {
        chai
          .request(server)
          .delete(REPLIES_ROUTE)
          .type("form")
          .send({
            thread_id: "t1",
            reply_id: "r0",
            delete_password: "reply password",
          })
          .end(function (err, res) {
            assert.equal(err, null);
            assert.equal(res.status, 404);
            assert.equal(res.text, "reply not found");
            done();
          });
      });
    });
  });
});
