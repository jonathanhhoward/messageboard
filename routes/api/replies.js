const router = require("express-promise-router")();
const Thread = require("../../model");
const { notFound } = require("./utils");

async function addReplyToThread(req, res) {
  const board = req.params.board;
  const { thread_id, text, delete_password } = req.body;
  const fields = { text, delete_password };
  const thread = await Thread.addReply(board, thread_id, fields);
  if (!thread) return notFound(res, "thread not found");
  res.redirect(`/b/${board}/${thread_id}`);
}

async function getThread(req, res) {
  const thread = await Thread.get(req.params.board, req.query.thread_id);
  if (!thread) return notFound(res, "thread not found");
  res.json(thread);
}

async function reportReplyOnThread(req, res) {
  const msg = await Thread.reportReply(
    req.params.board,
    req.body.thread_id,
    req.body.reply_id
  );
  switch (msg) {
    case "thread not found":
    case "reply not found":
      return notFound(res, msg);
  }
  res.send(msg);
}

async function removeReplyFromThread(req, res) {
  const msg = await Thread.removeReply(
    req.params.board,
    req.body.thread_id,
    req.body.reply_id,
    req.body.delete_password
  );
  switch (msg) {
    case "incorrect password":
      return res.status(401).send(msg);
    case "thread not found":
    case "reply not found":
      return notFound(res, msg);
  }
  res.send(msg);
}

router
  .route("/:board")
  .post(addReplyToThread)
  .get(getThread)
  .put(reportReplyOnThread)
  .delete(removeReplyFromThread);

module.exports = router;
