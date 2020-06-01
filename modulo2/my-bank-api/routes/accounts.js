const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    if (!err) {
      let json = JSON.parse(data);

      let jsonRes = {
        accounts: json.accounts,
        message: "Contas listadas com sucesso.",
      };

      res.send(jsonRes);
    } else {
      res.status(400).send({
        accounts: [],
        message: err.message,
      });
    }
  });
});

router.get("/:id", (req, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    if (!err) {
      let json = JSON.parse(data);
      let account = json.accounts.find((account) => {
        return account.id === parseInt(req.params.id);
      });

      let jsonRes = {
        account,
        message: "Contas listadas com sucesso.",
      };

      if (!account) {
        jsonRes.account = {};
        jsonRes.message = "Nenhuma conta encontrada com o id especificado.";
      }

      res.send(jsonRes);
    } else {
      res.status(400).send({
        accounts: [],
        message: err.message,
      });
    }
  });
});

router.post("/", (req, res) => {
  let body = req.body;

  fs.readFile(global.fileName, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      try {
        let json = JSON.parse(data);
        body = { id: json.nextId++, ...body };
        json.accounts.push(body);
        fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
          if (!err) {
            const params = {
              accounts: body,
              message: "Conta incluída com sucesso.",
            };
            res.send(params);
          } else {
            res.status(400).send({
              accounts: [],
              message: err.message,
            });
          }
        });
      } catch (err) {
        res.status(400).send({
          accounts: [],
          message: err.message,
        });
      }
    }
  });
});

module.exports = router;
