"use strict";

const {
  addThread,
  listRecentThreads,
  reportThread,
  removeThread,
  addReplyToThread,
  getThread,
  reportReplyOnThread,
  removeReplyFromThread,
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
