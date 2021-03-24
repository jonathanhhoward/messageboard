"use strict";

const {
  addReplyToThread,
  addThread,
  getThread,
  listRecentThreads,
} = require("../handlers");

const router = require("express").Router();

router
  .route("/threads/:board")
  .post(addThread)
  .get(listRecentThreads)

router.route("/replies/:board").post(addReplyToThread).get(getThread);

module.exports = router;
