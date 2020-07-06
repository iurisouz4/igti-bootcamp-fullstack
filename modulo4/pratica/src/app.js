import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import accountsRouter from "./routes/accounts.js";

const port = 3000;
const dbConn = "mongodb://localhost/bank";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/accounts", accountsRouter);

mongoose.connect(dbConn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`Database connection established on: ${dbConn}`);
});

app.listen(port, () => {
  console.log(`API started on port: ${port}`);
});
