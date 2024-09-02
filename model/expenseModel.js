const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseSchema = new Schema({
  expenseName: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  income: { type: String, default: false },
  userId: { type: String, ref: "User" },
});

const expenseModel = mongoose.model("expenses", expenseSchema);

module.exports = expenseModel;
