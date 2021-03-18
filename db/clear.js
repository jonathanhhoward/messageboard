require("dotenv").config();

const { connection } = require("./index");

connection.once("open", () => {
  connection.dropCollection("test", (err) => {
    if (err) {
      console.error("[MongoDB]:", err);
    } else {
      console.log("[Clear]: success!");
    }

    connection.close();
  });
});
