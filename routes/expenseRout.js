const expensesControllers = require("../controllers/expensesCont");
const express = require("express");
const route = express.Router();
const { requireAuth } = require("../middleware/authentication");

// route.use(requireAuth);

route.get("/", requireAuth, expensesControllers.showExpense);
route.post("/", requireAuth, expensesControllers.addExpense);

module.exports = route;
