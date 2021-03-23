const Reply = require("./Reply");
const Thread = require("./Thread");

async function create(collection, fields) {
  await Thread(collection).create(fields);
}

async function list(collection) {
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

async function reply(collection, id, fields) {
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

module.exports = {
  Reply,
  Thread,
  create,
  list,
  reply,
  get,
};
