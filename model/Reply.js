const cuid = require("cuid");
const db = require("../db");

const replySchema = new db.Schema({
  _id: { type: String, default: cuid },
  text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
});

module.exports = db.model("Reply", replySchema);
