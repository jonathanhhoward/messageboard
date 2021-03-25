"use strict";

const {
  addReplyToThread,
  addThread,
  getThread,
  listRecentThreads,
  removeThread,
  removeReplyFromThread,
  reportThread,
  reportReplyOnThread,
} = require("../handlers");

const router = require("express").Router();

router
  .route("/threads/:board")
  .post(addThread)
  .get(listRecentThreads)
  .put(reportThread)
  .delete(removeThread);

router
  .route("/replies/:board")
  .post(addReplyToThread)
  .get(getThread)
  .put(reportReplyOnThread)
  .delete(removeReplyFromThread);

module.exports = router;
