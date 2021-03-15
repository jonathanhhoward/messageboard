"use strict";

const api = require("../handlers");

const router = require("express").Router();

router
  .route("/threads/:board")
  .post(api.addNewThread)
  .get(api.listRecentThreads);

router.route("/replies/:board").post(api.addNewReply).get(api.getThread);

module.exports = router;
