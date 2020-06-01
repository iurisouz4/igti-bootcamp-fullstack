const express = require("express");
const fs = require("fs");
const app = express();
const accountsRouter = require("../routes/accounts.js");
const port = 3000;
global.fileName = "accounts.json";

app.use(express.json());
app.use("/account", accountsRouter);

app.listen(port, () => {
  try {
    fs.readFile(global.fileName, "utf8", (err, data) => {
      err && createInitialJSON();
    });
  } catch (err) {
    console.log(err);
  }
  console.log(`API started on port: ${port}`);
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
