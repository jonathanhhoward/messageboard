require("dotenv").config();

const { connection, model } = require("./index");
const { repliesSchema, threadSchema } = require("../model");

connection.once("open", async () => {
  const testThreads = [];

  // Make 11 threads
  for (let i = 1; i <= 11; ++i) {
    testThreads.push({
      _id: "t" + i,
      text: "thread text",
      delete_password: "thread password",
      replies: [],
    });
  }

  const testReplies = [];

  // Add 4 replies to first thread
  for (let i = 1; i <= 4; ++i) {
    const replyId = "r" + i;
    testReplies.push({
      _id: replyId,
      text: "reply text",
      delete_password: "reply password",
    });
    testThreads[0].replies.push(replyId);
  }

  const TestThread = new model("TestThread", threadSchema, "testThreads");
  const TestReply = new model("TestReply", repliesSchema, "testReplies");

  try {
    await TestReply.insertMany(testReplies);
    await TestThread.insertMany(testThreads);
    console.log("[Seed]: success!");
  } catch (err) {
    console.error("[MongoDB]:", err);
  }

  await connection.close();
});
