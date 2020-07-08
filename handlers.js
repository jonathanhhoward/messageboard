module.exports = {
  addNewThread
}

async function addNewThread (req, res) {
  res.redirect(`/b/${req.params.board}/`)
}
