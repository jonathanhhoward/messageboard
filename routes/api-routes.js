"use strict";

const {
  addReplyToThread,
  addThread,
  getThread,
  listRecentThreads,
  removeThread,
  removeReplyFromThread,
} = require("../handlers");

const router = require("express").Router();

router
  .route("/threads/:board")
  .post(addThread)
  .get(listRecentThreads)
  .delete(removeThread);

router
  .route("/replies/:board")
  .post(addReplyToThread)
  .get(getThread)
  .delete(removeReplyFromThread);

module.exports = router;
