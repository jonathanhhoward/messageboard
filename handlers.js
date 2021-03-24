const Thread = require("./model");

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
  await Thread.addReply(board, thread_id, fields);
  res.redirect(`/b/${board}/${thread_id}`);
}

async function getThread(req, res) {
  const thread = await Thread.get(req.params.board, req.query.thread_id);
  res.json(thread);
}

async function removeThread(req, res) {
  res.send("success");
}

module.exports = {
  addThread,
  listRecentThreads,
  addReplyToThread,
  getThread,
  removeThread,
};
