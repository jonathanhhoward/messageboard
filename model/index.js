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
  const thread = await Thread(collection).findById(id);
  if (!thread) return null;
  const reply = await Reply.create(fields);
  thread.replies.push(reply._id);
  thread.replycount++;
  thread.bumped_on = Date.now();
  await thread.save();
  return thread;
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
  const thread = await Thread(collection).findById(id);
  if (!thread) return "thread not found";
  if (thread.delete_password !== password) return "incorrect password";
  for (const id of thread.replies) {
    await Reply.findById(id).deleteOne();
  }
  await thread.deleteOne();
  return "success";
}

async function removeReply(collection, threadId, replyId, password) {
  const thread = await Thread(collection).findById(threadId);
  if (!thread) return "thread not found";
  const reply = await Reply.findById(replyId);
  if (!reply) return "reply not found";
  if (reply.delete_password !== password) return "incorrect password";
  reply.text = "[deleted]";
  await reply.save();
  return "success";
}

async function report(collection, id) {
  const thread = await Thread(collection).findById(id);
  if (!thread) return "thread not found";
  thread.reported = true;
  await thread.save();
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
  removeReply,
  report,
};
