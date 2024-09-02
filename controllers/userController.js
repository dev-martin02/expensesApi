const UserModelAccount = require("../model/userAccount");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createToken = (id) => {
  return jwt.sign({ id }, "secretKey", { expiresIn: "1h" });
};

//Sign Up
exports.signUp = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const salt = await bcrypt.genSalt();

    console.log(salt);

    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    const newUser = await UserModelAccount.create({
      username,
      email,
      password: hashPassword,
    });

    const token = createToken(newUser._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
    });

    res
      .status(201)
      .json({ message: `Username ${username} was successfully added it!` });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkUser = await UserModelAccount.findOne({ email });
    if (!checkUser) {
      throw new Error("User not found!");
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      throw new Error("Wrong password!");
    }
    const token = await createToken(checkUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
    });
    res.status(201).json({ username: checkUser.username });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//LogOut backend
exports.logOut = async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    maxAge: 1,
    sameSite: "none",
    partitioned: true,
  });
  console.log("BYE BYE");
  res.status(200).json({ message: "Logged out successfully" });
};
