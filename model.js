const db = require('./db')

let now = Date.now()
const threadSchema = new db.Schema({
  text: { type: String, required: true },
  created_on: { type: Date, default: now },
  bumped_on: { type: Date, default: now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  replies: []
})

module.exports = {
  create,
  listRecent
}

function Thread (collection) {
  return db.model('Thread', threadSchema, collection)
}

async function create (collection, fields) {
  await Thread(collection).create(fields)
}

async function listRecent (collection) {
  return await Thread(collection).find({})
    .select('text created_on bumped_on replies')
    .sort({ bumped_on: -1 })
    .limit(10)
}
