const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// tasks schema
const UserSchema = require("../../models/users/");
const asyncHandler = require("express-async-handler");
const errorHandler = require("../../../helper/errrorHandler");

// create user
exports.newUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  // check for title and user id
  if (!name || !password) {
    return res.status(400).json({
      statusCode: "01",
      message: "user name and password are required",
    });
  }
  try {
    // check if user exist
    const userWithEmail = await UserSchema.findOne({ email });
    if (userWithEmail) {
      return res.status(400).json({
        statusCode: "02",
        message: `User with ${email} already exist`,
      });
    }
    // salt password and save user
    bcrypt.genSalt(10, (error, salt) => {
      // init new user schema
      const newUser = new UserSchema({
        name,
        email,
        password,
        role,
      });
      bcrypt.hash(password, salt, async (error, hash) => {
        if (error) {
          return res.status(400).json({
            statusCode: "02",
            message: errorHandler(error),
          });
        }
        newUser.password = hash;
        const savedUser = await newUser.save();
        return res.status(201).json({
          statusCode: "00",
          message: "User successfully created",
          data: savedUser,
        });
      });
    });
  } catch (error) {
    // send error details
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});

// login handler
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check for title and user id
  if (!email || !password) {
    return res.status(400).json({
      statusCode: "01",
      message: "email and password are required",
    });
  }
  try {
    // check if user exist
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({
        statusCode: "02",
        message: `Email or password is incorrect`,
      });
    }
    // Match password
    bcrypt.compare(password, user.password, (error, isMatch) => {
      if (error) {
        return res.status(400).json({
          statusCode: "02",
          message: errorHandler(error),
        });
      }
      if (isMatch) {
        const token = jwt.sign({ user }, "later", {
          expiresIn: "12h",
        });
        return res.status(200).json({
          message: "Successfully logged in",
          statusCode: "00",
          token,
        });
      } else {
        return res.status(400).json({
          status: "fail",
          status_code: 102,
          message: "Email or password is incorrect",
        });
      }
    });
  } catch (error) {
    // send error details
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});

// fetch users
exports.getUsers = asyncHandler(async (req, res) => {
  try {
    // check if user exist
    const users = await UserSchema.find();
    if (!users) {
      return res.status(404).json({
        statusCode: "02",
        message: `No user found`,
      });
    }
    res.status(200).json({
      statusCode: "02",
      data: users,
    });
  } catch (error) {
    // send error details
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});
