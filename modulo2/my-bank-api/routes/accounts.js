const express = require("express");
const fs = require("fs").promises;
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    let jsonRes = {
      accounts: json.accounts,
      message: "Contas listadas com sucesso.",
    };
    logger.info(`GET /account`);
    res.send(jsonRes);
  } catch (error) {
    logger.info(`GET /account - ${err.message}`);
    res.status(400).send({
      accounts: [],
      message: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const data = await fs.readFile(global.fileName, "utf8");
  try {
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
    logger.info(`GET /account/${req.params.id}`);
    res.send(jsonRes);
  } catch (err) {
    logger.info(`GET /account - ${err.message}`);
    res.status(400).send({
      accounts: [],
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  let body = req.body;
  try {
    const data = await fs.readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    body = { id: json.nextId++, ...body };
    json.accounts.push(body);
    await fs.writeFile(global.fileName, JSON.stringify(json));
    const params = {
      accounts: body,
      message: "Conta incluída com sucesso.",
    };
    res.send(params);
    logger.info(`POST /account - ${JSON.stringify(params)}`);
  } catch (err) {
    logger.info(`POST /account - ${err.message}`);
    res.status(400).send({
      accounts: [],
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const data = await fs.readFile(global.fileName, "utf8");
    const json = JSON.parse(data);
    let accounts = json.accounts.filter(
      (account) => account.id !== parseInt(req.params.id, 10)
    );
    json.accounts = accounts;
    await fs.writeFile(global.fileName, JSON.stringify(json));
    logger.info(`DELETE /account/${req.params.id}`);
    return res.json({ success: true });
  } catch (err) {
    logger.info(`DELETE /account - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  let newAccount = req.body;
  try {
    const data = await fs.readFile(global.fileName, "utf8");

    let json = JSON.parse(data);
    let oldIndex = json.accounts.findIndex(
      (account) => account.id === newAccount.id
    );

    json.accounts[oldIndex] = {
      id: newAccount.id,
      name: newAccount.name,
      balance: newAccount.balance,
    };

    await fs.writeFile(global.fileName, JSON.stringify(json));
    logger.info(`PUT /account - ${JSON.stringify(json.accounts[oldIndex])}`);
    return res.json({ success: true });
  } catch (err) {
    logger.info(`PUT /account - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

router.post("/transaction", async (req, res) => {
  let params = req.body;
  try {
    const data = await fs.readFile(global.fileName, "utf8");

    let json = JSON.parse(data);
    let index = json.accounts.findIndex((account) => account.id === params.id);

    if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
      throw new Error("Não há saldo suficiente.");
    }
    json.accounts[index].balance += Number(params.value);
    await fs.writeFile(global.fileName, JSON.stringify(json));
    logger.info(
      `POST /account/transaction - ${JSON.stringify(json.accounts[index])}`
    );
    return res.json({ balance: json.accounts[index].balance });
  } catch (err) {
    logger.info(`POST /account/transaction - ${err.message}`);
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
