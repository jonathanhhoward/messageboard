const Thread = require("./model");

function notFound(res, msg) {
  res.status(404).send(msg);
}

async function addThread(req, res) {
  await Thread.add(req.params.board, req.body);
  res.redirect(`/b/${req.params.board}/`);
}

async function listRecentThreads(req, res) {
  const threads = await Thread.listRecent(req.params.board);
  res.json(threads);
}

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

async function removeThread(req, res) {
  const msg = await Thread.remove(
    req.params.board,
    req.body.thread_id,
    req.body.delete_password
  );
  switch (msg) {
    case "success":
      return res.status(200).send(msg);
    case "incorrect password":
      return res.status(401).send(msg);
    case "thread not found":
      return notFound(res, msg);
  }
}

async function removeReplyFromThread(req, res) {
  const msg = await Thread.removeReply(
    req.params.board,
    req.body.thread_id,
    req.body.reply_id,
    req.body.delete_password
  );
  switch (msg) {
    case "success":
      return res.status(200).send(msg);
    case "incorrect password":
      return res.status(401).send(msg);
    case "thread not found":
      return notFound(res, msg);
    case "reply not found":
      return notFound(res, msg);
  }
}

async function reportThread(req, res) {
  const msg = await Thread.report(req.params.board, req.body.thread_id);
  switch (msg) {
    case "success":
      return res.status(200).send(msg);
    case "thread not found":
      return notFound(res, msg);
  }
}

async function reportReplyOnThread(req, res) {
  const msg = await Thread.reportReply(
    req.params.board,
    req.body.thread_id,
    req.body.reply_id
  );
  switch (msg) {
    case "success":
      return res.status(200).send(msg);
    case "thread not found":
    case "reply not found":
      return notFound(res, msg);
  }
}

module.exports = {
  addThread,
  listRecentThreads,
  addReplyToThread,
  getThread,
  removeThread,
  removeReplyFromThread,
  reportThread,
  reportReplyOnThread,
};
