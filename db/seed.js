require("dotenv").config();

const { connection } = require("./index");
const Thread = require("../model");

connection.once("open", async () => {
  try {
    // Add 11 threads
    for (let i = 1; i <= 11; ++i) {
      await Thread.add("test", {
        _id: "t" + i,
        text: "thread text",
        delete_password: "thread password",
      });
    }

    // Add 4 replies to first thread
    for (let i = 0; i < 4; ++i) {
      await Thread.addReply("test", "t1", {
        text: "reply text",
        delete_password: "reply password",
      });
    }

    console.log("[Seed]: success!");
  } catch (err) {
    console.error("[MongoDB]:", err);
  }

  await connection.close();
});
