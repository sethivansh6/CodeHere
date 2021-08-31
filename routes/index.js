const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const sendMail = require("../util/sendEmail");
const isLoggedIn = require("../middleware/isLoggedIn");

const title = "CodeHere.com to make the coding interview easy!";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: title });
});

router.get("/about", function (req, res, next) {
  res.render("about", { title: title });
});

router
  .route("/contact")
  .get(function (req, res, next) {
    res.render("contact", { title: title });
  })
  .post(
    body("name").notEmpty(),
    body("email").isEmail(),
    body("message").notEmpty(),
    function (req, res, next) {
      let errors = validationResult(req);
      if (errors.errors.length > 0) {
        res.render("contact", {
          title: title,
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
          errorMessages: errors.errors,
        });
      } else {
        let response = sendMail(
          req.body.email,
          "New Message from the visitor  😅",
          req.body.message
        );

        if (response == "failure") {
          return console.log("Email Not Sent!");
        }

        res.render("thank", { title: title });
      }
    }
  );

module.exports = router;
