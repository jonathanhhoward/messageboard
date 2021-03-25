const Thread = require("./model");

function notFound(res, msg = "thread not found") {
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
  if (!thread) return notFound(res);
  res.redirect(`/b/${board}/${thread_id}`);
}

async function getThread(req, res) {
  const thread = await Thread.get(req.params.board, req.query.thread_id);
  if (!thread) return notFound(res);
  res.json(thread);
}

async function removeThread(req, res) {
  const msg = await Thread.remove(
    req.params.board,
    req.query.thread_id,
    req.query.delete_password
  );
  switch (msg) {
    case "success":
      return res.status(200).send(msg);
    case "incorrect password":
      return res.status(401).send(msg);
    case "thread not found":
      return notFound(res);
  }
}

async function removeReplyFromThread(req, res) {
  res.send("success");
}

module.exports = {
  addThread,
  listRecentThreads,
  addReplyToThread,
  getThread,
  removeThread,
  removeReplyFromThread,
};
