const express = require("express");
const ensureAdmin = require("../../../middleware/ensureAdmin");
const ensureAuth = require("../../../middleware/ensureAuth");
const {
  newTask,
  newBulkTasks,
  getAllTasks,
  getTask,
  removeTask,
  removeBulkTasks,
  updateTask,
} = require("../../controllers/tasks/");

// init server
const router = express.Router();
// create new task
router.post("/new", ensureAuth, ensureAdmin, newTask);
// create new task
router.post("/new/bulk", ensureAuth, ensureAdmin, newBulkTasks);
// get tasks
router.get("/", ensureAuth, getAllTasks);
// get specific task
router.get("/:id", getTask);
// delete bulks tasks
router.delete("/remove/bulk", ensureAuth, ensureAdmin, removeBulkTasks);
// delete task
router.delete("/remove/:id", ensureAuth, ensureAdmin, removeTask);
// update bulks tasks
router.patch("/update", ensureAuth, ensureAdmin, updateTask);

module.exports = router;
