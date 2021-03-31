"use strict";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const apiRoutes = require("./routes/api");
const fccTestingRoutes = require("./routes/fcctesting");
const runner = require("./test-runner");
const db = require("./db");

const app = express();

app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.get("/b/:board/", (req, res) =>
  res.sendFile(`${process.cwd()}/views/board.html`)
);
app.get("/b/:board/:threadid", (req, res) =>
  res.sendFile(`${process.cwd()}/views/thread.html`)
);

//Index page (static HTML)
app.get("/", (req, res) => res.sendFile(process.cwd() + "/views/index.html"));

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use((req, res, next) => res.status(404).send("Not Found"));

//Start our server and tests!
const server = app.listen(process.env.PORT, () => {
  console.log("Listening on port", server.address().port);
  db.connection.once("open", () => {
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function () {
        try {
          runner.run();
        } catch (error) {
          console.log("Tests are not valid:");
          console.log(error);
        }
      }, 1500);
    }
  });
});

module.exports = app; //for testing
