const Thread = require("./model");

async function addNewThread(req, res) {
  await Thread.create(req.params.board, req.body);
  res.redirect(`/b/${req.params.board}/`);
}

async function listRecentThreads(req, res) {
  const threads = await Thread.list(req.params.board);
  res.json(threads);
}

async function addNewReply(req, res) {
  const board = req.params.board;
  const { thread_id, text, delete_password } = req.body;
  const fields = { text, delete_password };
  await Thread.reply(board, thread_id, fields);
  res.redirect(`/b/${board}/${thread_id}`);
}

async function getThread(req, res) {
  const thread = await Thread.get(req.params.board, req.query.thread_id);
  res.json(thread);
}

module.exports = {
  addNewThread,
  listRecentThreads,
  addNewReply,
  getThread,
};
