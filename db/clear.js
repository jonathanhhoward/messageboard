const { connection } = require("./index");

module.exports = async function () {
  try {
    await connection.dropCollection("test");
    await connection.dropCollection("replies");
    console.log("[Clear]: success!");
  } catch (err) {
    console.error("[MongoDB]:", err);
  }
};
