require("dotenv").config();

const { connection, model } = require("./index");
const { threadSchema } = require("../model");

connection.once("open", () => {
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

  // Add 4 replies to first thread
  for (let i = 1; i <= 4; ++i) {
    testThreads[0].replies.push({
      _id: `r${i}${testThreads[0]._id}`,
      text: "reply text",
      delete_password: "reply password",
    });
  }

  const TestThread = new model("TestThread", threadSchema, "test");

  TestThread.insertMany(testThreads, (err) => {
    if (err) {
      console.error("[MongoDB]:", err);
    } else {
      console.log("[Seed]: success!");
    }

    connection.close();
  });
});
