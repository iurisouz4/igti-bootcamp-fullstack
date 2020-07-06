import express from "express";
import mongoose from "mongoose";
import accountSchema from "../models/account.js";
const router = express.Router();
const Account = mongoose.model("account", accountSchema);

// 4
router.post("/deposit", async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;
    const account = await Account.findOne({ agencia, conta });
    if (!account) {
      res.send({ message: "Conta não encontrada..." });
    }
    await account.updateOne({ $inc: { balance: value } });
    const updatedAccount = await Account.findOne(
      { agencia, conta },
      { _id: 0 }
    );
    res.send(updatedAccount);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

// 5
router.post("/withdrawal", async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;
    const account = await Account.findOne({ agencia, conta });
    if (!account) {
      return res.send({ message: "Conta não encontrada..." });
    }
    if (account.balance < value + 1) {
      return res.send({ message: "Saldo atual insuficiente..." });
    }
    await account.updateOne({ $inc: { balance: -(value + 1) } });
    const updatedAccount = await Account.findOne(
      { agencia, conta },
      { _id: 0 }
    );
    return res.send(updatedAccount);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
});

// 6
router.get("/balance/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await Account.findOne(
      { agencia, conta },
      { agencia: 0, conta: 0, _id: 0 }
    );
    if (!account) {
      return res.send({ message: "Conta não encontrada..." });
    }
    return res.send(account);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
});

// 7
router.delete("/close/:agencia/:conta", async (req, res) => {
  try {
    const { agencia, conta } = req.params;
    const account = await Account.deleteOne({ agencia, conta });
    if (account.deletedCount === 0) {
      return res.send({ message: "Conta não encontrada..." });
    }
    const activeAgencyAccounts = (await Account.find({ agencia })).length;
    return res.send({
      message: `Conta excluída! Total de contas ativas para esta agência: ${activeAgencyAccounts}`,
    });
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
});

// 8
router.post("/transfer", async (req, res) => {
  try {
    const { origin, destination, value } = req.body;

    const originAccount = await Account.findOne({ conta: origin });
    const destinationAccount = await Account.findOne({ conta: destination });

    if (!originAccount || !destinationAccount) {
      return res.send({ message: "Contas inválidas..." });
    }

    let valueToDebit = value;
    if (originAccount.agencia !== destinationAccount.agencia) {
      valueToDebit += 8;
    }

    if (originAccount.balance < valueToDebit) {
      return res.send({ message: "Saldo atual insuficiente..." });
    }

    await originAccount.updateOne({ $inc: { balance: -valueToDebit } });
    await destinationAccount.updateOne({ $inc: { balance: value } });

    const updatedAccount = await Account.findOne({ conta: origin }, { _id: 0 });
    res.send(updatedAccount);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

// 9
router.get("/average/:agencia", async (req, res) => {
  try {
    const { agencia } = req.params;
    const data = await Account.aggregate([
      { $match: { agencia: Number(agencia) } },
      {
        $group: {
          _id: "$agencia",
          media: { $avg: "$balance" },
        },
      },
    ]);
    if (data.length === 0) {
      return res.send({ message: "Agência não encontrada..." });
    }
    return res.send(data);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
});

// 10
router.get("/worst/:limit", async (req, res) => {
  try {
    const { limit } = req.params;
    const data = await Account.find(
      null,
      { _id: 0 },
      { sort: { balance: 1, name: 1 }, limit: Number(limit) }
    );
    return res.send(data);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
});

// 11
router.get("/best/:limit", async (req, res) => {
  try {
    const { limit } = req.params;
    const data = await Account.find(
      null,
      { _id: 0 },
      { sort: { balance: -1, name: 1 }, limit: Number(limit) }
    );
    return res.send(data);
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
});

// 12
router.get("/sendToPrivate", async (req, res) => {
  try {
    const data = await Account.aggregate([
      {
        $group: {
          _id: "$agencia",
        },
      },
    ]);

    const updatePromises = data.map(async (agency) => {
      const bestAccount = await Account.findOne({ agencia: agency._id }).sort(
        "-balance"
      );
      return await bestAccount.updateOne({ agencia: 99 });
    });

    Promise.all(updatePromises).then(async (_) => {
      const privateList = await Account.find({ agencia: 99 }, { _id: 0 }).sort(
        "-balance"
      );
      res.send(privateList);
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

export default router;
