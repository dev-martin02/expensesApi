const express = require("express");
const route = express.Router();

const userControllers = require("../controllers/userController");

route.get("/logOut", userControllers.logOut);
route.post("/signUp", userControllers.signUp);
route.post("/login", userControllers.login);

module.exports = route;
