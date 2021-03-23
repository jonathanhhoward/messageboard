const cuid = require("cuid");
const db = require("../db");

const replySchema = new db.Schema({
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
  replies: [{ type: String, ref: "Reply" }],
});

module.exports = {
  replySchema,
  threadSchema,
  create,
  listRecent,
  createReply,
  get,
};

const Reply = db.model("Reply", replySchema);

function Thread(collection) {
  return db.model("Thread", threadSchema, collection);
}

async function create(collection, fields) {
  await Thread(collection).create(fields);
}

async function listRecent(collection) {
  return Thread(collection)
    .find()
    .sort({ bumped_on: -1 })
    .limit(10)
    .select("text created_on bumped_on replies")
    .populate({
      path: "replies",
      select: "text created_on",
      perDocumentLimit: 3,
    });
}

async function createReply(collection, id, fields) {
  const reply = await Reply.create(fields);
  const thread = await Thread(collection).findById(id);
  thread.replies.push(reply._id);
  thread.bumped_on = Date.now();
  await thread.save();
}

async function get(collection, id) {
  return Thread(collection)
    .findById(id)
    .select("text created_on bumped_on replies")
    .populate({
      path: "replies",
      select: "text created_on",
    });
}
