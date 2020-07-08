const Thread = require('./model')

module.exports = {
  addNewThread,
  listRecentThreads,
  addNewReply
}

async function addNewThread (req, res) {
  await Thread.create(req.params.board, req.body)
  res.redirect(`/b/${req.params.board}/`)
}

async function listRecentThreads (req, res) {
  const threads = await Thread.listRecent(req.params.board)
  res.json(threads)
}

async function addNewReply (req, res) {
  res.redirect(`/b/${req.params.board}/${req.body.thread_id}`)
}
