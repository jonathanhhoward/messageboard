const Reply = require("./Reply");
const Thread = require("./Thread");

async function add(collection, fields) {
  await Thread(collection).create(fields);
}

async function listRecent(collection) {
  return Thread(collection)
    .find()
    .sort({ bumped_on: -1 })
    .limit(10)
    .select("text created_on bumped_on replies replycount")
    .populate({
      path: "replies",
      select: "text created_on",
      perDocumentLimit: 3,
    });
}

async function addReply(collection, id, fields) {
  const reply = await Reply.create(fields);
  const thread = await Thread(collection).findById(id);
  thread.replies.push(reply._id);
  thread.replycount++;
  thread.bumped_on = Date.now();
  await thread.save();
}

async function get(collection, id) {
  return Thread(collection)
    .findById(id)
    .select("text created_on bumped_on replies replycount")
    .populate({
      path: "replies",
      select: "text created_on",
    });
}

async function remove(collection, id, password) {
  // todo: implement remove associated replies
  const thread = await Thread(collection).findById(id);
  if (!thread) return "invalid id";
  if (thread.delete_password !== password) return "incorrect password";
  await thread.remove();
  return "success";
}

module.exports = {
  Reply,
  Thread,
  add,
  listRecent,
  addReply,
  get,
  remove,
};
