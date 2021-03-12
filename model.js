const cuid = require("cuid");
const db = require("./db");

const repliesSchema = new db.Schema({
  _id: { type: String, default: cuid },
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
});

let now = Date.now();
const threadSchema = new db.Schema({
  _id: { type: String, default: cuid },
  text: { type: String, required: true },
  created_on: { type: Date, default: now },
  bumped_on: { type: Date, default: now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  replies: [repliesSchema],
});

module.exports = {
  create,
  listRecent,
  createReply,
  get,
};

function Thread(collection) {
  return db.model("Thread", threadSchema, collection);
}

async function create(collection, fields) {
  await Thread(collection).create(fields);
}

async function listRecent(collection) {
  return await Thread(collection)
    .find({})
    .select(
      "text created_on bumped_on replies._id replies.text replies.created_on"
    )
    .sort({ bumped_on: -1 })
    .limit(10);
}

async function createReply(collection, id, fields) {
  const thread = await Thread(collection).findById(id);
  thread.replies.push(fields);
  thread.bumped_on = Date.now();
  await thread.save();
}

async function get(collection, id) {
  return await Thread(collection)
    .findById(id)
    .select(
      "text created_on bumped_on replies._id replies.text replies.created_on"
    );
}
