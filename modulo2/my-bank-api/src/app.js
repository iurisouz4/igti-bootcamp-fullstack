const express = require("express");
const fs = require("fs");
const app = express();
const accountsRouter = require("../routes/accounts.js");
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("../swagger.js");
const winston = require("winston");
const cors = require("cors");
const port = 3000;
global.fileName = "accounts.json";
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

app.use(cors());
app.use(express.json());
app.use("/account", accountsRouter);
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.listen(port, () => {
  try {
    fs.readFile(global.fileName, "utf8", (err, data) => {
      err && createInitialJSON();
    });
  } catch (err) {
    console.log(err);
  }
  logger.info(`API started on port: ${port}`);
});

function createInitialJSON() {
  const initJson = {
    nextId: 1,
    accounts: [],
  };
  fs.writeFile(global.fileName, JSON.stringify(initJson), (err) => {
    err && console.log(err);
  });
}
