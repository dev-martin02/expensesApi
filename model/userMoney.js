const mongoose = require("mongoose");
const { Schema } = mongoose;

const userMoneySchema = new Schema({
  userId: { type: String, ref: "User" },
  userMoneyAmount: { type: String, default: 0, required: true },
});

const userMoneyModel = mongoose.model(
  "UserMoney",
  userMoneySchema,
  "userMoney"
);

module.exports = userMoneyModel;
