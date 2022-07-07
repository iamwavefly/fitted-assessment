const express = require("express");
const taskRouter = require("./api/routes/tasks");
const userRouter = require("./api/routes/users");
const mongoose = require("mongoose");

// init express
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// db connection url
const db = require("./config/dbConnect").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// routes config
app.get("/", (req, res) => {
  res.send("Hello, world");
});
// middlewares
// task routes
app.use("/api/v1/tasks/", taskRouter);
// user routes
app.use("/api/v1/users/", userRouter);

// listen to server port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
