module.exports = {
  addNewThread,
  listRecentThreads
}

async function addNewThread (req, res) {
  res.redirect(`/b/${req.params.board}/`)
}

async function listRecentThreads (req, res) {
  res.end()
}
