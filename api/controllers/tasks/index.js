const TaskSchema = require("../../models/tasks/");
const asyncHandler = require("express-async-handler");
const errorHandler = require("../../../helper/errrorHandler");

// create task
exports.newTask = asyncHandler(async (req, res) => {
  const { title, user_id } = req.body;
  // check for title and user id
  if (!title || !user_id) {
    return res.status(400).json({
      statusCode: "01",
      message: "Title and user id required",
    });
  }
  try {
    // init task schema obj
    const task = new TaskSchema({
      title,
      user_id,
    });
    // save task to database
    const newTask = await task.save();
    // return newly created task
    return res.status(201).json({
      statusCode: "00",
      data: newTask,
    });
  } catch (error) {
    // send error details
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});

// create bulk tasks
exports.newBulkTasks = asyncHandler(async (req, res) => {
  const { tasks } = req.body;
  if (!tasks || !tasks.length) {
    return res.status(400).json({
      statusCode: "01",
      message: "tasks is required as array of objects",
    });
  }
  try {
    // save bulk tasks to database
    TaskSchema.insertMany(tasks, (error, data) => {
      // check error occured
      if (error) {
        return res.status(400).json({
          statusCode: "02",
          message: errorHandler(error),
        });
      }
      // return newly created task status
      res.status(201).json({
        statusCode: "00",
        message: "Tasks successfully created",
        data,
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

// get all task
exports.getAllTasks = asyncHandler(async (req, res) => {
  try {
    // fetch all tasks
    const tasks = await TaskSchema.find();
    // check for tasks
    if (!tasks) {
      return res.status(400).json({
        statusCode: "01",
        message: "No tasks found",
      });
    }
    //   return all tasks
    res.status(201).json({
      statusCode: "00",
      data: tasks,
    });
  } catch (error) {
    // send error details
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});

// get specific task
exports.getTask = asyncHandler(async (req, res) => {
  // get task id from parameter
  const { id } = req.params;
  // check if task id passed
  if (!id) {
    return res.status(400).json({
      statusCode: "00",
      message: "task id required",
    });
  }

  try {
    // fetch task
    const task = await TaskSchema.findById(id);
    // check for task
    if (!task) {
      return res.status(400).json({
        statusCode: "01",
        message: "No task found",
      });
    }
    //   return task
    res.status(201).json({
      statusCode: "00",
      data: task,
    });
  } catch (error) {
    // send error details
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});

// remove task
exports.removeTask = asyncHandler(async (req, res) => {
  // get task id from parameter
  const { id } = req.params;
  // check if task id passed
  if (!id) {
    return res.status(400).json({
      statusCode: "00",
      message: "task id required",
    });
  }
  // remove tasks
  TaskSchema.deleteOne({ _id: id }, (error, data) => {
    if (error) {
      return res.status(400).json({
        statusCode: "02",
        message: errorHandler(error),
      });
    }
    res.status(200).json({
      statusCode: "00",
      message: "Task deleted",
    });
  });
});

// remove bulk tasks
exports.removeBulkTasks = asyncHandler(async (req, res) => {
  const { taskIds } = req.body;
  // check tasks
  if (!taskIds.length) {
    return res.status(400).json({
      statusCode: "01",
      message: "tasks is required as array",
    });
  }
  try {
    // batch remove tasks
    TaskSchema.deleteMany({ _id: { $in: taskIds } }, (error, data) => {
      if (error) {
        return res.status(400).json({
          statusCode: "02",
          message: errorHandler(error),
        });
      }
      res.status(200).json({
        statusCode: "00",
        message: "Tasks deleted",
      });
    });
  } catch (error) {
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});

// update task
exports.updateTask = asyncHandler(async (req, res) => {
  const { id, title, completed } = req.body;
  // check tasks
  if (!id || !title) {
    return res.status(400).json({
      statusCode: "01",
      message: "task id and title are required",
    });
  }
  try {
    // batch remove tasks
    TaskSchema.updateOne({ _id: id }, { title, completed }, (error, data) => {
      if (error) {
        return res.status(400).json({
          statusCode: "02",
          message: errorHandler(error),
        });
      }
      res.status(200).json({
        statusCode: "00",
        message: "Tasks updated",
        data,
      });
    });
  } catch (error) {
    res.status(400).json({
      statusCode: "02",
      message: errorHandler(error),
    });
  }
});
