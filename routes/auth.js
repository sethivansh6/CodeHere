const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const isLoggedIn = require("../middleware/isLoggedIn");

router
  .route("/login")
  .get(function (req, res, next) {
    res.render("login", { title: "Login your account" });
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
    }),
    function (req, res) {
      res.redirect("/");
    }
  );

router
  .route("/register")
  .get(function (req, res, next) {
    res.render("register", { title: "Register a new account" });
  })
  .post(
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").notEmpty(),
    function (req, res, next) {
      let errors = validationResult(req);

      if (
        req.body.password != req.body.cnfPassword ||
        req.body.password == ""
      ) {
        errors.errors.push({
          value: req.body.cnfPassword,
          msg: "Password do not match",
          param: "Confirm Password",
          location: "body",
        });
      }

      console.log(errors.errors);

      if (errors.errors.length > 0) {
        res.render("register", {
          name: req.body.name,
          email: req.body.email,
          errorMessages: errors.errors,
        });
      } else {
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);

        user.save(function (err) {
          if (err) {
            res.render("register", { errorMesages: err });
          } else {
            res.redirect("/login");
          }
        });
        console.log(user);
      }
    }
  );

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

module.exports = router;
