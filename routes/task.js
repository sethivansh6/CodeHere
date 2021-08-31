const express = require("express");
const task = require("../models/task");
const user = require("../models/user");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const sendMail = require("../util/sendEmail");

router.post("/createTask",isLoggedIn, function (req, res) {
  let newTask = new Task();
  newTask.title = req.body.title;

  newTask.save(function (err, data) {
    if (err) {
      console.log(err);
      res.render("error");
    } else {
      req.user.tasks.push(data);
      req.user.save();
      res.redirect("/task/" + data._id);
    }
  });
});

router.get("/task/:id", function (req, res) {
  if (req.params.id) {
    Task.findOne({ _id: req.params.id }, function (err, data) {
      if (err) {
        console.log(err);
        res.render("error");
      }

      if (data) {
        res.render("task", { content: data.content, roomId: data.id });
      } else {
        res.render("error");
      }
    });
  } else {
    res.render("error");
  }
});

router.get("/showUserTasks",isLoggedIn, function (req, res) {
  console.log(req.user._id);
  User.findById(req.user._id)
    .populate("tasks")
    .exec(function (err, found) {
      if (err) {
        res.render("error");
      } else {
        let tasks = found.tasks;
        tasks.sort(function (m1, m2) {
          return m2.createdAt - m1.createdAt;
        });
        console.log(tasks);
        res.render("showTask", {
          tasks: tasks,
        });
      }
    });
});


router.post('/invite/:id', isLoggedIn, async function (req, res) {

  let email = req.body.email;

  let protocol = req.protocol;
  let host = req.get("host");

  let link =  `${protocol}://${host}/task/${req.params.id}`

  let task = await Task.findById(req.params.id);

  let subject = "Invitation for coding " + task.title + " with " + req.user.name;
  let message = `<h4> You are invited by ${req.user.name} for task ${task.title} </h4>
  <h5> To begin the task click the button below</h5>
  </br>
  <a href='${link}'>Click here</a>`;

  let response = sendMail(email, subject, message);

  let user = await User.findById(req.user._id).populate("tasks");

  if (response == "success") {
    res.render("showTask", {
      message: "Invitation successfully sent to " + email,
      tasks: user.tasks,
    });
  } else {
    res.render("showTask", {
      message: "Invitation failed",
      tasks:user.tasks
    });
  }
})

module.exports = router;
