import mongoose from "mongoose";

const schema = new mongoose.Schema({
  agencia: { type: Number, required: true },
  conta: { type: Number, required: true },
  name: { type: String, required: true },
  balance: { type: Number, min: 18, required: true },
});

export default schema;
