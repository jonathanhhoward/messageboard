const threads = require("./threads");
const replies = require("./replies");

module.exports = (app) => {
  app.use("/api/threads", threads);
  app.use("/api/replies", replies);
};
