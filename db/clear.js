const Thread = require("../model");

module.exports = async function () {
  try {
    const threads = await Thread.Thread("test").find();
    for (const thread of threads) {
      await Thread.remove("test", thread._id, "thread password");
    }
    console.log("[Clear]: success!");
  } catch (err) {
    console.error("[MongoDB]:", err);
  }
};
