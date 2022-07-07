const express = require("express");
const ensureAdmin = require("../../../middleware/ensureAdmin");
const ensureAuth = require("../../../middleware/ensureAuth");
const { newUser, loginUser, getUsers } = require("../../controllers/users");

// init router
const router = express.Router();
// fetch users
router.get("/", ensureAuth, ensureAdmin, getUsers);
// create new user
router.post("/new", newUser);
// create new user
router.post("/login", loginUser);
// delete user
// router.delete("/remove/:id", newBulkTasks);

module.exports = router;
