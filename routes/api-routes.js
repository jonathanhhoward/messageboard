"use strict";

const { newReply, newThread, thread, recentThreads } = require("../handlers");

const router = require("express").Router();

router.route("/threads/:board").post(newThread).get(recentThreads);

router.route("/replies/:board").post(newReply).get(thread);

module.exports = router;
