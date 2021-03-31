const router = require("express").Router();
const Thread = require("../../model");
const { notFound } = require("./utils");

async function addThread(req, res) {
  await Thread.add(req.params.board, req.body);
  res.redirect(`/b/${req.params.board}/`);
}

async function listRecentThreads(req, res) {
  const threads = await Thread.listRecent(req.params.board);
  res.json(threads);
}

async function reportThread(req, res) {
  const msg = await Thread.report(req.params.board, req.body.thread_id);
  switch (msg) {
    case "thread not found":
      return notFound(res, msg);
  }
  res.send(msg);
}

async function removeThread(req, res) {
  const msg = await Thread.remove(
    req.params.board,
    req.body.thread_id,
    req.body.delete_password
  );
  switch (msg) {
    case "incorrect password":
      return res.status(401).send(msg);
    case "thread not found":
      return notFound(res, msg);
  }
  res.send(msg);
}

router
  .route("/:board")
  .post(addThread)
  .get(listRecentThreads)
  .put(reportThread)
  .delete(removeThread);

module.exports = router;
