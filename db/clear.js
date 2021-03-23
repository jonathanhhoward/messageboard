require("dotenv").config();

const { connection } = require("./index");

connection.once("open", async () => {
  try {
    await connection.dropCollection("test");
    await connection.dropCollection("replies");
    console.log("[Clear]: success!");
  } catch (err) {
    console.error("[MongoDB]:", err);
  }

  await connection.close();
});
