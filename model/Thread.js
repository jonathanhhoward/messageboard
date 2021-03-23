const cuid = require("cuid");
const db = require("../db");

let now = Date.now();
const threadSchema = new db.Schema({
  _id: { type: String, default: cuid },
  text: { type: String, required: true },
  created_on: { type: Date, default: now },
  bumped_on: { type: Date, default: now },
  reported: { type: Boolean, default: false },
  delete_password: { type: String, required: true },
  replies: [{ type: String, ref: "Reply" }],
});

module.exports = function (collection) {
  return db.model("Thread", threadSchema, collection);
};
