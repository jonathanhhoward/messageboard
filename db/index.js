const mongoose = require("mongoose");

const { connect, connection } = mongoose;

connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((err) => console.error("[MongoDB]:", err));

connection.on("open", () => console.log("[MongoDB]: connected"));
connection.on("disconnected", () => console.log("[MongoDB]: disconnected"));
connection.on("error", (err) => console.error("[MongoDB]:", err));

module.exports = mongoose;
