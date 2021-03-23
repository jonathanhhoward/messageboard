require("dotenv").config();

const { connection } = require("./index");
const { Reply, Thread } = require("../model");
const cuid = require("cuid");

connection.once("open", async () => {
  const threads = [];

  // Make 11 threads
  for (let i = 1; i <= 11; ++i) {
    threads.push({
      _id: "t" + i,
      text: "thread text",
      delete_password: "thread password",
      replies: [],
    });
  }

  const replies = [];

  // Add 4 replies to first thread
  for (let i = 1; i <= 4; ++i) {
    const replyId = cuid();
    replies.push({
      _id: replyId,
      text: "reply text",
      delete_password: "reply password",
    });
    threads[0].replies.push(replyId);
  }

  try {
    await Reply.insertMany(replies);
    await Thread("test").insertMany(threads);
    console.log("[Seed]: success!");
  } catch (err) {
    console.error("[MongoDB]:", err);
  }

  await connection.close();
});
