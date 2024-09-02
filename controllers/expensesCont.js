const expenseModel = require("../model/expenseModel");
const userMoneyModel = require("../model/userMoney");
const userModel = require("../model/userAccount");
const jwt = require("jsonwebtoken");

const verifyUserId = (req) => {
  try {
    const jwtToken = req.cookies.jwt;
    const decodedToken = jwt.verify(jwtToken, "secretKey");
    const userId = decodedToken.id;
    return userId;
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


const updateUserMoneyAmount = async (income, amount, userId) => {
  try {
    const userMoney = await userMoneyModel.findOne({ userId });
    const moneyAmount = Number(userMoney.userMoneyAmount);
    const newAmount = Number(amount);
    
    //increase/decreased money amount
    let updatedAmount = income === 'income' ? moneyAmount + newAmount : moneyAmount - newAmount  ;

    userMoney.userMoneyAmount = String(updatedAmount);
    await userMoney.save();
    console.log(userMoney)

    console.log(userMoney)
  } catch (err) {
    return err.message;
  }
};

// Add an expense
exports.addExpense = async (req, res, next) => {
  try {
    const userId = verifyUserId(req);
    const { expenseName, date, description, amount, income } = req.body;
    await expenseModel.create({
      expenseName,
      date,
      description,
      amount,
      income,
      userId,
    });
    await updateUserMoneyAmount(income, amount, userId);
    res.status(201).json({ message: "New Expense was added it" });
  } catch (err) {
    res.status(401).json({ message: err.message });
    next();
  }
};

// User Money Amount
const moneyAmountLeft = async (userId) => {
  // find the user
  const userMoney = await userMoneyModel.findOne({ userId });

  if (userMoney === null) {
    const initialAmount = await userMoneyModel.create({ userId });
    return initialAmount;
  }
  // retrieve the data
  const moneyAmount = userMoney.userMoneyAmount;
  console.log(moneyAmount)
  return moneyAmount;
};

// show expenses
exports.showExpense = async (req, res, next) => {
  try {
    const userId = verifyUserId(req);
    const { username } = await userModel.findOne({ _id: userId });
    const allExpenses = await expenseModel.find({ userId });
    const userMoney = await moneyAmountLeft(userId);
    res
      .status(201)
      .json({ expenses: allExpenses, moneyLeft: userMoney, username });
  } catch (err) {
    res.status(401).json({ message: err.message });
    next();
  }
};
